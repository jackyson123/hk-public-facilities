"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  SAMPLE_FACILITIES,
  Facility,
  FacilityType,
  FACILITY_META,
  DISTRICTS,
  RADIUS_OPTIONS,
  getDistanceMeters,
  isOpenNow,
} from "@/data/facilities";
import FacilityList from "@/components/FacilityList";
import DetailPanel from "@/components/DetailPanel";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { parseUrlState, buildUrlQuery } from "@/lib/urlState";
import {
  LocateFixed,
  Filter,
  Languages,
  Map as MapIcon,
  List,
  X,
  Moon,
  Sun,
  Heart,
  Search,
  Accessibility,
  MapPinned,
  Share2,
  Loader2,
  Database,
} from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
      Loading map…
    </div>
  ),
});

const ALL_TYPES: FacilityType[] = ["toilet", "water", "ev", "wifi", "clinic", "shelter"];

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSynced = useRef(false);

  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [dark, setDark] = useState(false);
  const [activeTypes, setActiveTypes] = useState<Set<FacilityType>>(new Set(ALL_TYPES));
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [flyLat, setFlyLat] = useState<number | null>(null);
  const [flyLng, setFlyLng] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);
  const [radius, setRadius] = useState(0);
  const [onlyAccessible, setOnlyAccessible] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showDistricts, setShowDistricts] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>(SAMPLE_FACILITIES);
  const [dataStatus, setDataStatus] = useState<"loading" | "live" | "sample">("loading");
  const [toiletCount, setToiletCount] = useState(0);

  // Load FEHD real toilets + merge with sample non-toilets
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/fehd-toilets");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (cancelled) return;
        const realToilets: Facility[] = (data.facilities || []).map((t: Facility) => ({
          ...t,
          source: "FEHD",
        }));
        const others = SAMPLE_FACILITIES.filter((f) => f.type !== "toilet");
        setFacilities([...realToilets, ...others]);
        setToiletCount(realToilets.length);
        setDataStatus("live");
      } catch {
        if (!cancelled) {
          setFacilities(SAMPLE_FACILITIES);
          setDataStatus("sample");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Init from URL once
  useEffect(() => {
    if (urlSynced.current) return;
    const s = parseUrlState(searchParams);
    if (s.types) setActiveTypes(new Set(s.types));
    if (s.radius != null) setRadius(s.radius);
    if (s.accessible) setOnlyAccessible(true);
    if (s.open) setOnlyOpen(true);
    if (s.fav) setOnlyFav(true);
    if (s.q) setSearch(s.q);
    if (s.lang) setLang(s.lang);
    if (s.dark != null) setDark(s.dark);
    if (s.id) setSelectedId(s.id);
    if (s.lat != null && s.lng != null) {
      setFlyLat(s.lat);
      setFlyLng(s.lng);
    }
    setFavorites(getFavorites());
    if (s.dark == null) {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    urlSynced.current = true;
  }, [searchParams]);

  // Write URL when state changes
  useEffect(() => {
    if (!urlSynced.current) return;
    const q = buildUrlQuery({
      types: Array.from(activeTypes),
      radius,
      accessible: onlyAccessible,
      open: onlyOpen,
      fav: onlyFav,
      q: search,
      lang,
      dark,
      id: selectedId || undefined,
      lat: flyLat ?? undefined,
      lng: flyLng ?? undefined,
    });
    const next = `${pathname}${q}`;
    const current = `${pathname}${window.location.search}`;
    if (next !== current) {
      router.replace(next, { scroll: false });
    }
  }, [
    activeTypes,
    radius,
    onlyAccessible,
    onlyOpen,
    onlyFav,
    search,
    lang,
    dark,
    selectedId,
    flyLat,
    flyLng,
    pathname,
    router,
  ]);

  const filtered = useMemo(() => {
    let list = facilities.filter((f) => activeTypes.has(f.type));
    if (onlyAccessible) list = list.filter((f) => f.accessible);
    if (onlyOpen) list = list.filter((f) => isOpenNow(f.openSchedule) === true);
    if (onlyFav) list = list.filter((f) => favorites.includes(f.id));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          f.nameZh.includes(search.trim()) ||
          f.nameEn.toLowerCase().includes(q) ||
          f.addressZh.includes(search.trim()) ||
          f.addressEn.toLowerCase().includes(q) ||
          f.districtZh.includes(search.trim()) ||
          f.districtEn.toLowerCase().includes(q)
      );
    }
    if (radius > 0 && userLat != null && userLng != null) {
      list = list.filter(
        (f) => getDistanceMeters(userLat, userLng, f.lat, f.lng) <= radius
      );
    }
    return list;
  }, [facilities, activeTypes, onlyAccessible, onlyOpen, onlyFav, favorites, search, radius, userLat, userLng]);

  const selected = useMemo(
    () => (selectedId ? facilities.find((f) => f.id === selectedId) ?? null : null),
    [selectedId, facilities]
  );

  const toggleType = (t: FacilityType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) {
        if (next.size > 1) next.delete(t);
      } else next.add(t);
      return next;
    });
  };

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert(lang === "zh" ? "你的瀏覽器不支援定位" : "Geolocation not supported");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setFlyLat(pos.coords.latitude);
        setFlyLng(pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert(lang === "zh" ? "無法取得位置，請檢查權限" : "Unable to get location");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [lang]);

  const onToggleFav = (id: string) => setFavorites(toggleFavorite(id));

  const jumpDistrict = (lat: number, lng: number) => {
    setFlyLat(lat);
    setFlyLng(lng);
    setShowDistricts(false);
    setMobileView("map");
  };

  const sharePage = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: lang === "zh" ? "香港公共設施地圖" : "HK Public Facilities Map",
        url,
      }).catch(() => navigator.clipboard?.writeText(url));
    } else {
      navigator.clipboard?.writeText(url).then(() =>
        alert(lang === "zh" ? "已複製連結" : "Link copied")
      );
    }
  };

  const bg = dark ? "bg-gray-950" : "bg-gray-50";
  const card = dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`h-dvh flex flex-col ${bg} ${text}`}>
      <header className={`shrink-0 border-b px-3 py-2.5 flex items-center justify-between gap-2 z-20 ${card}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl">🗺️</span>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base truncate">
              {lang === "zh" ? "香港公共設施地圖" : "HK Public Facilities"}
            </h1>
            <p className={`text-[10px] sm:text-xs truncate flex items-center gap-1 ${muted}`}>
              {dataStatus === "loading" && (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {lang === "zh" ? "載入政府數據…" : "Loading gov data…"}
                </>
              )}
              {dataStatus === "live" && (
                <>
                  <Database className="h-3 w-3 text-green-500" />
                  {lang === "zh"
                    ? `FEHD 公廁 ${toiletCount} 個 · 實時`
                    : `FEHD ${toiletCount} toilets · live`}
                </>
              )}
              {dataStatus === "sample" && (
                <>{lang === "zh" ? "示範數據（離線）" : "Sample data (offline)"}</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button onClick={sharePage} className={`p-2 rounded-lg ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`} title="Share">
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button onClick={() => setDark((d) => !d)} className={`p-2 rounded-lg ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            {dark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
          <button onClick={() => setLang((l) => (l === "zh" ? "en" : "zh"))} className={`p-2 rounded-lg ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button onClick={() => setShowDistricts((v) => !v)} className={`p-2 rounded-lg ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            <MapPinned className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button onClick={() => setShowFilters((v) => !v)} className={`p-2 rounded-lg relative ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            {(activeTypes.size < ALL_TYPES.length || onlyAccessible || onlyOpen || onlyFav || radius > 0) && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500" />
            )}
          </button>
          <button onClick={locateMe} disabled={locating} className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            <LocateFixed className={`h-4 w-4 sm:h-5 sm:w-5 ${locating ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </header>

      <div className={`shrink-0 px-3 py-2 border-b ${card}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${muted}`} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "zh" ? "搜尋名稱、地址、地區…" : "Search name, address, district…"}
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none border ${
              dark ? "bg-gray-800 border-gray-700 placeholder:text-gray-500" : "bg-gray-50 border-gray-200 placeholder:text-gray-400"
            }`}
          />
        </div>
      </div>

      {showDistricts && (
        <div className={`shrink-0 border-b px-3 py-2 z-20 max-h-40 overflow-y-auto ${card}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium">{lang === "zh" ? "快速跳轉分區" : "Jump to district"}</span>
            <button onClick={() => setShowDistricts(false)}><X className="h-4 w-4" /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DISTRICTS.map((d) => (
              <button
                key={d.en}
                onClick={() => jumpDistrict(d.lat, d.lng)}
                className={`px-2.5 py-1 rounded-full text-xs border ${dark ? "border-gray-600 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}
              >
                {lang === "zh" ? d.zh : d.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {showFilters && (
        <div className={`shrink-0 border-b px-3 py-3 z-20 space-y-3 ${card}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{lang === "zh" ? "篩選" : "Filters"}</span>
            <button onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TYPES.map((t) => {
              const meta = FACILITY_META[t];
              const active = activeTypes.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    active ? "text-white border-transparent" : dark ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"
                  }`}
                  style={active ? { backgroundColor: meta.color } : undefined}
                >
                  {meta.emoji} {lang === "zh" ? meta.labelZh : meta.labelEn}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className={muted}>{lang === "zh" ? "距離" : "Radius"}:</span>
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRadius(r.value)}
                className={`px-2.5 py-1 rounded-full border ${
                  radius === r.value ? "bg-blue-600 text-white border-blue-600" : dark ? "border-gray-600" : "border-gray-200"
                }`}
              >
                {lang === "zh" ? r.labelZh : r.labelEn}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOnlyAccessible((v) => !v)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${
                onlyAccessible ? "bg-blue-600 text-white border-blue-600" : dark ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <Accessibility className="h-3.5 w-3.5" />
              {lang === "zh" ? "暢通易達" : "Accessible"}
            </button>
            <button
              onClick={() => setOnlyOpen((v) => !v)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${
                onlyOpen ? "bg-green-600 text-white border-green-600" : dark ? "border-gray-600" : "border-gray-200"
              }`}
            >
              {lang === "zh" ? "現正開放" : "Open now"}
            </button>
            <button
              onClick={() => setOnlyFav((v) => !v)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${
                onlyFav ? "bg-red-500 text-white border-red-500" : dark ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              {lang === "zh" ? "收藏" : "Favorites"}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`hidden md:flex w-80 shrink-0 flex-col border-r ${card}`}>
          <div className={`px-4 py-2 text-xs border-b ${muted} ${dark ? "border-gray-700" : "border-gray-100"}`}>
            {lang === "zh" ? `顯示 ${filtered.length} 個設施` : `Showing ${filtered.length} facilities`}
            {favorites.length > 0 && ` · ${favorites.length} ${lang === "zh" ? "收藏" : "fav"}`}
          </div>
          <FacilityList
            facilities={filtered}
            userLat={userLat}
            userLng={userLng}
            selectedId={selectedId}
            favorites={favorites}
            onSelect={(id) => {
              setSelectedId(id);
              const f = facilities.find((x) => x.id === id);
              if (f) {
                setFlyLat(f.lat);
                setFlyLng(f.lng);
              }
            }}
            onToggleFav={onToggleFav}
            lang={lang}
            dark={dark}
          />
        </aside>

        <div className={`flex-1 relative ${mobileView === "list" ? "hidden md:block" : "block"}`}>
          <Map
            facilities={filtered}
            userLat={userLat}
            userLng={userLng}
            flyLat={flyLat}
            flyLng={flyLng}
            radiusMeters={radius}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              if (id) {
                const f = facilities.find((x) => x.id === id);
                if (f) {
                  setFlyLat(f.lat);
                  setFlyLng(f.lng);
                }
              }
            }}
            lang={lang}
            dark={dark}
          />
          {selected && (
            <DetailPanel
              facility={selected}
              userLat={userLat}
              userLng={userLng}
              isFav={favorites.includes(selected.id)}
              onClose={() => setSelectedId(null)}
              onToggleFav={() => onToggleFav(selected.id)}
              lang={lang}
              dark={dark}
            />
          )}
        </div>

        <div className={`absolute inset-0 z-10 flex flex-col md:hidden ${card} ${mobileView === "list" ? "block" : "hidden"}`}>
          <div className={`px-4 py-2 text-xs border-b ${muted}`}>
            {lang === "zh" ? `顯示 ${filtered.length} 個設施` : `Showing ${filtered.length}`}
          </div>
          <FacilityList
            facilities={filtered}
            userLat={userLat}
            userLng={userLng}
            selectedId={selectedId}
            favorites={favorites}
            onSelect={(id) => {
              setSelectedId(id);
              setMobileView("map");
              const f = facilities.find((x) => x.id === id);
              if (f) {
                setFlyLat(f.lat);
                setFlyLng(f.lng);
              }
            }}
            onToggleFav={onToggleFav}
            lang={lang}
            dark={dark}
          />
        </div>
      </div>

      <div className={`md:hidden shrink-0 border-t flex z-20 ${card}`}>
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${mobileView === "map" ? "text-blue-500" : muted}`}
        >
          <MapIcon className="h-5 w-5" />
          {lang === "zh" ? "地圖" : "Map"}
        </button>
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${mobileView === "list" ? "text-blue-500" : muted}`}
        >
          <List className="h-5 w-5" />
          {lang === "zh" ? "列表" : "List"}
        </button>
      </div>

      <footer className={`hidden md:block shrink-0 border-t px-4 py-1 text-[10px] text-center ${muted} ${card}`}>
        {dataStatus === "live" ? "Public toilet data from FEHD · " : ""}
        <a href="https://data.gov.hk" target="_blank" rel="noopener noreferrer" className="underline">
          data.gov.hk
        </a>
        {" · "}
        <a href="https://www.fehd.gov.hk" target="_blank" rel="noopener noreferrer" className="underline">
          FEHD
        </a>
      </footer>
    </div>
  );
}

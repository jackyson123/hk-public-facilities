"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  SAMPLE_FACILITIES,
  FacilityType,
  FACILITY_META,
} from "@/data/facilities";
import FacilityList from "@/components/FacilityList";
import {
  LocateFixed,
  Filter,
  Languages,
  Map as MapIcon,
  List,
  X,
} from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
      Loading map…
    </div>
  ),
});

const ALL_TYPES: FacilityType[] = ["toilet", "water", "ev", "wifi", "clinic"];

export default function HomePage() {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [activeTypes, setActiveTypes] = useState<Set<FacilityType>>(
    new Set(ALL_TYPES)
  );
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(
    () => SAMPLE_FACILITIES.filter((f) => activeTypes.has(f.type)),
    [activeTypes]
  );

  const toggleType = (t: FacilityType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) {
        if (next.size > 1) next.delete(t);
      } else {
        next.add(t);
      }
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
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert(
          lang === "zh"
            ? "無法取得位置，請檢查權限"
            : "Unable to get location. Check permissions."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [lang]);

  return (
    <div className="h-dvh flex flex-col bg-gray-50">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl">🗺️</span>
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 text-base truncate">
              {lang === "zh" ? "香港公共設施地圖" : "HK Public Facilities"}
            </h1>
            <p className="text-xs text-gray-500 truncate">
              {lang === "zh"
                ? "公廁 · 飲水機 · EV · Wi-Fi · 診所"
                : "Toilets · Water · EV · Wi-Fi · Clinics"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLang((l) => (l === "zh" ? "en" : "zh"))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="Language"
          >
            <Languages className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative"
          >
            <Filter className="h-5 w-5" />
            {activeTypes.size < ALL_TYPES.length && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500" />
            )}
          </button>
          <button
            onClick={locateMe}
            disabled={locating}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            title={lang === "zh" ? "定位" : "Locate me"}
          >
            <LocateFixed
              className={`h-5 w-5 ${locating ? "animate-pulse" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Filters panel */}
      {showFilters && (
        <div className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 z-20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {lang === "zh" ? "設施類型" : "Facility types"}
            </span>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_TYPES.map((t) => {
              const meta = FACILITY_META[t];
              const active = activeTypes.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    active
                      ? "text-white border-transparent"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                  style={
                    active
                      ? { backgroundColor: meta.color }
                      : undefined
                  }
                >
                  <span>{meta.emoji}</span>
                  {lang === "zh" ? meta.labelZh : meta.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-80 shrink-0 flex-col bg-white border-r border-gray-200">
          <div className="px-4 py-2 text-xs text-gray-500 border-b">
            {lang === "zh"
              ? `顯示 ${filtered.length} 個設施`
              : `Showing ${filtered.length} facilities`}
          </div>
          <FacilityList
            facilities={filtered}
            userLat={userLat}
            userLng={userLng}
            selectedId={selectedId}
            onSelect={setSelectedId}
            lang={lang}
          />
        </aside>

        {/* Map */}
        <div
          className={`flex-1 relative ${
            mobileView === "list" ? "hidden md:block" : "block"
          }`}
        >
          <Map
            facilities={filtered}
            userLat={userLat}
            userLng={userLng}
            selectedId={selectedId}
            onSelect={setSelectedId}
            lang={lang}
          />
        </div>

        {/* Mobile list */}
        <div
          className={`absolute inset-0 bg-white z-10 flex flex-col md:hidden ${
            mobileView === "list" ? "block" : "hidden"
          }`}
        >
          <div className="px-4 py-2 text-xs text-gray-500 border-b">
            {lang === "zh"
              ? `顯示 ${filtered.length} 個設施`
              : `Showing ${filtered.length} facilities`}
          </div>
          <FacilityList
            facilities={filtered}
            userLat={userLat}
            userLng={userLng}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setMobileView("map");
            }}
            lang={lang}
          />
        </div>
      </div>

      {/* Mobile bottom toggle */}
      <div className="md:hidden shrink-0 bg-white border-t border-gray-200 flex z-20">
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${
            mobileView === "map" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <MapIcon className="h-5 w-5" />
          {lang === "zh" ? "地圖" : "Map"}
        </button>
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${
            mobileView === "list" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <List className="h-5 w-5" />
          {lang === "zh" ? "列表" : "List"}
        </button>
      </div>

      {/* Footer note */}
      <footer className="hidden md:block shrink-0 bg-white border-t border-gray-100 px-4 py-1.5 text-[10px] text-gray-400 text-center">
        Data inspired by FEHD / EPD / CSDI open data · Demo only ·{" "}
        <a
          href="https://data.gov.hk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          data.gov.hk
        </a>
      </footer>
    </div>
  );
}

import { NextResponse } from "next/server";

export const revalidate = 3600;

type Fac = {
  id: string;
  type: string;
  nameZh: string;
  nameEn: string;
  addressZh: string;
  addressEn: string;
  lat: number;
  lng: number;
  districtZh: string;
  districtEn: string;
  openHours?: string;
  openSchedule?: string;
  remarks?: string;
  accessible?: boolean;
  source?: string;
  chargerTypes?: string[];
};

function parseCoord(s: string): { lat: number; lng: number } | null {
  // supports "22.42306N,113.92585E" or "22.283733,114.151492"
  const cleaned = s.replace(/[NSEW]/gi, "").trim();
  const parts = cleaned.split(/[,;\s]+/).filter(Boolean);
  if (parts.length < 2) return null;
  let lat = parseFloat(parts[0]);
  let lng = parseFloat(parts[1]);
  if (s.toUpperCase().includes("S")) lat = -Math.abs(lat);
  if (s.toUpperCase().includes("W")) lng = -Math.abs(lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  // Hong Kong sanity
  if (lat < 22 || lat > 23 || lng < 113.5 || lng > 114.5) return null;
  return { lat, lng };
}

async function fetchFehdToilets(): Promise<Fac[]> {
  const res = await fetch("https://www.fehd.gov.hk/english/map/fehd_map_e.xml", {
    next: { revalidate: 3600 },
    headers: { "User-Agent": "HK-Public-Facilities/1.2" },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  const mapBlocks = xml.match(/<map>[\s\S]*?<\/map>/gi) || [];
  const districtMap: Record<string, { zh: string; en: string }> = {
    CW: { zh: "中西區", en: "Central and Western" },
    E: { zh: "東區", en: "Eastern" },
    S: { zh: "南區", en: "Southern" },
    Wch: { zh: "灣仔區", en: "Wan Chai" },
    Is: { zh: "離島區", en: "Islands" },
    YT: { zh: "油尖旺區", en: "Yau Tsim Mong" },
    MK: { zh: "油尖旺區", en: "Yau Tsim Mong" },
    SSP: { zh: "深水埗區", en: "Sham Shui Po" },
    KC: { zh: "九龍城區", en: "Kowloon City" },
    WTS: { zh: "黃大仙區", en: "Wong Tai Sin" },
    KT: { zh: "觀塘區", en: "Kwun Tong" },
    TW: { zh: "荃灣區", en: "Tsuen Wan" },
    TM: { zh: "屯門區", en: "Tuen Mun" },
    YL: { zh: "元朗區", en: "Yuen Long" },
    N: { zh: "北區", en: "North" },
    TP: { zh: "大埔區", en: "Tai Po" },
    ST: { zh: "沙田區", en: "Sha Tin" },
    SK: { zh: "西貢區", en: "Sai Kung" },
    KwT: { zh: "葵青區", en: "Kwai Tsing" },
  };
  const out: Fac[] = [];
  for (const block of mapBlocks) {
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
      return m ? m[1].trim().replace(/&amp;/g, "&") : "";
    };
    const mapType = get("map_type").toLowerCase();
    if (!mapType.includes("toilet")) continue;
    const coord = get("map_coordinate");
    const c = parseCoord(coord);
    if (!c) continue;
    const id = `fehd-${get("mapID") || `${c.lat}-${c.lng}`}`;
    const d = districtMap[get("districtID")] || { zh: "香港", en: "Hong Kong" };
    const nameEn = get("name_e") || "Public Toilet";
    const nameZh = get("name_c") || get("name_e") || "公廁";
    const openHr = get("openHr_e") || get("openHr_c") || "";
    const openSchedule =
      openHr.toLowerCase().includes("24") || openHr.includes("全日") ? "24h" : openHr || undefined;
    out.push({
      id,
      type: "toilet",
      nameZh,
      nameEn,
      addressZh: get("address_c") || get("address_e"),
      addressEn: get("address_e") || get("address_c"),
      lat: c.lat,
      lng: c.lng,
      districtZh: d.zh,
      districtEn: d.en,
      openHours: openHr || undefined,
      openSchedule,
      remarks: (() => {
        const r = get("remarks_e") || get("remarks_c");
        return r && r !== "N/A" ? r : undefined;
      })(),
      accessible:
        nameEn.toLowerCase().includes("accessible") ||
        nameZh.includes("暢通") ||
        nameZh.includes("無障礙"),
      source: "FEHD",
    });
  }
  return out;
}

async function fetchEpdWater(): Promise<Fac[]> {
  const res = await fetch("https://www.epd.gov.hk/datagovhk/EPD_Water_Dispenser_Eng.csv", {
    next: { revalidate: 3600 },
    headers: { "User-Agent": "HK-Public-Facilities/1.2" },
  });
  if (!res.ok) return [];
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  // CSV may have multiline header - find header with Latitude
  let headerIdx = 0;
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].toLowerCase().includes("latitude")) {
      headerIdx = i;
      break;
    }
  }
  const header = lines[headerIdx];
  const cols = header.split(",").map((c) => c.replace(/^"|"$/g, "").trim().toLowerCase());
  const idx = (names: string[]) => {
    for (const n of names) {
      const i = cols.findIndex((c) => c.includes(n));
      if (i >= 0) return i;
    }
    return -1;
  };
  const iName = idx(["name of building", "name"]);
  const iStreet = idx(["street"]);
  const iDistrict = idx(["district"]);
  const iRegion = idx(["region"]);
  const iLoc = idx(["location of water"]);
  const iLat = idx(["latitude"]);
  const iLng = idx(["longitude"]);
  const iFrom = idx(["service hours (from)", "from"]);
  const iTo = idx(["service hours (to)", "to"]);
  const iType = idx(["type of water"]);
  const out: Fac[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    // simple CSV split (handles quoted fields roughly)
    const row: string[] = [];
    let cur = "";
    let inQ = false;
    for (const ch of lines[i]) {
      if (ch === '"') inQ = !inQ;
      else if (ch === "," && !inQ) {
        row.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    row.push(cur.trim());
    if (row.length < 5) continue;
    const latRaw = iLat >= 0 ? row[iLat] : "";
    const lngRaw = iLng >= 0 ? row[iLng] : "";
    const c = parseCoord(`${latRaw},${lngRaw}`);
    if (!c) continue;
    const name = (iName >= 0 ? row[iName] : "") || "Water Dispenser";
    const street = iStreet >= 0 ? row[iStreet] : "";
    const district = iDistrict >= 0 ? row[iDistrict] : "";
    const region = iRegion >= 0 ? row[iRegion] : "";
    const loc = iLoc >= 0 ? row[iLoc] : "";
    const from = iFrom >= 0 ? row[iFrom] : "";
    const to = iTo >= 0 ? row[iTo] : "";
    const wtype = iType >= 0 ? row[iType] : "";
    const hours =
      from && to ? `${from}-${to}` : from || to || undefined;
    out.push({
      id: `epd-water-${c.lat.toFixed(5)}-${c.lng.toFixed(5)}-${i}`,
      type: "water",
      nameZh: name,
      nameEn: name,
      addressZh: [loc, street, district].filter(Boolean).join(", "),
      addressEn: [loc, street, district, region].filter(Boolean).join(", "),
      lat: c.lat,
      lng: c.lng,
      districtZh: district || region || "香港",
      districtEn: district || region || "Hong Kong",
      openHours: hours,
      openSchedule: hours,
      remarks: wtype || undefined,
      source: "EPD",
    });
  }
  return out;
}

export async function GET() {
  try {
    const [toilets, water] = await Promise.all([
      fetchFehdToilets().catch(() => [] as Fac[]),
      fetchEpdWater().catch(() => [] as Fac[]),
    ]);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      counts: {
        toilet: toilets.length,
        water: water.length,
      },
      facilities: [...toilets, ...water],
      sources: {
        toilet: toilets.length ? "FEHD" : null,
        water: water.length ? "EPD" : null,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load facilities" }, { status: 500 });
  }
}

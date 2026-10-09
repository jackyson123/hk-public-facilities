import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

type RawMap = {
  mapID?: string;
  districtID?: string;
  map_type?: string;
  name_e?: string;
  name_c?: string;
  address_e?: string;
  address_c?: string;
  openHr_e?: string;
  openHr_c?: string;
  map_coordinate?: string;
  remarks_e?: string;
  remarks_c?: string;
  contact1?: string;
};

function parseXmlToilets(xml: string) {
  const facilities: Array<{
    id: string;
    type: "toilet";
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
    source: string;
  }> = [];

  // Simple regex parse for <map>...</map> blocks (FEHD XML structure)
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

  for (const block of mapBlocks) {
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
      return m ? m[1].trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") : "";
    };

    const mapType = get("map_type").toLowerCase();
    // Only public toilets (and accessible variants)
    if (
      mapType !== "toilet" &&
      mapType !== "portable_toilet" &&
      !mapType.includes("toilet")
    ) {
      continue;
    }

    const coord = get("map_coordinate");
    if (!coord || !coord.includes(",")) continue;
    const [latStr, lngStr] = coord.split(",").map((s) => s.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

    const id = `fehd-${get("mapID") || `${lat}-${lng}`}`;
    const districtID = get("districtID");
    const district = districtMap[districtID] || {
      zh: districtID || "香港",
      en: districtID || "Hong Kong",
    };

    const nameEn = get("name_e") || get("name_c") || "Public Toilet";
    const nameZh = get("name_c") || get("name_e") || "公廁";
    const addressEn = get("address_e") || get("address_c") || "";
    const addressZh = get("address_c") || get("address_e") || "";
    const openHr = get("openHr_e") || get("openHr_c") || "";
    const remarks = get("remarks_e") || get("remarks_c") || "";

    const openLower = openHr.toLowerCase();
    let openSchedule = openHr;
    if (openLower.includes("24") || openLower.includes("全日")) {
      openSchedule = "24h";
    }

    const accessible =
      nameEn.toLowerCase().includes("accessible") ||
      nameZh.includes("暢通") ||
      nameZh.includes("無障礙") ||
      mapType.includes("accessible");

    facilities.push({
      id,
      type: "toilet",
      nameZh,
      nameEn,
      addressZh,
      addressEn,
      lat,
      lng,
      districtZh: district.zh,
      districtEn: district.en,
      openHours: openHr || undefined,
      openSchedule: openSchedule || undefined,
      remarks: remarks && remarks !== "N/A" ? remarks : undefined,
      accessible,
      source: "FEHD",
    });
  }

  return facilities;
}

export async function GET() {
  try {
    // English XML has clearer structure
    const res = await fetch("https://www.fehd.gov.hk/english/map/fehd_map_e.xml", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "HK-Public-Facilities-Map/1.0" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch FEHD data", status: res.status },
        { status: 502 }
      );
    }

    const xml = await res.text();
    const toilets = parseXmlToilets(xml);

    return NextResponse.json({
      source: "FEHD",
      updatedAt: new Date().toISOString(),
      count: toilets.length,
      facilities: toilets,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error fetching FEHD toilets" },
      { status: 500 }
    );
  }
}

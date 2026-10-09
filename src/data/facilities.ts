// Sample data based on real Hong Kong open data structures
// In production, replace with live fetch from FEHD / EPD / CSDI APIs

export type FacilityType = "toilet" | "water" | "ev" | "wifi" | "clinic";

export interface Facility {
  id: string;
  type: FacilityType;
  nameZh: string;
  nameEn: string;
  addressZh: string;
  addressEn: string;
  lat: number;
  lng: number;
  districtZh: string;
  districtEn: string;
  openHours?: string;
  remarks?: string;
  accessible?: boolean;
}

export const FACILITY_META: Record<
  FacilityType,
  { labelZh: string; labelEn: string; color: string; emoji: string }
> = {
  toilet: {
    labelZh: "公廁",
    labelEn: "Public Toilet",
    color: "#3b82f6",
    emoji: "🚻",
  },
  water: {
    labelZh: "飲水機",
    labelEn: "Water Dispenser",
    color: "#06b6d4",
    emoji: "💧",
  },
  ev: {
    labelZh: "EV 充電器",
    labelEn: "EV Charger",
    color: "#22c55e",
    emoji: "⚡",
  },
  wifi: {
    labelZh: "Wi-Fi",
    labelEn: "Wi-Fi Hotspot",
    color: "#a855f7",
    emoji: "📶",
  },
  clinic: {
    labelZh: "診所",
    labelEn: "Clinic",
    color: "#ef4444",
    emoji: "🏥",
  },
};

// Sample facilities (real coordinates around Hong Kong)
// Source inspiration: FEHD public toilets, EPD water dispensers, EPD EV chargers
export const SAMPLE_FACILITIES: Facility[] = [
  // Public Toilets
  {
    id: "t1",
    type: "toilet",
    nameZh: "華興里公廁及浴室",
    nameEn: "Wa Hing Lane Public Toilet and Bathhouse",
    addressZh: "上環城皇街及華興里交界",
    addressEn: "Junction of Shing Wong Street & Wa Hing Lane, Sheung Wan",
    lat: 22.283733,
    lng: 114.151492,
    districtZh: "中西區",
    districtEn: "Central and Western",
    openHours: "24 小時",
    accessible: true,
  },
  {
    id: "t2",
    type: "toilet",
    nameZh: "興發街公廁",
    nameEn: "Hing Fat Street Public Toilet",
    addressZh: "興發街近維多利亞公園入口",
    addressEn: "Near Victoria Victoria Park entrance, Hing Fat Street",
    lat: 22.282368,
    lng: 114.191001,
    districtZh: "灣仔區",
    districtEn: "Wan Chai",
    openHours: "24 小時",
    accessible: true,
  },
  {
    id: "t3",
    type: "toilet",
    nameZh: "成和道公廁",
    nameEn: "Sing Woo Road Public Toilet",
    addressZh: "成和道與奕蔭街交界",
    addressEn: "Junction of Sing Woo Road and Yik Yam Street",
    lat: 22.269382,
    lng: 114.18519,
    districtZh: "灣仔區",
    districtEn: "Wan Chai",
    openHours: "24 小時",
  },
  {
    id: "t4",
    type: "toilet",
    nameZh: "尖沙咀東公共運輸交匯處公廁",
    nameEn: "Tsim Sha Tsui East PTI Public Toilet",
    addressZh: "尖沙咀東部",
    addressEn: "Tsim Sha Tsui East",
    lat: 22.2975,
    lng: 114.1765,
    districtZh: "油尖旺區",
    districtEn: "Yau Tsim Mong",
    openHours: "24 小時",
    accessible: true,
  },
  {
    id: "t5",
    type: "toilet",
    nameZh: "亞皆老街遊樂場公廁",
    nameEn: "Argyle Street Playground Public Toilet",
    addressZh: "旺角亞皆老街",
    addressEn: "Argyle Street, Mong Kok",
    lat: 22.3193,
    lng: 114.1694,
    districtZh: "油尖旺區",
    districtEn: "Yau Tsim Mong",
    openHours: "24 小時",
  },
  {
    id: "t6",
    type: "toilet",
    nameZh: "觀塘海濱公園公廁",
    nameEn: "Kwun Tong Promenade Public Toilet",
    addressZh: "觀塘海濱道",
    addressEn: "Hoi Bun Road, Kwun Tong",
    lat: 22.3095,
    lng: 114.226,
    districtZh: "觀塘區",
    districtEn: "Kwun Tong",
    openHours: "24 小時",
    accessible: true,
  },

  // Water Dispensers
  {
    id: "w1",
    type: "water",
    nameZh: "維多利亞公園飲水機",
    nameEn: "Victoria Park Water Dispenser",
    addressZh: "銅鑼灣維多利亞公園",
    addressEn: "Victoria Park, Causeway Bay",
    lat: 22.2815,
    lng: 114.1885,
    districtZh: "灣仔區",
    districtEn: "Wan Chai",
    openHours: "場地開放時間",
  },
  {
    id: "w2",
    type: "water",
    nameZh: "香港公園飲水機",
    nameEn: "Hong Kong Park Water Dispenser",
    addressZh: "中環紅棉路",
    addressEn: "Cotton Tree Drive, Central",
    lat: 22.2775,
    lng: 114.1615,
    districtZh: "中西區",
    districtEn: "Central and Western",
    openHours: "場地開放時間",
  },
  {
    id: "w3",
    type: "water",
    nameZh: "九龍公園飲水機",
    nameEn: "Kowloon Park Water Dispenser",
    addressZh: "尖沙咀九龍公園",
    addressEn: "Kowloon Park, Tsim Sha Tsui",
    lat: 22.3012,
    lng: 114.172,
    districtZh: "油尖旺區",
    districtEn: "Yau Tsim Mong",
    openHours: "場地開放時間",
  },
  {
    id: "w4",
    type: "water",
    nameZh: "沙田公園飲水機",
    nameEn: "Sha Tin Park Water Dispenser",
    addressZh: "沙田正街",
    addressEn: "Yuen Wo Road, Sha Tin",
    lat: 22.3815,
    lng: 114.1885,
    districtZh: "沙田區",
    districtEn: "Sha Tin",
    openHours: "場地開放時間",
  },

  // EV Chargers
  {
    id: "e1",
    type: "ev",
    nameZh: "中環美利道停車場充電站",
    nameEn: "Murray Road Car Park EV Charger",
    addressZh: "中環美利道",
    addressEn: "Murray Road, Central",
    lat: 22.2798,
    lng: 114.1605,
    districtZh: "中西區",
    districtEn: "Central and Western",
    remarks: "中速 / 快速充電",
  },
  {
    id: "e2",
    type: "ev",
    nameZh: "尖沙咀海港城充電站",
    nameEn: "Harbour City EV Charger",
    addressZh: "尖沙咀廣東道",
    addressEn: "Canton Road, Tsim Sha Tsui",
    lat: 22.2955,
    lng: 114.168,
    districtZh: "油尖旺區",
    districtEn: "Yau Tsim Mong",
    remarks: "多個中速充電器",
  },
  {
    id: "e3",
    type: "ev",
    nameZh: "觀塘 APM 充電站",
    nameEn: "apm Kwun Tong EV Charger",
    addressZh: "觀塘道 418 號",
    addressEn: "418 Kwun Tong Road",
    lat: 22.3125,
    lng: 114.2255,
    districtZh: "觀塘區",
    districtEn: "Kwun Tong",
    remarks: "商場停車場",
  },
  {
    id: "e4",
    type: "ev",
    nameZh: "沙田新城市廣場充電站",
    nameEn: "New Town Plaza EV Charger",
    addressZh: "沙田正街 18 號",
    addressEn: "18 Sha Tin Centre Street",
    lat: 22.3825,
    lng: 114.188,
    districtZh: "沙田區",
    districtEn: "Sha Tin",
    remarks: "快速充電可用",
  },

  // Wi-Fi (sample)
  {
    id: "f1",
    type: "wifi",
    nameZh: "中環 Wi-Fi.HK",
    nameEn: "Central Wi-Fi.HK",
    addressZh: "中環遮打道",
    addressEn: "Chater Road, Central",
    lat: 22.2812,
    lng: 114.1595,
    districtZh: "中西區",
    districtEn: "Central and Western",
    remarks: "免費 Wi-Fi.HK",
  },
  {
    id: "f2",
    type: "wifi",
    nameZh: "旺角行人專用區 Wi-Fi",
    nameEn: "Mong Kok Pedestrian Zone Wi-Fi",
    addressZh: "旺角彌敦道",
    addressEn: "Nathan Road, Mong Kok",
    lat: 22.3195,
    lng: 114.1698,
    districtZh: "油尖旺區",
    districtEn: "Yau Tsim Mong",
    remarks: "免費 Wi-Fi.HK",
  },

  // Clinics
  {
    id: "c1",
    type: "clinic",
    nameZh: "灣仔普通科門診診所",
    nameEn: "Wan Chai General Out-patient Clinic",
    addressZh: "灣仔軒尼詩道",
    addressEn: "Hennessy Road, Wan Chai",
    lat: 22.2778,
    lng: 114.1735,
    districtZh: "灣仔區",
    districtEn: "Wan Chai",
    openHours: "星期一至五 09:00-13:00, 14:00-17:00",
  },
  {
    id: "c2",
    type: "clinic",
    nameZh: "油麻地賽馬會普通科門診診所",
    nameEn: "Yau Ma Tei Jockey Club GOPC",
    addressZh: "油麻地",
    addressEn: "Yau Ma Tei",
    lat: 22.3125,
    lng: 114.1705,
    districtZh: "油尖旺區",
    districtEn: "Yau Tsim Mong",
    openHours: "星期一至五 09:00-13:00, 14:00-17:00",
  },
];

export function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

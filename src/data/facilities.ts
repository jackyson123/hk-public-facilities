// Expanded facility data + helpers for HK Public Facilities Map

export type FacilityType = "toilet" | "water" | "ev" | "wifi" | "clinic" | "shelter";

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
  /** 24h or time ranges like "09:00-17:00" or "09:00-13:00,14:00-17:00" */
  openSchedule?: string;
  remarks?: string;
  accessible?: boolean;
  phone?: string;
  /** For EV: charger types */
  chargerTypes?: string[];
}

export const FACILITY_META: Record<
  FacilityType,
  { labelZh: string; labelEn: string; color: string; emoji: string }
> = {
  toilet: { labelZh: "公廁", labelEn: "Public Toilet", color: "#3b82f6", emoji: "🚻" },
  water: { labelZh: "飲水機", labelEn: "Water Dispenser", color: "#06b6d4", emoji: "💧" },
  ev: { labelZh: "EV 充電器", labelEn: "EV Charger", color: "#22c55e", emoji: "⚡" },
  wifi: { labelZh: "Wi-Fi", labelEn: "Wi-Fi Hotspot", color: "#a855f7", emoji: "📶" },
  clinic: { labelZh: "診所", labelEn: "Clinic", color: "#ef4444", emoji: "🏥" },
  shelter: { labelZh: "避雨亭", labelEn: "Shelter", color: "#f59e0b", emoji: "🏕️" },
};

export const DISTRICTS = [
  { zh: "中西區", en: "Central and Western", lat: 22.281, lng: 114.155 },
  { zh: "灣仔區", en: "Wan Chai", lat: 22.278, lng: 114.173 },
  { zh: "東區", en: "Eastern", lat: 22.284, lng: 114.224 },
  { zh: "南區", en: "Southern", lat: 22.247, lng: 114.16 },
  { zh: "油尖旺區", en: "Yau Tsim Mong", lat: 22.311, lng: 114.172 },
  { zh: "深水埗區", en: "Sham Shui Po", lat: 22.331, lng: 114.163 },
  { zh: "九龍城區", en: "Kowloon City", lat: 22.328, lng: 114.192 },
  { zh: "黃大仙區", en: "Wong Tai Sin", lat: 22.343, lng: 114.195 },
  { zh: "觀塘區", en: "Kwun Tong", lat: 22.313, lng: 114.226 },
  { zh: "葵青區", en: "Kwai Tsing", lat: 22.357, lng: 114.128 },
  { zh: "荃灣區", en: "Tsuen Wan", lat: 22.371, lng: 114.114 },
  { zh: "屯門區", en: "Tuen Mun", lat: 22.391, lng: 113.977 },
  { zh: "元朗區", en: "Yuen Long", lat: 22.444, lng: 114.022 },
  { zh: "北區", en: "North", lat: 22.495, lng: 114.138 },
  { zh: "大埔區", en: "Tai Po", lat: 22.45, lng: 114.169 },
  { zh: "沙田區", en: "Sha Tin", lat: 22.383, lng: 114.188 },
  { zh: "西貢區", en: "Sai Kung", lat: 22.382, lng: 114.273 },
  { zh: "離島區", en: "Islands", lat: 22.287, lng: 113.943 },
] as const;

export const RADIUS_OPTIONS = [
  { value: 500, labelZh: "500 米", labelEn: "500 m" },
  { value: 1000, labelZh: "1 公里", labelEn: "1 km" },
  { value: 2000, labelZh: "2 公里", labelEn: "2 km" },
  { value: 5000, labelZh: "5 公里", labelEn: "5 km" },
  { value: 0, labelZh: "不限", labelEn: "Any" },
] as const;

/** Sample data with real HK coordinates – structure matches open data */
export const SAMPLE_FACILITIES: Facility[] = [
  // Toilets
  {
    id: "t1", type: "toilet",
    nameZh: "華興里公廁及浴室", nameEn: "Wa Hing Lane Public Toilet and Bathhouse",
    addressZh: "上環城皇街及華興里交界", addressEn: "Junction of Shing Wong St & Wa Hing Lane, Sheung Wan",
    lat: 22.283733, lng: 114.151492, districtZh: "中西區", districtEn: "Central and Western",
    openHours: "24 小時", openSchedule: "24h", accessible: true,
  },
  {
    id: "t2", type: "toilet",
    nameZh: "興發街公廁", nameEn: "Hing Fat Street Public Toilet",
    addressZh: "興發街近維多利亞公園入口", addressEn: "Near Victoria Park entrance, Hing Fat Street",
    lat: 22.282368, lng: 114.191001, districtZh: "灣仔區", districtEn: "Wan Chai",
    openHours: "24 小時", openSchedule: "24h", accessible: true,
  },
  {
    id: "t3", type: "toilet",
    nameZh: "成和道公廁", nameEn: "Sing Woo Road Public Toilet",
    addressZh: "成和道與奕蔭街交界", addressEn: "Junction of Sing Woo Road and Yik Yam Street",
    lat: 22.269382, lng: 114.18519, districtZh: "灣仔區", districtEn: "Wan Chai",
    openHours: "24 小時", openSchedule: "24h",
  },
  {
    id: "t4", type: "toilet",
    nameZh: "尖沙咀東公共運輸交匯處公廁", nameEn: "Tsim Sha Tsui East PTI Public Toilet",
    addressZh: "尖沙咀東部", addressEn: "Tsim Sha Tsui East",
    lat: 22.2975, lng: 114.1765, districtZh: "油尖旺區", districtEn: "Yau Tsim Mong",
    openHours: "24 小時", openSchedule: "24h", accessible: true,
  },
  {
    id: "t5", type: "toilet",
    nameZh: "亞皆老街遊樂場公廁", nameEn: "Argyle Street Playground Public Toilet",
    addressZh: "旺角亞皆老街", addressEn: "Argyle Street, Mong Kok",
    lat: 22.3193, lng: 114.1694, districtZh: "油尖旺區", districtEn: "Yau Tsim Mong",
    openHours: "24 小時", openSchedule: "24h",
  },
  {
    id: "t6", type: "toilet",
    nameZh: "觀塘海濱公園公廁", nameEn: "Kwun Tong Promenade Public Toilet",
    addressZh: "觀塘海濱道", addressEn: "Hoi Bun Road, Kwun Tong",
    lat: 22.3095, lng: 114.226, districtZh: "觀塘區", districtEn: "Kwun Tong",
    openHours: "24 小時", openSchedule: "24h", accessible: true,
  },
  {
    id: "t7", type: "toilet",
    nameZh: "中環碼頭公廁", nameEn: "Central Pier Public Toilet",
    addressZh: "中環碼頭", addressEn: "Central Pier",
    lat: 22.2875, lng: 114.159, districtZh: "中西區", districtEn: "Central and Western",
    openHours: "24 小時", openSchedule: "24h", accessible: true,
  },
  {
    id: "t8", type: "toilet",
    nameZh: "沙田公園公廁", nameEn: "Sha Tin Park Public Toilet",
    addressZh: "沙田正街", addressEn: "Yuen Wo Road, Sha Tin",
    lat: 22.381, lng: 114.188, districtZh: "沙田區", districtEn: "Sha Tin",
    openHours: "24 小時", openSchedule: "24h", accessible: true,
  },
  // Water
  {
    id: "w1", type: "water",
    nameZh: "維多利亞公園飲水機", nameEn: "Victoria Park Water Dispenser",
    addressZh: "銅鑼灣維多利亞公園", addressEn: "Victoria Park, Causeway Bay",
    lat: 22.2815, lng: 114.1885, districtZh: "灣仔區", districtEn: "Wan Chai",
    openHours: "場地開放時間", openSchedule: "06:00-23:00",
  },
  {
    id: "w2", type: "water",
    nameZh: "香港公園飲水機", nameEn: "Hong Kong Park Water Dispenser",
    addressZh: "中環紅棉路", addressEn: "Cotton Tree Drive, Central",
    lat: 22.2775, lng: 114.1615, districtZh: "中西區", districtEn: "Central and Western",
    openHours: "場地開放時間", openSchedule: "06:00-23:00",
  },
  {
    id: "w3", type: "water",
    nameZh: "九龍公園飲水機", nameEn: "Kowloon Park Water Dispenser",
    addressZh: "尖沙咀九龍公園", addressEn: "Kowloon Park, Tsim Sha Tsui",
    lat: 22.3012, lng: 114.172, districtZh: "油尖旺區", districtEn: "Yau Tsim Mong",
    openHours: "場地開放時間", openSchedule: "05:00-24:00",
  },
  {
    id: "w4", type: "water",
    nameZh: "沙田公園飲水機", nameEn: "Sha Tin Park Water Dispenser",
    addressZh: "沙田正街", addressEn: "Yuen Wo Road, Sha Tin",
    lat: 22.3815, lng: 114.1885, districtZh: "沙田區", districtEn: "Sha Tin",
    openHours: "場地開放時間", openSchedule: "06:00-23:00",
  },
  {
    id: "w5", type: "water",
    nameZh: "觀塘海濱長廊飲水機", nameEn: "Kwun Tong Promenade Water Dispenser",
    addressZh: "觀塘海濱道", addressEn: "Hoi Bun Road, Kwun Tong",
    lat: 22.3105, lng: 114.225, districtZh: "觀塘區", districtEn: "Kwun Tong",
    openHours: "24 小時", openSchedule: "24h",
  },
  // EV
  {
    id: "e1", type: "ev",
    nameZh: "中環美利道停車場充電站", nameEn: "Murray Road Car Park EV Charger",
    addressZh: "中環美利道", addressEn: "Murray Road, Central",
    lat: 22.2798, lng: 114.1605, districtZh: "中西區", districtEn: "Central and Western",
    remarks: "中速 / 快速", chargerTypes: ["中速", "快速"], openSchedule: "24h",
  },
  {
    id: "e2", type: "ev",
    nameZh: "尖沙咀海港城充電站", nameEn: "Harbour City EV Charger",
    addressZh: "尖沙咀廣東道", addressEn: "Canton Road, Tsim Sha Tsui",
    lat: 22.2955, lng: 114.168, districtZh: "油尖旺區", districtEn: "Yau Tsim Mong",
    remarks: "多個中速充電器", chargerTypes: ["中速"], openSchedule: "10:00-22:00",
  },
  {
    id: "e3", type: "ev",
    nameZh: "觀塘 APM 充電站", nameEn: "apm Kwun Tong EV Charger",
    addressZh: "觀塘道 418 號", addressEn: "418 Kwun Tong Road",
    lat: 22.3125, lng: 114.2255, districtZh: "觀塘區", districtEn: "Kwun Tong",
    remarks: "商場停車場", chargerTypes: ["中速", "快速"], openSchedule: "10:00-22:00",
  },
  {
    id: "e4", type: "ev",
    nameZh: "沙田新城市廣場充電站", nameEn: "New Town Plaza EV Charger",
    addressZh: "沙田正街 18 號", addressEn: "18 Sha Tin Centre Street",
    lat: 22.3825, lng: 114.188, districtZh: "沙田區", districtEn: "Sha Tin",
    remarks: "快速充電可用", chargerTypes: ["中速", "快速"], openSchedule: "10:00-22:00",
  },
  {
    id: "e5", type: "ev",
    nameZh: "灣仔會展停車場充電站", nameEn: "HKCEC Car Park EV Charger",
    addressZh: "灣仔博覽道", addressEn: "Expo Drive, Wan Chai",
    lat: 22.282, lng: 114.173, districtZh: "灣仔區", districtEn: "Wan Chai",
    chargerTypes: ["中速", "快速"], openSchedule: "24h",
  },
  // Wi-Fi
  {
    id: "f1", type: "wifi",
    nameZh: "中環 Wi-Fi.HK", nameEn: "Central Wi-Fi.HK",
    addressZh: "中環遮打道", addressEn: "Chater Road, Central",
    lat: 22.2812, lng: 114.1595, districtZh: "中西區", districtEn: "Central and Western",
    remarks: "免費 Wi-Fi.HK", openSchedule: "24h",
  },
  {
    id: "f2", type: "wifi",
    nameZh: "旺角行人專用區 Wi-Fi", nameEn: "Mong Kok Pedestrian Zone Wi-Fi",
    addressZh: "旺角彌敦道", addressEn: "Nathan Road, Mong Kok",
    lat: 22.3195, lng: 114.1698, districtZh: "油尖旺區", districtEn: "Yau Tsim Mong",
    remarks: "免費 Wi-Fi.HK", openSchedule: "24h",
  },
  {
    id: "f3", type: "wifi",
    nameZh: "銅鑼灣時代廣場 Wi-Fi", nameEn: "Times Square Wi-Fi",
    addressZh: "銅鑼灣勿地臣街", addressEn: "Matheson Street, Causeway Bay",
    lat: 22.2783, lng: 114.182, districtZh: "灣仔區", districtEn: "Wan Chai",
    remarks: "免費 Wi-Fi.HK", openSchedule: "10:00-22:00",
  },
  // Clinics
  {
    id: "c1", type: "clinic",
    nameZh: "灣仔普通科門診診所", nameEn: "Wan Chai General Out-patient Clinic",
    addressZh: "灣仔軒尼詩道", addressEn: "Hennessy Road, Wan Chai",
    lat: 22.2778, lng: 114.1735, districtZh: "灣仔區", districtEn: "Wan Chai",
    openHours: "星期一至五 09:00-13:00, 14:00-17:00", openSchedule: "09:00-13:00,14:00-17:00",
    phone: "114", accessible: true,
  },
  {
    id: "c2", type: "clinic",
    nameZh: "油麻地賽馬會普通科門診診所", nameEn: "Yau Ma Tei Jockey Club GOPC",
    addressZh: "油麻地", addressEn: "Yau Ma Tei",
    lat: 22.3125, lng: 114.1705, districtZh: "油尖旺區", districtEn: "Yau Tsim Mong",
    openHours: "星期一至五 09:00-13:00, 14:00-17:00", openSchedule: "09:00-13:00,14:00-17:00",
    accessible: true,
  },
  {
    id: "c3", type: "clinic",
    nameZh: "觀塘賽馬會普通科門診診所", nameEn: "Kwun Tong Jockey Club GOPC",
    addressZh: "觀塘", addressEn: "Kwun Tong",
    lat: 22.313, lng: 114.227, districtZh: "觀塘區", districtEn: "Kwun Tong",
    openHours: "星期一至五 09:00-13:00, 14:00-17:00", openSchedule: "09:00-13:00,14:00-17:00",
    accessible: true,
  },
  // Shelters (hiking-related)
  {
    id: "s1", type: "shelter",
    nameZh: "大帽山郊野公園涼亭", nameEn: "Tai Mo Shan Country Park Pavilion",
    addressZh: "大帽山", addressEn: "Tai Mo Shan",
    lat: 22.4105, lng: 114.124, districtZh: "荃灣區", districtEn: "Tsuen Wan",
    remarks: "行山避雨", openSchedule: "24h",
  },
  {
    id: "s2", type: "shelter",
    nameZh: "西貢萬宜水庫東壩涼亭", nameEn: "East Dam Pavilion, Sai Kung",
    addressZh: "萬宜水庫東壩", addressEn: "High Island Reservoir East Dam",
    lat: 22.36, lng: 114.37, districtZh: "西貢區", districtEn: "Sai Kung",
    remarks: "行山避雨", openSchedule: "24h",
  },
];

export function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Simple open-now check (demo). Supports "24h" or "HH:MM-HH:MM" ranges. */
export function isOpenNow(schedule?: string): boolean | null {
  if (!schedule) return null;
  if (schedule === "24h" || schedule.toLowerCase().includes("24")) return true;
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const ranges = schedule.split(",");
  for (const range of ranges) {
    const m = range.trim().match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (m) {
      const start = parseInt(m[1]) * 60 + parseInt(m[2]);
      const end = parseInt(m[3]) * 60 + parseInt(m[4]);
      if (mins >= start && mins <= end) return true;
    }
  }
  return false;
}

export function formatDistance(meters: number | null, lang: "zh" | "en"): string {
  if (meters == null) return "";
  if (meters < 1000) return lang === "zh" ? `${Math.round(meters)} 米` : `${Math.round(meters)} m`;
  return lang === "zh" ? `${(meters / 1000).toFixed(1)} 公里` : `${(meters / 1000).toFixed(1)} km`;
}

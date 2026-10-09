# 香港公共設施地圖 | HK Public Facilities Map

一站式查看香港公廁、飲水機、EV 充電器、Wi-Fi 熱點及診所位置。

One-stop interactive map for public toilets, water dispensers, EV chargers, Wi-Fi hotspots and clinics in Hong Kong.

## 功能 Features

- 🗺️ 互動地圖（Leaflet + OpenStreetMap）
- 🚻 公廁 / 💧 飲水機 / ⚡ EV 充電器 / 📶 Wi-Fi / 🏥 診所
- 📍 一鍵定位 + 距離排序
- 🔍 分類篩選
- 🌐 繁中 / English 雙語
- 📱 手機優先介面（地圖 / 列表切換）

## 快速開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 打開 http://localhost:3000
```

## 技術棧

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS 4**
- **Leaflet** + react-leaflet
- **lucide-react** icons

## 數據來源（生產環境可接）

目前使用示範數據（真實座標），結構對應政府開放數據：

| 類型 | 政府來源 | 連結 |
|------|----------|------|
| 公廁 | FEHD facility locations | [data.gov.hk](https://data.gov.hk) / CSDI |
| 飲水機 | EPD Water Dispensers | CSDI Portal |
| EV 充電器 | EPD EV Chargers for Public Access | CSDI Portal |
| Wi-Fi | OFCA Registered WiFi Hotspots | data.gov.hk |
| 診所 | Hospital Authority / iGeoCom | Lands Department |

### 建議下一步接真實 API

1. **FEHD 公廁 XML**：`https://www.fehd.gov.hk/english/map/fehd_map_e.xml`
2. **CSDI Search Nearby API**：`https://www.map.gov.hk/gs/api/v1.0.0/searchNearby`
3. **iGeoCom**（地政總署社區地理數據庫）下載 GeoJSON
4. 用 Next.js Route Handler 做 proxy，避免 CORS

## 部署到 Vercel

1. 把專案 push 上 GitHub
2. 到 [vercel.com](https://vercel.com) Import 專案
3. 一鍵 Deploy（零配置）

## 授權

示範用途。正式使用政府數據時請遵守 data.gov.hk 及 CSDI 的條款，並註明來源。

---

Built with ❤️ for Hong Kong

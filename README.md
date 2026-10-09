# 香港公共設施地圖 | HK Public Facilities Map

一站式查看香港公廁、飲水機、EV 充電器、Wi-Fi 熱點、診所及行山涼亭。

## 已實現功能

### 核心
- 互動地圖（Leaflet + OSM / 深色底圖）
- 公廁 · 飲水機 · EV 充電器 · Wi-Fi · 診所 · 避雨亭
- 分類篩選、搜尋（名稱/地址/地區）
- 一鍵定位 + 距離排序
- 附近半徑篩選（500m / 1km / 2km / 5km）
- 分區快速跳轉（18 區）

### 實用
- 收藏（localStorage 持久化）
- 暢通易達（無障礙）篩選
- 「現正開放」狀態判斷
- 設施詳情卡片（開放狀態、電話、備註）
- 步行路線（跳轉 Google Maps 步行模式）
- 分享位置（Web Share API / 複製連結）
- 繁中 / English 雙語
- 深色模式
- 手機優先（地圖 / 列表切換）

## 快速開始

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 部署

推上 GitHub 後到 [vercel.com](https://vercel.com) Import 即可。

## 之後接真實數據

示範數據結構已對齊政府開放數據，可替換為：

| 類型 | 來源 |
|------|------|
| 公廁 | FEHD XML / CSDI |
| 飲水機 | EPD Water Dispensers |
| EV | EPD EV Chargers |
| Wi-Fi | OFCA Registered Hotspots |
| 診所 | HA / iGeoCom |
| 涼亭 | AFCD / CSDI |

建議用 Next.js Route Handler 做 proxy 避免 CORS。

## 技術棧

Next.js 15 · TypeScript · Tailwind CSS 4 · Leaflet · lucide-react

---

Built for Hong Kong ❤️

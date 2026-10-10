# 香港公共設施地圖 | HK Public Facilities Map

一站式查看香港公廁、飲水機、EV、Wi-Fi、診所及行山涼亭。

## v1.2 新功能

### 真實數據（多來源）
| 類型 | 來源 | API |
|------|------|-----|
| 公廁 | 食環署 FEHD XML | `/api/facilities` |
| 飲水機 | 環保署 EPD CSV | `/api/facilities` |
| 其他 | 示範數據（可擴） | — |

### 天氣提示（天文台 HKO）
- `/api/weather` 讀取即時天氣 + 警告
- 下雨／酷熱／寒冷時頂部顯示實用提示
- 例如：「正下雨，建議優先搵有蓋公廁」

### 衛星地圖
- 頂部 🌐 掣切換街道 / Esri 衛星影像

### PWA 可安裝
- `manifest.json` + Service Worker
- 手機瀏覽器「加到主畫面」即可當 App 用
- API 網絡優先、靜態資源快取

## 其他功能

標記聚合 · 可分享 URL · 附近半徑 · 收藏 · 無障礙 · 現正開放 · 搜尋 · 18 區跳轉 · 詳情卡 · 步行路線 · 雙語 · 深色模式

## 版本

目前 **v1.2.1**。完整更新紀錄見 [CHANGELOG.md](./CHANGELOG.md)。

## 快速開始

```bash
npm install
npm run dev
```

## 部署

Push → Vercel Import。無需額外環境變數。

## 數據來源聲明

- FEHD public toilets XML  
- EPD water dispensers CSV  
- HKO Open Data API (`rhrread`, `warnsum`, `flw`)  
- Map tiles: OSM / CARTO / Esri World Imagery  

請遵守各部門開放數據條款並註明來源。

---

Built for Hong Kong ❤️

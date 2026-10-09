# 香港公共設施地圖 | HK Public Facilities Map

一站式查看香港公廁、飲水機、EV 充電器、Wi-Fi、診所及行山涼亭。

## 新功能 (v1.1)

### 真實數據
- **食環署 (FEHD) 公廁** 經 `/api/fehd-toilets` 即時拉取官方 XML
- 伺服器端 cache 1 小時，失敗時自動回退示範數據
- Header 顯示「FEHD 公廁 xxx 個 · 實時」

### 標記聚合 (Clustering)
- 使用 `leaflet.markercluster`
- 縮小時自動聚合，放大後散開
- `disableClusteringAtZoom: 17`

### 可分享 URL
篩選、語言、深色模式、選中設施、地圖位置都會寫入 query string，例如：

```
/?types=toilet,water&radius=1000&accessible=1&lang=zh&id=fehd-26
```

複製瀏覽器網址即可分享目前檢視狀態。

## 其他功能

- 附近半徑、收藏、暢通易達、現正開放
- 搜尋、18 區跳轉、詳情卡、步行路線、分享
- 繁中 / English、深色模式、手機優先

## 快速開始

```bash
npm install
npm run dev
```

打開 http://localhost:3000  
首次載入會 request `/api/fehd-toilets` 取得真實公廁。

## 部署 Vercel

Push 上 GitHub → Vercel Import。  
API Route 會在 serverless 環境跑，無需額外設定。

## 數據來源

| 類型 | 來源 |
|------|------|
| 公廁 | FEHD `fehd_map_e.xml`（真實） |
| 其他 | 示範數據（結構可接 EPD / CSDI） |

## 技術

Next.js 15 · TypeScript · Tailwind 4 · Leaflet · leaflet.markercluster · lucide-react

---

Built for Hong Kong ❤️

"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  Facility,
  FacilityType,
  FACILITY_META,
  isOpenNow,
} from "@/data/facilities";

function createColoredIcon(color: string, emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      width:32px;height:32px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:14px;line-height:1">${emoji}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  });
}

interface MarkerClusterProps {
  facilities: Facility[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  lang: "zh" | "en";
}

export default function MarkerCluster({
  facilities,
  selectedId,
  onSelect,
  lang,
}: MarkerClusterProps) {
  const map = useMap();

  useEffect(() => {
    const icons: Record<string, L.DivIcon> = {};
    (Object.keys(FACILITY_META) as FacilityType[]).forEach((t) => {
      icons[t] = createColoredIcon(FACILITY_META[t].color, FACILITY_META[t].emoji);
    });

    const cluster = (L as typeof L & { markerClusterGroup: (o?: object) => L.MarkerClusterGroup }).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 17,
    });

    facilities.forEach((f) => {
      const open = isOpenNow(f.openSchedule);
      const marker = L.marker([f.lat, f.lng], {
        icon: icons[f.type] || icons.toilet,
        opacity: selectedId && selectedId !== f.id ? 0.5 : 1,
      });

      const name = lang === "zh" ? f.nameZh : f.nameEn;
      const addr = lang === "zh" ? f.addressZh : f.addressEn;
      let openHtml = "";
      if (open != null) {
        openHtml = open
          ? `<div style="color:#16a34a;font-size:12px;font-weight:600">● ${lang === "zh" ? "現正開放" : "Open now"}</div>`
          : `<div style="color:#ef4444;font-size:12px;font-weight:600">● ${lang === "zh" ? "已關閉" : "Closed"}</div>`;
      }

      marker.bindPopup(`
        <div style="min-width:180px;font-size:13px">
          <div style="font-weight:600;font-size:14px;margin-bottom:4px">${name}</div>
          <div style="color:#666;font-size:12px;margin-bottom:4px">${addr}</div>
          ${openHtml}
          ${f.openHours ? `<div style="color:#888;font-size:11px">🕐 ${f.openHours}</div>` : ""}
          ${f.accessible ? `<div style="color:#2563eb;font-size:11px;margin-top:2px">♿ ${lang === "zh" ? "暢通易達" : "Accessible"}</div>` : ""}
        </div>
      `);

      marker.on("click", () => onSelect(f.id));
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);

    return () => {
      map.removeLayer(cluster);
    };
  }, [map, facilities, selectedId, onSelect, lang]);

  return null;
}

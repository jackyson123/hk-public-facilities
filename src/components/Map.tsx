"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Facility,
  FacilityType,
  FACILITY_META,
  isOpenNow,
} from "@/data/facilities";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function createColoredIcon(color: string, emoji: string, dimmed = false) {
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
      opacity:${dimmed ? 0.45 : 1};
    "><span style="transform:rotate(45deg);font-size:14px;line-height:1">${emoji}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  });
}

function FlyTo({ lat, lng, zoom = 15 }: { lat: number | null; lng: number | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], zoom, { duration: 1.1 });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

interface MapProps {
  facilities: Facility[];
  userLat: number | null;
  userLng: number | null;
  flyLat: number | null;
  flyLng: number | null;
  radiusMeters: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  lang: "zh" | "en";
  dark: boolean;
}

export default function Map({
  facilities,
  userLat,
  userLng,
  flyLat,
  flyLng,
  radiusMeters,
  selectedId,
  onSelect,
  lang,
  dark,
}: MapProps) {
  const icons = useMemo(() => {
    const map = {} as Record<FacilityType, L.DivIcon>;
    (Object.keys(FACILITY_META) as FacilityType[]).forEach((t) => {
      map[t] = createColoredIcon(FACILITY_META[t].color, FACILITY_META[t].emoji);
    });
    return map;
  }, []);

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution = dark
    ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OSM'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <MapContainer
      center={[22.3193, 114.1694]}
      zoom={13}
      className="h-full w-full z-0"
      scrollWheelZoom
    >
      <TileLayer attribution={attribution} url={tileUrl} />
      <FlyTo lat={flyLat} lng={flyLng} />

      {userLat != null && userLng != null && (
        <>
          <CircleMarker
            center={[userLat, userLng]}
            radius={8}
            pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.95, weight: 2 }}
          >
            <Popup>{lang === "zh" ? "你的位置" : "Your location"}</Popup>
          </CircleMarker>
          {radiusMeters > 0 && (
            <Circle
              center={[userLat, userLng]}
              radius={radiusMeters}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1.5, dashArray: "6 4" }}
            />
          )}
        </>
      )}

      {facilities.map((f) => {
        const open = isOpenNow(f.openSchedule);
        return (
          <Marker
            key={f.id}
            position={[f.lat, f.lng]}
            icon={icons[f.type]}
            opacity={selectedId && selectedId !== f.id ? 0.55 : 1}
            eventHandlers={{ click: () => onSelect(f.id) }}
          >
            <Popup>
              <div className="min-w-[200px] text-sm">
                <div className="font-semibold text-base mb-1">
                  {lang === "zh" ? f.nameZh : f.nameEn}
                </div>
                <div className="text-gray-600 mb-1 text-xs">
                  {lang === "zh" ? f.addressZh : f.addressEn}
                </div>
                {open != null && (
                  <div className={`text-xs font-medium mb-1 ${open ? "text-green-600" : "text-red-500"}`}>
                    {open ? (lang === "zh" ? "● 現正開放" : "● Open now") : (lang === "zh" ? "● 已關閉" : "● Closed")}
                  </div>
                )}
                {f.openHours && <div className="text-gray-500 text-xs">🕐 {f.openHours}</div>}
                {f.accessible && (
                  <div className="text-blue-600 text-xs mt-1">♿ {lang === "zh" ? "暢通易達" : "Accessible"}</div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

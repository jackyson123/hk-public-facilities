"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Facility,
  FacilityType,
  FACILITY_META,
} from "@/data/facilities";

// Fix default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

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

function FlyToUser({
  lat,
  lng,
}: {
  lat: number | null;
  lng: number | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], 15, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

interface MapProps {
  facilities: Facility[];
  userLat: number | null;
  userLng: number | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  lang: "zh" | "en";
}

export default function Map({
  facilities,
  userLat,
  userLng,
  selectedId,
  onSelect,
  lang,
}: MapProps) {
  const icons = useMemo(() => {
    const map: Record<FacilityType, L.DivIcon> = {} as Record<
      FacilityType,
      L.DivIcon
    >;
    (Object.keys(FACILITY_META) as FacilityType[]).forEach((t) => {
      map[t] = createColoredIcon(
        FACILITY_META[t].color,
        FACILITY_META[t].emoji
      );
    });
    return map;
  }, []);

  return (
    <MapContainer
      center={[22.3193, 114.1694]}
      zoom={13}
      className="h-full w-full z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToUser lat={userLat} lng={userLng} />

      {userLat != null && userLng != null && (
        <CircleMarker
          center={[userLat, userLng]}
          radius={8}
          pathOptions={{
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>{lang === "zh" ? "你的位置" : "Your location"}</Popup>
        </CircleMarker>
      )}

      {facilities.map((f) => (
        <Marker
          key={f.id}
          position={[f.lat, f.lng]}
          icon={icons[f.type]}
          eventHandlers={{
            click: () => onSelect(f.id),
          }}
        >
          <Popup>
            <div className="min-w-[180px] text-sm">
              <div className="font-semibold text-base mb-1">
                {lang === "zh" ? f.nameZh : f.nameEn}
              </div>
              <div className="text-gray-600 mb-1">
                {lang === "zh" ? f.addressZh : f.addressEn}
              </div>
              {f.openHours && (
                <div className="text-gray-500 text-xs">
                  🕐 {f.openHours}
                </div>
              )}
              {f.accessible && (
                <div className="text-blue-600 text-xs mt-1">
                  ♿️ {lang === "zh" ? "暢通易達" : "Accessible"}
                </div>
              )}
              {f.remarks && (
                <div className="text-gray-500 text-xs mt-1">{f.remarks}</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

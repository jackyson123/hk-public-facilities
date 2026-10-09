"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  CircleMarker,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Facility } from "@/data/facilities";
import MarkerCluster from "./MarkerCluster";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

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
  satellite: boolean;
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
  satellite,
}: MapProps) {
  const streetUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const streetAttr = dark
    ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OSM'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  const satUrl =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const satAttr = "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics";

  return (
    <MapContainer
      center={[22.3193, 114.1694]}
      zoom={12}
      className="h-full w-full z-0"
      scrollWheelZoom
    >
      <TileLayer
        key={satellite ? "sat" : dark ? "dark" : "osm"}
        attribution={satellite ? satAttr : streetAttr}
        url={satellite ? satUrl : streetUrl}
        maxZoom={19}
      />

      <FlyTo lat={flyLat} lng={flyLng} />

      {userLat != null && userLng != null && (
        <>
          <CircleMarker
            center={[userLat, userLng]}
            radius={8}
            pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.95, weight: 2 }}
          />
          {radiusMeters > 0 && (
            <Circle
              center={[userLat, userLng]}
              radius={radiusMeters}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: "6 4",
              }}
            />
          )}
        </>
      )}

      <MarkerCluster
        facilities={facilities}
        selectedId={selectedId}
        onSelect={onSelect}
        lang={lang}
      />
    </MapContainer>
  );
}

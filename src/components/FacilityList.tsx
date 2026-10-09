"use client";

import {
  Facility,
  FacilityType,
  FACILITY_META,
  getDistanceMeters,
} from "@/data/facilities";
import { MapPin, Navigation } from "lucide-react";

interface FacilityListProps {
  facilities: Facility[];
  userLat: number | null;
  userLng: number | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  lang: "zh" | "en";
}

export default function FacilityList({
  facilities,
  userLat,
  userLng,
  selectedId,
  onSelect,
  lang,
}: FacilityListProps) {
  const withDistance = facilities
    .map((f) => {
      const dist =
        userLat != null && userLng != null
          ? getDistanceMeters(userLat, userLng, f.lat, f.lng)
          : null;
      return { ...f, dist };
    })
    .sort((a, b) => {
      if (a.dist == null && b.dist == null) return 0;
      if (a.dist == null) return 1;
      if (b.dist == null) return -1;
      return a.dist - b.dist;
    });

  if (withDistance.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        {lang === "zh" ? "沒有符合條件的設施" : "No facilities match filters"}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 overflow-y-auto">
      {withDistance.map((f) => {
        const meta = FACILITY_META[f.type as FacilityType];
        const isSelected = selectedId === f.id;
        return (
          <li
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
              isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
                style={{ backgroundColor: meta.color + "22", color: meta.color }}
              >
                {meta.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {lang === "zh" ? f.nameZh : f.nameEn}
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5">
                  {lang === "zh" ? f.addressZh : f.addressEn}
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" />
                    {lang === "zh" ? f.districtZh : f.districtEn}
                  </span>
                  {f.dist != null && (
                    <span className="inline-flex items-center gap-0.5 text-blue-600 font-medium">
                      <Navigation className="h-3 w-3" />
                      {f.dist < 1000
                        ? `${Math.round(f.dist)} m`
                        : `${(f.dist / 1000).toFixed(1)} km`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

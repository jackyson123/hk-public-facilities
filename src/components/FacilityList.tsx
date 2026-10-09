"use client";

import {
  Facility,
  FacilityType,
  FACILITY_META,
  getDistanceMeters,
  formatDistance,
  isOpenNow,
} from "@/data/facilities";
import { MapPin, Navigation, Heart, Accessibility } from "lucide-react";

interface FacilityListProps {
  facilities: Facility[];
  userLat: number | null;
  userLng: number | null;
  selectedId: string | null;
  favorites: string[];
  onSelect: (id: string) => void;
  onToggleFav: (id: string) => void;
  lang: "zh" | "en";
  dark: boolean;
}

export default function FacilityList({
  facilities,
  userLat,
  userLng,
  selectedId,
  favorites,
  onSelect,
  onToggleFav,
  lang,
  dark,
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
      <div className={`p-6 text-center text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
        {lang === "zh" ? "沒有符合條件的設施" : "No facilities match filters"}
      </div>
    );
  }

  return (
    <ul className={`divide-y overflow-y-auto ${dark ? "divide-gray-700" : "divide-gray-100"}`}>
      {withDistance.map((f) => {
        const meta = FACILITY_META[f.type as FacilityType];
        const isSelected = selectedId === f.id;
        const isFav = favorites.includes(f.id);
        const open = isOpenNow(f.openSchedule);
        return (
          <li
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`px-4 py-3 cursor-pointer transition-colors ${
              dark
                ? isSelected ? "bg-blue-900/40 border-l-4 border-blue-400" : "hover:bg-gray-800"
                : isSelected ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50"
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
                <div className={`font-medium text-sm truncate ${dark ? "text-gray-100" : "text-gray-900"}`}>
                  {lang === "zh" ? f.nameZh : f.nameEn}
                </div>
                <div className={`text-xs truncate mt-0.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  {lang === "zh" ? f.addressZh : f.addressEn}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                  <span className={`inline-flex items-center gap-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                    <MapPin className="h-3 w-3" />
                    {lang === "zh" ? f.districtZh : f.districtEn}
                  </span>
                  {f.dist != null && (
                    <span className="inline-flex items-center gap-0.5 text-blue-500 font-medium">
                      <Navigation className="h-3 w-3" />
                      {formatDistance(f.dist, lang)}
                    </span>
                  )}
                  {open != null && (
                    <span className={open ? "text-green-500" : "text-red-400"}>
                      {open ? (lang === "zh" ? "開放" : "Open") : (lang === "zh" ? "關閉" : "Closed")}
                    </span>
                  )}
                  {f.accessible && (
                    <span className="text-blue-500 inline-flex items-center gap-0.5">
                      <Accessibility className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFav(f.id);
                }}
                className={`p-1.5 rounded-full shrink-0 ${isFav ? "text-red-500" : dark ? "text-gray-500 hover:text-red-400" : "text-gray-300 hover:text-red-400"}`}
              >
                <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

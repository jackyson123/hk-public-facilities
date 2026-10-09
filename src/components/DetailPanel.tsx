"use client";

import {
  Facility,
  FACILITY_META,
  isOpenNow,
  formatDistance,
  getDistanceMeters,
} from "@/data/facilities";
import { walkingDirectionsUrl, shareFacility } from "@/lib/share";
import {
  X,
  Heart,
  Share2,
  Navigation,
  Phone,
  Accessibility,
  ExternalLink,
  Clock,
} from "lucide-react";

interface DetailPanelProps {
  facility: Facility;
  userLat: number | null;
  userLng: number | null;
  isFav: boolean;
  onClose: () => void;
  onToggleFav: () => void;
  lang: "zh" | "en";
  dark: boolean;
}

export default function DetailPanel({
  facility: f,
  userLat,
  userLng,
  isFav,
  onClose,
  onToggleFav,
  lang,
  dark,
}: DetailPanelProps) {
  const meta = FACILITY_META[f.type];
  const open = isOpenNow(f.openSchedule);
  const dist =
    userLat != null && userLng != null
      ? getDistanceMeters(userLat, userLng, f.lat, f.lng)
      : null;

  const walkUrl = walkingDirectionsUrl(f.lat, f.lng, userLat, userLng);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 md:left-auto md:right-4 md:bottom-4 md:w-96 z-30 rounded-t-2xl md:rounded-2xl shadow-2xl border overflow-hidden ${
        dark ? "bg-gray-900 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
              style={{ backgroundColor: meta.color + "22", color: meta.color }}
            >
              {meta.emoji}
            </span>
            <div className="min-w-0">
              <h2 className="font-bold text-base leading-tight truncate">
                {lang === "zh" ? f.nameZh : f.nameEn}
              </h2>
              <p className={`text-xs mt-0.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {lang === "zh" ? meta.labelZh : meta.labelEn} · {lang === "zh" ? f.districtZh : f.districtEn}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-full ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className={`text-sm mb-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>
          {lang === "zh" ? f.addressZh : f.addressEn}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {open != null && (
            <span className={`px-2 py-1 rounded-full font-medium ${open ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-400"}`}>
              <Clock className="inline h-3 w-3 mr-1" />
              {open ? (lang === "zh" ? "現正開放" : "Open now") : (lang === "zh" ? "已關閉" : "Closed")}
            </span>
          )}
          {f.accessible && (
            <span className="px-2 py-1 rounded-full bg-blue-500/15 text-blue-500 font-medium">
              <Accessibility className="inline h-3 w-3 mr-1" />
              {lang === "zh" ? "暢通易達" : "Accessible"}
            </span>
          )}
          {dist != null && (
            <span className="px-2 py-1 rounded-full bg-gray-500/10 text-gray-500 font-medium">
              {formatDistance(dist, lang)}
            </span>
          )}
        </div>

        {f.openHours && (
          <p className={`text-xs mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
            🕐 {f.openHours}
          </p>
        )}
        {f.remarks && (
          <p className={`text-xs mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>{f.remarks}</p>
        )}
        {f.chargerTypes && (
          <p className={`text-xs mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
            ⚡ {f.chargerTypes.join(" · ")}
          </p>
        )}
        {f.phone && (
          <a href={`tel:${f.phone}`} className="text-xs text-blue-500 flex items-center gap-1 mb-3">
            <Phone className="h-3 w-3" /> {f.phone}
          </a>
        )}

        <div className="flex gap-2">
          <a
            href={walkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            <Navigation className="h-4 w-4" />
            {lang === "zh" ? "步行路線" : "Walk there"}
          </a>
          <button
            onClick={onToggleFav}
            className={`p-2.5 rounded-xl border ${
              isFav
                ? "border-red-300 text-red-500 bg-red-50"
                : dark
                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() =>
              shareFacility(lang === "zh" ? f.nameZh : f.nameEn, f.lat, f.lng, lang)
            }
            className={`p-2.5 rounded-xl border ${
              dark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Share2 className="h-5 w-5" />
          </button>
          <a
            href={`https://www.google.com/maps?q=${f.lat},${f.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2.5 rounded-xl border ${
              dark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

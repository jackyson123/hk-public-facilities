import { FacilityType } from "@/data/facilities";

export type UrlState = {
  types: FacilityType[];
  radius: number;
  accessible: boolean;
  open: boolean;
  fav: boolean;
  q: string;
  lang: "zh" | "en";
  dark: boolean;
  id?: string;
  lat?: number;
  lng?: number;
};

const ALL: FacilityType[] = ["toilet", "water", "ev", "wifi", "clinic", "shelter"];

export function parseUrlState(params: URLSearchParams): Partial<UrlState> {
  const state: Partial<UrlState> = {};

  const types = params.get("types");
  if (types) {
    const list = types.split(",").filter((t) => ALL.includes(t as FacilityType)) as FacilityType[];
    if (list.length) state.types = list;
  }

  const radius = params.get("radius");
  if (radius != null && radius !== "") {
    const n = parseInt(radius, 10);
    if (!Number.isNaN(n)) state.radius = n;
  }

  if (params.get("accessible") === "1") state.accessible = true;
  if (params.get("open") === "1") state.open = true;
  if (params.get("fav") === "1") state.fav = true;

  const q = params.get("q");
  if (q) state.q = q;

  const lang = params.get("lang");
  if (lang === "en" || lang === "zh") state.lang = lang;

  if (params.get("dark") === "1") state.dark = true;
  if (params.get("dark") === "0") state.dark = false;

  const id = params.get("id");
  if (id) state.id = id;

  const lat = params.get("lat");
  const lng = params.get("lng");
  if (lat && lng) {
    const la = parseFloat(lat);
    const ln = parseFloat(lng);
    if (!Number.isNaN(la) && !Number.isNaN(ln)) {
      state.lat = la;
      state.lng = ln;
    }
  }

  return state;
}

export function buildUrlQuery(state: UrlState): string {
  const p = new URLSearchParams();

  const allTypes = ALL.every((t) => state.types.includes(t)) && state.types.length === ALL.length;
  if (!allTypes && state.types.length > 0) {
    p.set("types", state.types.join(","));
  }

  if (state.radius > 0) p.set("radius", String(state.radius));
  if (state.accessible) p.set("accessible", "1");
  if (state.open) p.set("open", "1");
  if (state.fav) p.set("fav", "1");
  if (state.q.trim()) p.set("q", state.q.trim());
  if (state.lang === "en") p.set("lang", "en");
  if (state.dark) p.set("dark", "1");
  if (state.id) p.set("id", state.id);
  if (state.lat != null && state.lng != null) {
    p.set("lat", state.lat.toFixed(5));
    p.set("lng", state.lng.toFixed(5));
  }

  const s = p.toString();
  return s ? `?${s}` : "";
}

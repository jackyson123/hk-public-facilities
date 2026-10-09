import { NextResponse } from "next/server";

export const revalidate = 600; // 10 min

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") === "en" ? "en" : "tc";

  try {
    const [rhr, warn, flw] = await Promise.all([
      fetch(
        `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=${lang}`,
        { next: { revalidate: 600 } }
      ).then((r) => r.json()),
      fetch(
        `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=${lang}`,
        { next: { revalidate: 600 } }
      ).then((r) => r.json()).catch(() => ({})),
      fetch(
        `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=${lang}`,
        { next: { revalidate: 600 } }
      ).then((r) => r.json()).catch(() => ({})),
    ]);

    // Temperature at HKO
    const temps = rhr?.temperature?.data || [];
    const hkoTemp =
      temps.find((t: { place: string }) =>
        /天文台|Observatory/i.test(t.place)
      ) || temps[0];

    const humidity = rhr?.humidity?.data?.[0]?.value;
    const rainfall = (rhr?.rainfall?.data || []).filter(
      (x: { max?: number }) => (x.max ?? 0) > 0
    );
    const raining = rainfall.length > 0;
    const maxRain = rainfall.reduce(
      (m: number, x: { max?: number }) => Math.max(m, x.max || 0),
      0
    );

    const warnings = Object.values(warn || {})
      .filter((v) => v && typeof v === "object" && (v as { name?: string }).name)
      .map((v) => {
        const w = v as { name?: string; code?: string; type?: string };
        return w.name || w.code || "";
      })
      .filter(Boolean);

    const forecast = flw?.forecastDesc || flw?.generalSituation || "";

    // Tips for facilities map
    const tips: string[] = [];
    if (lang === "tc") {
      if (raining) tips.push(`正下雨（最高約 ${maxRain} mm），建議優先搵有蓋公廁／室內飲水機`);
      if (warnings.length) tips.push(`天氣警告：${warnings.slice(0, 3).join("、")}`);
      if (hkoTemp?.value >= 33) tips.push("酷熱，記得多補水，可搵附近飲水機");
      if (hkoTemp?.value <= 12) tips.push("天氣寒冷，減少長時間戶外停留");
      if (!tips.length && forecast) tips.push(String(forecast).slice(0, 80) + (String(forecast).length > 80 ? "…" : ""));
    } else {
      if (raining) tips.push(`Raining (up to ~${maxRain} mm). Prefer covered toilets / indoor water.`);
      if (warnings.length) tips.push(`Warnings: ${warnings.slice(0, 3).join(", ")}`);
      if (hkoTemp?.value >= 33) tips.push("Very hot — stay hydrated, find water dispensers.");
      if (hkoTemp?.value <= 12) tips.push("Cold weather — limit long outdoor stays.");
      if (!tips.length && forecast) tips.push(String(forecast).slice(0, 100));
    }

    return NextResponse.json({
      updatedAt: rhr?.updateTime || new Date().toISOString(),
      temperature: hkoTemp?.value ?? null,
      humidity: humidity ?? null,
      raining,
      maxRainfall: maxRain,
      warnings,
      tips,
      icon: rhr?.icon?.[0] ?? null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "weather unavailable", tips: [] }, { status: 502 });
  }
}

export function shareFacility(
  name: string,
  lat: number,
  lng: number,
  lang: "zh" | "en"
) {
  const text =
    lang === "zh"
      ? `📍 ${name}\nhttps://www.google.com/maps?q=${lat},${lng}`
      : `📍 ${name}\nhttps://www.google.com/maps?q=${lat},${lng}`;

  if (navigator.share) {
    navigator.share({ title: name, text, url: `https://www.google.com/maps?q=${lat},${lng}` }).catch(() => {
      copyText(text);
    });
  } else {
    copyText(text);
  }
}

function copyText(text: string) {
  navigator.clipboard?.writeText(text).then(() => {
    alert("已複製連結 / Link copied");
  });
}

export function walkingDirectionsUrl(lat: number, lng: number, fromLat?: number | null, fromLng?: number | null) {
  if (fromLat != null && fromLng != null) {
    return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${lat},${lng}&travelmode=walking`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

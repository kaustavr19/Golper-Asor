import type { SyntheticEvent } from "react";

export function ytThumb(videoId: string, quality: "max" | "hq" = "hq"): string {
  const name = quality === "max" ? "maxresdefault" : "hqdefault";
  return `https://img.youtube.com/vi/${videoId}/${name}.jpg`;
}

// maxresdefault.jpg doesn't exist for every upload — fall back to hqdefault
// (which YouTube always generates) when it 404s.
export function handleThumbError(e: SyntheticEvent<HTMLImageElement>, videoId: string) {
  const img = e.currentTarget;
  const fallback = ytThumb(videoId, "hq");
  if (img.src !== fallback) img.src = fallback;
}

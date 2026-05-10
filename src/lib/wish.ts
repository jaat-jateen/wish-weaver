import type { AnimationStyle, FestivalId, FontChoice } from "./festivals";

export interface WishData {
  v: 1;
  from: string;
  to?: string;
  message: string;
  festival: FestivalId;
  font: FontChoice;
  animation: AnimationStyle;
  music?: string; // preset id or "" for none
  bgImage?: string; // optional URL or data URL (kept short)
  textColor?: "light" | "dark";
}

// URL-safe base64 encode/decode of JSON
export function encodeWish(data: WishData): string {
  const json = JSON.stringify(data);
  const b64 = typeof window === "undefined"
    ? Buffer.from(json, "utf8").toString("base64")
    : btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeWish(id: string): WishData | null {
  try {
    let b64 = id.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = typeof window === "undefined"
      ? Buffer.from(b64, "base64").toString("utf8")
      : decodeURIComponent(escape(atob(b64)));
    const data = JSON.parse(json);
    if (data && data.v === 1 && data.from && data.message && data.festival) return data as WishData;
    return null;
  } catch {
    return null;
  }
}

export const SAMPLE_DIWALI: WishData = {
  v: 1,
  from: "Jateen",
  message: "May this Diwali fill your home with joy, your heart with love, and your life with endless light. ✨",
  festival: "diwali",
  font: "display",
  animation: "rise",
  music: "diwali-1",
  textColor: "light",
};

export const PRESET_MUSIC = [
  { id: "", name: "None", festival: "all" },
  { id: "diwali-1", name: "Diya Glow (Sitar)", festival: "diwali" },
  { id: "holi-1", name: "Rang Barse", festival: "holi" },
  { id: "eid-1", name: "Moonlight Oud", festival: "eid" },
  { id: "christmas-1", name: "Silent Night", festival: "christmas" },
  { id: "newyear-1", name: "Countdown Anthem", festival: "newyear" },
  { id: "ambient-1", name: "Soft Ambient", festival: "all" },
] as const;

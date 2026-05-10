import type { AnimationStyle, FestivalId, FontChoice } from "./festivals";
import { supabase } from "@/integrations/supabase/client";

export interface WishData {
  v: 1;
  from: string;
  to?: string;
  message: string;
  festival: FestivalId;
  font: FontChoice;
  animation: AnimationStyle;
  music?: string;
  bgImage?: string;
  textColor?: "light" | "dark";
}

/* ---------- Short ID generation ---------- */

const ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789"; // no 0/1/l/o ambiguity
function makeShortId(len = 7): string {
  let out = "";
  const arr = new Uint32Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) out += ALPHABET[arr[i] % ALPHABET.length];
  } else {
    for (let i = 0; i < len; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/* ---------- DB save / load ---------- */

export async function saveWish(data: WishData): Promise<string> {
  // try a few times in case of short_id collision
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const short_id = makeShortId(7 + Math.floor(attempt / 2));
    const { error } = await supabase.from("wishes").insert({
      short_id,
      from: data.from,
      to: data.to || null,
      message: data.message,
      festival: data.festival,
      font: data.font,
      animation: data.animation,
      music: data.music || null,
      text_color: data.textColor || null,
      bg_image: data.bgImage || null,
    });
    if (!error) return short_id;
    lastErr = error;
    // 23505 = unique violation -> retry; otherwise bail
    if ((error as { code?: string }).code !== "23505") break;
  }
  throw lastErr instanceof Error ? lastErr : new Error("Failed to save wish");
}

export async function loadWish(shortId: string): Promise<WishData | null> {
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("short_id", shortId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    v: 1,
    from: data.from,
    to: data.to ?? undefined,
    message: data.message,
    festival: data.festival as FestivalId,
    font: data.font as FontChoice,
    animation: data.animation as AnimationStyle,
    music: data.music ?? undefined,
    textColor: (data.text_color as "light" | "dark" | null) ?? undefined,
    bgImage: data.bg_image ?? undefined,
  };
}

/* ---------- Legacy base64 encode/decode (back-compat for old links) ---------- */

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

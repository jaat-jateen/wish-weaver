export type FestivalId =
  | "diwali"
  | "holi"
  | "eid"
  | "christmas"
  | "independence"
  | "newyear"
  | "morning"
  | "evening"
  | "night";

export interface FestivalTheme {
  id: FestivalId;
  name: string;
  emoji: string;
  greeting: string;
  tagline: string;
  /** approximate month/day for auto-detect (IST). 0-indexed month. */
  date?: { month: number; day: number; window?: number };
  /** CSS gradient for background */
  gradient: string;
  accent: string; // hex-ish via oklch
  particle: "diya" | "color" | "stars" | "snow" | "tricolor" | "fireworks" | "sun" | "warm" | "starry";
}

export const FESTIVALS: Record<FestivalId, FestivalTheme> = {
  diwali: {
    id: "diwali",
    name: "Diwali",
    emoji: "🪔",
    greeting: "Happy Diwali",
    tagline: "May your life sparkle with light, love & laughter.",
    date: { month: 10, day: 1, window: 20 },
    gradient: "radial-gradient(ellipse at 50% 100%, oklch(0.35 0.12 50) 0%, oklch(0.18 0.06 290) 60%, oklch(0.1 0.04 290) 100%)",
    accent: "oklch(0.82 0.17 80)",
    particle: "diya",
  },
  holi: {
    id: "holi",
    name: "Holi",
    emoji: "🎨",
    greeting: "Happy Holi",
    tagline: "May your life be as colorful as today.",
    date: { month: 2, day: 14, window: 5 },
    gradient: "radial-gradient(ellipse at 30% 30%, oklch(0.7 0.22 350) 0%, oklch(0.55 0.2 280) 50%, oklch(0.4 0.18 200) 100%)",
    accent: "oklch(0.78 0.22 350)",
    particle: "color",
  },
  eid: {
    id: "eid",
    name: "Eid",
    emoji: "🌙",
    greeting: "Eid Mubarak",
    tagline: "Wishing you peace, joy & prosperity.",
    gradient: "radial-gradient(ellipse at 70% 20%, oklch(0.45 0.1 200) 0%, oklch(0.22 0.06 250) 60%, oklch(0.12 0.04 260) 100%)",
    accent: "oklch(0.85 0.12 180)",
    particle: "stars",
  },
  christmas: {
    id: "christmas",
    name: "Christmas",
    emoji: "🎄",
    greeting: "Merry Christmas",
    tagline: "Warm wishes for a season of joy.",
    date: { month: 11, day: 25, window: 7 },
    gradient: "radial-gradient(ellipse at 50% 0%, oklch(0.35 0.12 25) 0%, oklch(0.2 0.08 150) 60%, oklch(0.12 0.05 150) 100%)",
    accent: "oklch(0.7 0.2 25)",
    particle: "snow",
  },
  independence: {
    id: "independence",
    name: "Independence Day",
    emoji: "🇮🇳",
    greeting: "Happy Independence Day",
    tagline: "Saluting the spirit of freedom.",
    date: { month: 7, day: 15, window: 2 },
    gradient: "linear-gradient(180deg, oklch(0.7 0.18 50) 0%, oklch(0.98 0.01 90) 50%, oklch(0.55 0.18 150) 100%)",
    accent: "oklch(0.55 0.18 150)",
    particle: "tricolor",
  },
  newyear: {
    id: "newyear",
    name: "New Year",
    emoji: "🎆",
    greeting: "Happy New Year",
    tagline: "A fresh chapter begins. Make it beautiful.",
    date: { month: 0, day: 1, window: 3 },
    gradient: "radial-gradient(ellipse at 50% 50%, oklch(0.35 0.15 290) 0%, oklch(0.15 0.06 290) 70%)",
    accent: "oklch(0.82 0.17 80)",
    particle: "fireworks",
  },
  morning: {
    id: "morning",
    name: "Good Morning",
    emoji: "☀️",
    greeting: "Good Morning",
    tagline: "A bright new day, just for you.",
    gradient: "linear-gradient(180deg, oklch(0.85 0.12 80) 0%, oklch(0.7 0.18 60) 50%, oklch(0.55 0.2 35) 100%)",
    accent: "oklch(0.78 0.2 60)",
    particle: "sun",
  },
  evening: {
    id: "evening",
    name: "Good Evening",
    emoji: "🌅",
    greeting: "Good Evening",
    tagline: "Sending warmth your way.",
    gradient: "linear-gradient(180deg, oklch(0.55 0.2 35) 0%, oklch(0.4 0.15 25) 60%, oklch(0.25 0.08 280) 100%)",
    accent: "oklch(0.7 0.2 35)",
    particle: "warm",
  },
  night: {
    id: "night",
    name: "Good Night",
    emoji: "🌙",
    greeting: "Good Night",
    tagline: "Sweet dreams, always.",
    gradient: "radial-gradient(ellipse at 50% 30%, oklch(0.25 0.06 270) 0%, oklch(0.1 0.04 270) 80%)",
    accent: "oklch(0.85 0.05 240)",
    particle: "starry",
  },
};

export function detectFestival(now = new Date()): FestivalId {
  const m = now.getMonth();
  const d = now.getDate();
  for (const f of Object.values(FESTIVALS)) {
    if (!f.date) continue;
    const w = f.date.window ?? 1;
    if (f.date.month === m && Math.abs(f.date.day - d) <= w) return f.id;
  }
  // Time of day fallback
  const h = now.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "evening";
  return "night";
}

export function timeOfDayGreeting(now = new Date()): string {
  const h = now.getHours();
  if (h >= 5 && h < 12) return "Good Morning";
  if (h >= 12 && h < 17) return "Good Afternoon";
  if (h >= 17 && h < 21) return "Good Evening";
  return "Good Night";
}

export const FONT_CHOICES = [
  { id: "display", name: "Elegant Serif", className: "font-[var(--font-display)]" },
  { id: "sans", name: "Modern Sans", className: "font-[var(--font-sans)]" },
  { id: "script", name: "Hand Script", className: "[font-family:'Caveat',cursive]" },
] as const;

export const ANIMATION_STYLES = [
  { id: "fade", name: "Soft Fade" },
  { id: "rise", name: "Rise Up" },
  { id: "zoom", name: "Cinematic Zoom" },
  { id: "type", name: "Typewriter" },
] as const;

export type AnimationStyle = (typeof ANIMATION_STYLES)[number]["id"];
export type FontChoice = (typeof FONT_CHOICES)[number]["id"];

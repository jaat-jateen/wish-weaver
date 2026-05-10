import { motion } from "framer-motion";
import { FESTIVALS } from "@/lib/festivals";
import type { WishData } from "@/lib/wish";
import { FestivalBackground } from "./FestivalBackground";

const fontClass: Record<string, string> = {
  display: "[font-family:var(--font-display)]",
  sans: "[font-family:var(--font-sans)]",
  script: "[font-family:'Caveat','Brush_Script_MT',cursive]",
};

/** AI-style greeting line generator (deterministic, no API for v1). */
export function makeAIGreeting(data: WishData): string {
  const f = FESTIVALS[data.festival];
  const variants = [
    `${data.from} wishes you happiness and prosperity ${f.emoji}`,
    `A heartfelt ${f.name.toLowerCase()} note from ${data.from} ${f.emoji}`,
    `${data.from} sends you light, love & ${f.name.toLowerCase()} joy ${f.emoji}`,
  ];
  const idx = (data.from.length + data.festival.length) % variants.length;
  return variants[idx];
}

export function WishStage({ data, preview = false }: { data: WishData; preview?: boolean }) {
  const theme = FESTIVALS[data.festival];
  const aiLine = makeAIGreeting(data);
  const textTone = data.textColor === "dark" ? "text-neutral-900" : "text-white";

  return (
    <div className={`relative ${preview ? "min-h-[520px]" : "min-h-screen"} w-full overflow-hidden flex items-center justify-center`}>
      <FestivalBackground festival={data.festival} bgImage={data.bgImage} />

      <div className={`relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center ${textTone}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl sm:text-7xl mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
        >
          {theme.emoji}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm uppercase tracking-[0.4em] text-white/70 mb-3"
        >
          {data.to ? `For ${data.to}` : aiLine}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
          className={`text-gradient-gold ${fontClass[data.font] ?? fontClass.display} text-5xl sm:text-7xl font-bold leading-[1.05] mb-6`}
        >
          {theme.greeting}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className={`${fontClass[data.font] ?? fontClass.display} text-lg sm:text-2xl leading-relaxed text-white/95 max-w-xl drop-shadow`}
        >
          {data.message || theme.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-10 flex items-center gap-3 text-sm text-white/70"
        >
          <span className="h-px w-10 bg-white/40" />
          <span className="tracking-widest uppercase">With love, {data.from}</span>
          <span className="h-px w-10 bg-white/40" />
        </motion.div>
      </div>
    </div>
  );
}

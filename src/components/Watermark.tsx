import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { FESTIVALS, type FestivalId } from "@/lib/festivals";

export function Watermark({ festival }: { festival?: FestivalId }) {
  const emoji = festival ? FESTIVALS[festival].emoji : "✨";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <Link
        to="/"
        className="glass group flex items-center gap-2 rounded-full px-4 py-2 text-xs text-white/90 hover:text-white transition-all hover:scale-105"
      >
        <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
        <span className="font-medium tracking-wide">
          Created with <span className="text-gradient-gold font-semibold">WishYourFriends</span>
        </span>
        <span className="text-base leading-none">{emoji}</span>
      </Link>
    </motion.div>
  );
}

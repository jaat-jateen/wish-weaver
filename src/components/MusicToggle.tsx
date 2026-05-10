import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play } from "lucide-react";

interface Props {
  src?: string;
  autoPromptLabel?: string;
}

/**
 * Lightweight music toggle. Shows a "Tap to play" CTA on first mount
 * (mobile browsers block autoplay). Falls back to silent if no src.
 */
export function MusicToggle({ src, autoPromptLabel = "Tap to play music" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(Boolean(src));

  useEffect(() => {
    if (!src) return;
    const a = new Audio(src);
    a.loop = true;
    a.volume = 0.55;
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) {
      setShowPrompt(false);
      return;
    }
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
        setShowPrompt(false);
      } catch {
        setShowPrompt(true);
      }
    }
  };

  if (!src) return null;

  return (
    <>
      <button
        onClick={toggle}
        className="glass fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full text-white/90 hover:scale-105 transition"
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Music className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {showPrompt && !playing && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={toggle}
            className="glass fixed top-20 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-xs text-white shadow-[var(--shadow-glow)]"
          >
            <Play className="h-3.5 w-3.5 text-[var(--gold)]" />
            {autoPromptLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

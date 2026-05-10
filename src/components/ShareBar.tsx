import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2 } from "lucide-react";

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      copy();
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2"
    >
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white hover:scale-105 transition"
        style={{ background: "linear-gradient(135deg, oklch(0.65 0.18 150 / 0.4), oklch(0.5 0.16 150 / 0.3))" }}
      >
        <WhatsAppIcon className="h-4 w-4" />
        Share on WhatsApp
      </a>
      <button
        onClick={copy}
        className="glass flex h-11 w-11 items-center justify-center rounded-full text-white/90 hover:scale-105 transition"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-[var(--gold)]" /> : <Copy className="h-4 w-4" />}
      </button>
      <button
        onClick={share}
        className="glass flex h-11 w-11 items-center justify-center rounded-full text-white/90 hover:scale-105 transition"
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.78 11.78 0 0 0 12.06 0C5.5 0 .17 5.32.17 11.88c0 2.09.55 4.13 1.6 5.93L0 24l6.34-1.66a11.86 11.86 0 0 0 5.72 1.46h.01c6.55 0 11.88-5.33 11.88-11.88a11.8 11.8 0 0 0-3.43-8.44ZM12.07 21.6h-.01a9.7 9.7 0 0 1-4.95-1.36l-.36-.21-3.76.98 1-3.66-.23-.38a9.72 9.72 0 0 1-1.49-5.19c0-5.37 4.37-9.74 9.81-9.74 2.62 0 5.07 1.02 6.92 2.87a9.7 9.7 0 0 1 2.86 6.89c0 5.37-4.37 9.8-9.79 9.8Zm5.36-7.31c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.36-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5l-.56-.01c-.2 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43s1.05 2.82 1.2 3.02c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.74-.71 1.99-1.4.24-.69.24-1.28.17-1.4-.07-.12-.27-.2-.56-.34Z"/>
    </svg>
  );
}

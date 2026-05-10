import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { decodeWish, loadWish, SAMPLE_DIWALI, type WishData } from "@/lib/wish";
import { WishStage, makeAIGreeting } from "@/components/WishStage";
import { Watermark } from "@/components/Watermark";
import { ShareBar } from "@/components/ShareBar";
import { MusicToggle } from "@/components/MusicToggle";
import { FESTIVALS } from "@/lib/festivals";

export const Route = createFileRoute("/wish/$id")({
  component: WishPage,
});

function WishPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<WishData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [url, setUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    setUrl(window.location.href);

    async function run() {
      if (id === "diwali-sample") {
        setData(SAMPLE_DIWALI);
        setStatus("ready");
        return;
      }
      // Short IDs are short and lowercase alphanumerics; longer strings are
      // legacy base64-encoded payloads from earlier links — keep them working.
      const looksShort = /^[a-z0-9]{4,24}$/.test(id);
      if (looksShort) {
        const d = await loadWish(id);
        if (cancelled) return;
        if (d) {
          setData(d);
          setStatus("ready");
          return;
        }
      }
      const decoded = decodeWish(id);
      if (cancelled) return;
      if (decoded) {
        setData(decoded);
        setStatus("ready");
      } else {
        setStatus("missing");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--gold)]" />
      </div>
    );
  }

  if (status === "missing" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-3xl mb-4">😕</p>
          <h1 className="display text-2xl mb-2">This wish couldn&apos;t load</h1>
          <p className="text-white/60 mb-6 text-sm">The link may be broken or expired.</p>
          <Link
            to="/"
            className="inline-block rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-neutral-900"
          >
            Create your own ✨
          </Link>
        </div>
      </div>
    );
  }

  const title = `${FESTIVALS[data.festival].greeting} from ${data.from}`;
  const musicSrc = data.music ? `/music/${data.music}.mp3` : undefined;

  return (
    <>
      <WishStage data={data} />
      <MusicToggle src={musicSrc} autoPromptLabel={`Tap to play • ${makeAIGreeting(data)}`} />
      <ShareBar url={url} title={title} />
      <Watermark festival={data.festival} />
    </>
  );
}

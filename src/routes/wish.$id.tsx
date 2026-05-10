import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { decodeWish, SAMPLE_DIWALI, type WishData } from "@/lib/wish";
import { WishStage, makeAIGreeting } from "@/components/WishStage";
import { Watermark } from "@/components/Watermark";
import { ShareBar } from "@/components/ShareBar";
import { MusicToggle } from "@/components/MusicToggle";
import { FESTIVALS } from "@/lib/festivals";

export const Route = createFileRoute("/wish/$id")({
  head: ({ params }) => {
    const data = params.id === "diwali-sample" ? SAMPLE_DIWALI : decodeWish(params.id);
    if (!data) {
      return { meta: [{ title: "WishYourFriends" }] };
    }
    const f = FESTIVALS[data.festival];
    const title = `${f.greeting} from ${data.from}`;
    const desc = data.message.slice(0, 150);
    return {
      meta: [
        { title: `${title} — WishYourFriends` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
    };
  },
  component: WishPage,
});

function WishPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<WishData | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const d = id === "diwali-sample" ? SAMPLE_DIWALI : decodeWish(id);
    setData(d);
    setUrl(window.location.href);
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-3xl mb-4">😕</p>
          <h1 className="display text-2xl mb-2">This wish couldn&apos;t load</h1>
          <p className="text-white/60 mb-6 text-sm">The link may be broken or incomplete.</p>
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

      {/* Monetisation slots — kept as comments for future drop-in */}
      {/* <AdSlot id="below-fold-banner" /> */}
      {/* <AdSlot id="sticky-bottom" /> */}
    </>
  );
}

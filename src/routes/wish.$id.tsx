import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { decodeWish, loadWish, SAMPLE_DIWALI, type WishData } from "@/lib/wish";
import { WishStage, makeAIGreeting } from "@/components/WishStage";
import { Watermark } from "@/components/Watermark";
import { ShareBar } from "@/components/ShareBar";
import { MusicToggle } from "@/components/MusicToggle";
import { FESTIVALS } from "@/lib/festivals";

async function resolveWish(id: string): Promise<WishData | null> {
  if (id === "diwali-sample") return SAMPLE_DIWALI;
  const looksShort = /^[a-z0-9]{4,24}$/.test(id);
  if (looksShort) {
    const d = await loadWish(id);
    if (d) return d;
  }
  return decodeWish(id);
}

function buildOg(data: WishData | null, id: string) {
  if (!data) {
    return {
      title: "A wish for you ✨ — WishYourFriends",
      description: "Open this personalized greeting on WishYourFriends.",
    };
  }
  const fest = FESTIVALS[data.festival];
  const greeting = `${fest.greeting} ${fest.emoji}`.trim();
  const title = data.to
    ? `${data.from} wishes ${data.to} — ${greeting}`
    : `${data.from} sent you a wish — ${greeting}`;
  const snippet = data.message.length > 120 ? `${data.message.slice(0, 117)}…` : data.message;
  const description = data.to
    ? `${data.from} to ${data.to}: "${snippet}" — created with WishYourFriends`
    : `From ${data.from}: "${snippet}" — created with WishYourFriends`;
  return { title, description, id };
}

export const Route = createFileRoute("/wish/$id")({
  loader: async ({ params }) => {
    const data = await resolveWish(params.id);
    return { wish: data, id: params.id };
  },
  head: ({ loaderData }) => {
    const { title, description } = buildOg(loaderData?.wish ?? null, loaderData?.id ?? "");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: WishPage,
});

function WishPage() {
  const { wish } = Route.useLoaderData();
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!wish) {
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

  const title = `${FESTIVALS[wish.festival].greeting} from ${wish.from}`;
  const musicSrc = wish.music ? `/music/${wish.music}.mp3` : undefined;

  return (
    <>
      <WishStage data={wish} />
      <MusicToggle src={musicSrc} autoPromptLabel={`Tap to play • ${makeAIGreeting(wish)}`} />
      <ShareBar url={url} title={title} />
      <Watermark festival={wish.festival} />
    </>
  );
}

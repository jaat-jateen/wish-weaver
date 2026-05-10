import { createFileRoute } from "@tanstack/react-router";
import { CreatorFlow } from "@/components/CreatorFlow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WishYourFriends — Create cinematic festival wishes" },
      { name: "description", content: "Build a beautiful, shareable festival greeting in 30 seconds. Diwali, Holi, Eid, Christmas, New Year & more." },
      { property: "og:title", content: "WishYourFriends — Create cinematic festival wishes" },
      { property: "og:description", content: "Build a beautiful, shareable festival greeting in 30 seconds." },
    ],
  }),
  component: CreatorFlow,
});

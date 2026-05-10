import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Upload, Check, Lock } from "lucide-react";
import {
  ANIMATION_STYLES,
  FESTIVALS,
  FONT_CHOICES,
  detectFestival,
  timeOfDayGreeting,
  type FestivalId,
} from "@/lib/festivals";
import { saveWish, PRESET_MUSIC, type WishData } from "@/lib/wish";
import { toast } from "sonner";
import { WishStage } from "./WishStage";
import { Button } from "@/components/ui/button";

const STEPS = ["You", "Message", "Theme", "Style", "Music", "Preview"] as const;

const PREMIUM_THEMES: FestivalId[] = []; // hook for future locked themes

export function CreatorFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const auto = useMemo(() => detectFestival(), []);
  const tod = useMemo(() => timeOfDayGreeting(), []);

  const [data, setData] = useState<WishData>({
    v: 1,
    from: "",
    to: "",
    message: `${tod}! Wishing you a beautiful day ahead. ✨`,
    festival: auto,
    font: "display",
    animation: "rise",
    music: PRESET_MUSIC.find((m) => m.festival === auto)?.id ?? "",
    textColor: "light",
  });

  const set = <K extends keyof WishData>(k: K, v: WishData[K]) => setData((d) => ({ ...d, [k]: v }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canNext = step === 0 ? data.from.trim().length > 0 : true;
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const id = await saveWish(data);
      navigate({ to: "/wish/$id", params: { id } });
    } catch (e) {
      console.error(e);
      toast.error("Couldn't generate your link. Please try again.");
      setGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.32 0.12 50 / 0.5) 0%, oklch(0.18 0.04 290) 60%)",
        }}
      />
      <div className="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(circle_at_20%_30%,oklch(0.55_0.22_350/0.18),transparent_50%),radial-gradient(circle_at_80%_70%,oklch(0.55_0.22_60/0.18),transparent_50%)]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--gold)]" />
          <span className="text-gradient-gold display text-lg font-bold tracking-tight">WishYourFriends</span>
        </Link>
        <div className="text-xs text-white/50">Today: {FESTIVALS[auto].emoji} {FESTIVALS[auto].name}</div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-32 sm:px-8">
        {/* Progress */}
        <div className="mt-2 mb-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= step ? "bg-[var(--gold)]" : "bg-white/10"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Step {step + 1} / {STEPS.length}</p>
          <p className="text-xs text-white/50">{STEPS[step]}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="glass rounded-3xl p-6 sm:p-10"
          >
            {step === 0 && <StepYou data={data} set={set} />}
            {step === 1 && <StepMessage data={data} set={set} />}
            {step === 2 && <StepTheme data={data} set={set} />}
            {step === 3 && <StepStyle data={data} set={set} />}
            {step === 4 && <StepMusic data={data} set={set} />}
            {step === 5 && <StepPreview data={data} />}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0}
            className="text-white/70 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={next}
              disabled={!canNext}
              className="bg-gradient-to-r from-[oklch(0.85_0.18_80)] to-[oklch(0.7_0.22_55)] text-neutral-900 font-semibold hover:opacity-90 shadow-[var(--shadow-glow)]"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={generate}
              className="bg-gradient-to-r from-[oklch(0.85_0.18_80)] to-[oklch(0.7_0.22_55)] text-neutral-900 font-semibold hover:opacity-90 shadow-[var(--shadow-glow)]"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Generate Link
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

/* ------------ Steps ------------ */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-white/90">{label}</span>
        {hint && <span className="text-xs text-white/40">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[var(--gold)] focus:bg-white/10";

function StepYou({ data, set }: { data: WishData; set: <K extends keyof WishData>(k: K, v: WishData[K]) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="display text-3xl sm:text-4xl text-white mb-1">Let&apos;s start with you</h2>
        <p className="text-sm text-white/60">Your name will sign the wish.</p>
      </div>
      <Field label="Your name">
        <input
          autoFocus
          className={inputCls}
          placeholder="e.g. Jateen"
          value={data.from}
          onChange={(e) => set("from", e.target.value)}
        />
      </Field>
      <Field label="Recipient (optional)" hint="Personalises the page">
        <input
          className={inputCls}
          placeholder="e.g. Riya"
          value={data.to ?? ""}
          onChange={(e) => set("to", e.target.value)}
        />
      </Field>
    </div>
  );
}

function StepMessage({ data, set }: { data: WishData; set: <K extends keyof WishData>(k: K, v: WishData[K]) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="display text-3xl sm:text-4xl text-white mb-1">Your message</h2>
        <p className="text-sm text-white/60">Keep it warm. Keep it real.</p>
      </div>
      <Field label="Custom message">
        <textarea
          rows={5}
          className={inputCls + " resize-none"}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>
    </div>
  );
}

function StepTheme({ data, set }: { data: WishData; set: <K extends keyof WishData>(k: K, v: WishData[K]) => void }) {
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      set("bgImage", url);
      // Heuristic: if average brightness low → light text, else dark
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = 32; c.height = 32;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 32, 32);
        const { data: px } = ctx.getImageData(0, 0, 32, 32);
        let lum = 0;
        for (let i = 0; i < px.length; i += 4) lum += (px[i] + px[i + 1] + px[i + 2]) / 3;
        const avg = lum / (px.length / 4);
        set("textColor", avg < 128 ? "light" : "dark");
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="display text-3xl sm:text-4xl text-white mb-1">Pick a theme</h2>
        <p className="text-sm text-white/60">We&apos;ve auto-selected today&apos;s vibe — change it any time.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.values(FESTIVALS).map((f) => {
          const locked = PREMIUM_THEMES.includes(f.id);
          const active = data.festival === f.id;
          return (
            <button
              key={f.id}
              onClick={() => !locked && set("festival", f.id)}
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden text-left transition group ${
                active ? "ring-2 ring-[var(--gold)] shadow-[var(--shadow-glow)]" : "ring-1 ring-white/10 hover:ring-white/30"
              }`}
              style={{ background: f.gradient }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                <span className="text-sm font-semibold">{f.name}</span>
                <span className="text-xl">{f.emoji}</span>
              </div>
              {active && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[var(--gold)] text-neutral-900 grid place-items-center">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
              {locked && (
                <div className="absolute inset-0 backdrop-blur-md bg-black/40 grid place-items-center text-white">
                  <Lock className="h-5 w-5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Field label="Background image (optional)" hint="We auto-pick text color">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-4 hover:bg-white/10 transition">
          <span className="flex items-center gap-3 text-sm text-white/80">
            <Upload className="h-4 w-4" />
            {data.bgImage ? "Change background" : "Upload an image"}
          </span>
          {data.bgImage && (
            <span className="text-xs text-[var(--gold)]">Uploaded ✓</span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      </Field>
    </div>
  );
}

function StepStyle({ data, set }: { data: WishData; set: <K extends keyof WishData>(k: K, v: WishData[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="display text-3xl sm:text-4xl text-white mb-1">Style it</h2>
        <p className="text-sm text-white/60">Font and animation for the reveal.</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-white/90">Font</p>
        <div className="grid grid-cols-3 gap-2">
          {FONT_CHOICES.map((f) => (
            <button
              key={f.id}
              onClick={() => set("font", f.id)}
              className={`rounded-xl border px-3 py-4 text-center transition ${
                data.font === f.id
                  ? "border-[var(--gold)] bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:text-white"
              }`}
            >
              <span className={`block text-xl ${f.id === "script" ? "[font-family:'Caveat',cursive]" : f.id === "display" ? "[font-family:var(--font-display)]" : ""}`}>Aa</span>
              <span className="mt-1 block text-[11px] uppercase tracking-wider">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-white/90">Animation</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ANIMATION_STYLES.map((a) => (
            <button
              key={a.id}
              onClick={() => set("animation", a.id)}
              className={`rounded-xl border px-3 py-3 text-sm transition ${
                data.animation === a.id
                  ? "border-[var(--gold)] bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:text-white"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepMusic({ data, set }: { data: WishData; set: <K extends keyof WishData>(k: K, v: WishData[K]) => void }) {
  const presets = PRESET_MUSIC.filter((m) => !m.id || m.festival === "all" || m.festival === data.festival);
  return (
    <div className="space-y-5">
      <div>
        <h2 className="display text-3xl sm:text-4xl text-white mb-1">Add a soundtrack</h2>
        <p className="text-sm text-white/60">Optional — but it makes everything cinematic.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {presets.map((m) => (
          <button
            key={m.id || "none"}
            onClick={() => set("music", m.id)}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
              data.music === m.id
                ? "border-[var(--gold)] bg-white/10 text-white"
                : "border-white/10 bg-white/5 text-white/75 hover:text-white"
            }`}
          >
            <span className="text-sm">{m.name}</span>
            {data.music === m.id && <Check className="h-4 w-4 text-[var(--gold)]" />}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/40">Custom upload coming soon — for now your recipient will tap to play.</p>
    </div>
  );
}

function StepPreview({ data }: { data: WishData }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="display text-3xl sm:text-4xl text-white mb-1">Live preview</h2>
        <p className="text-sm text-white/60">This is what your friends will see.</p>
      </div>
      <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
        <WishStage data={data} preview />
      </div>
    </div>
  );
}

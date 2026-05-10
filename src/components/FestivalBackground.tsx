import { useMemo } from "react";
import { FESTIVALS, type FestivalId } from "@/lib/festivals";

interface Props {
  festival: FestivalId;
  bgImage?: string;
}

export function FestivalBackground({ festival, bgImage }: Props) {
  const theme = FESTIVALS[festival];

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Base gradient or image */}
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: theme.gradient }} />
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0_0_0/0.55)_100%)]" />

      <ParticleLayer kind={theme.particle} />
    </div>
  );
}

function ParticleLayer({ kind }: { kind: string }) {
  switch (kind) {
    case "diya":
      return <DiwaliLayer />;
    case "snow":
      return <SnowLayer />;
    case "color":
      return <HoliLayer />;
    case "stars":
    case "starry":
      return <StarsLayer />;
    case "fireworks":
      return <FireworksLayer />;
    case "tricolor":
      return <TricolorLayer />;
    case "sun":
      return <SunLayer />;
    default:
      return <StarsLayer />;
  }
}

function DiwaliLayer() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 6 + Math.random() * 6,
        size: 3 + Math.random() * 4,
      })),
    [],
  );
  const diyas = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        left: 8 + i * 13 + Math.random() * 4,
        bottom: 4 + Math.random() * 8,
        scale: 0.7 + Math.random() * 0.5,
        delay: Math.random() * 1.2,
      })),
    [],
  );

  return (
    <>
      {/* Floating sparks */}
      {sparks.map((s, i) => (
        <span
          key={i}
          className="particle absolute rounded-full"
          style={{
            left: `${s.left}%`,
            bottom: 0,
            width: s.size,
            height: s.size,
            background: "radial-gradient(circle, oklch(0.95 0.18 80) 0%, oklch(0.78 0.22 60 / 0.6) 60%, transparent 100%)",
            boxShadow: "0 0 12px oklch(0.85 0.2 70 / 0.8)",
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Diyas at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none">
        {diyas.map((d, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${d.left}%`, bottom: `${d.bottom}%`, transform: `scale(${d.scale})` }}
          >
            {/* Flame */}
            <div
              className="flame mx-auto rounded-full"
              style={{
                width: 14,
                height: 22,
                background: "radial-gradient(ellipse at center, oklch(0.98 0.16 95) 0%, oklch(0.82 0.22 60) 50%, oklch(0.55 0.22 30 / 0.4) 100%)",
                boxShadow: "0 0 30px oklch(0.85 0.22 70 / 0.9), 0 0 60px oklch(0.78 0.22 60 / 0.5)",
                animationDelay: `${d.delay}s`,
              }}
            />
            {/* Diya bowl */}
            <div
              className="mt-[-2px] rounded-b-full"
              style={{
                width: 36,
                height: 14,
                background: "linear-gradient(180deg, oklch(0.45 0.1 40), oklch(0.25 0.08 30))",
                boxShadow: "0 4px 12px oklch(0 0 0 / 0.4)",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function SnowLayer() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        dur: 8 + Math.random() * 10,
        size: 3 + Math.random() * 5,
      })),
    [],
  );
  return (
    <>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="particle absolute rounded-full bg-white/80"
          style={{
            left: `${f.left}%`,
            bottom: 0,
            width: f.size,
            height: f.size,
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </>
  );
}

function HoliLayer() {
  const blots = useMemo(
    () =>
      Array.from({ length: 18 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 80 + Math.random() * 220,
        hue: Math.random() * 360,
        delay: Math.random() * 5,
      })),
    [],
  );
  return (
    <>
      {blots.map((b, i) => (
        <div
          key={i}
          className="twinkle absolute rounded-full mix-blend-screen"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, hsl(${b.hue} 90% 65% / 0.6) 0%, transparent 70%)`,
            animationDuration: `${4 + Math.random() * 4}s`,
            animationDelay: `${b.delay}s`,
            filter: "blur(8px)",
          }}
        />
      ))}
    </>
  );
}

function StarsLayer() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
        dur: 2 + Math.random() * 4,
      })),
    [],
  );
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            boxShadow: "0 0 6px white",
          }}
        />
      ))}
      {/* Crescent moon */}
      <div className="absolute top-12 right-12 w-24 h-24 rounded-full"
        style={{
          background: "radial-gradient(circle at 65% 40%, oklch(0.95 0.05 90) 0%, oklch(0.85 0.08 80) 40%, transparent 70%)",
          boxShadow: "0 0 80px oklch(0.85 0.08 80 / 0.6)",
        }}
      />
    </>
  );
}

function FireworksLayer() {
  const bursts = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        left: 10 + Math.random() * 80,
        top: 10 + Math.random() * 50,
        delay: i * 0.8 + Math.random(),
        hue: Math.random() * 360,
      })),
    [],
  );
  return (
    <>
      {bursts.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${b.left}%`, top: `${b.top}%` }}
        >
          {Array.from({ length: 16 }).map((_, j) => {
            const angle = (j / 16) * Math.PI * 2;
            return (
              <span
                key={j}
                className="absolute block rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: `hsl(${b.hue} 90% 65%)`,
                  boxShadow: `0 0 8px hsl(${b.hue} 90% 65%)`,
                  transform: `translate(${Math.cos(angle) * 60}px, ${Math.sin(angle) * 60}px)`,
                  animation: `firework 1.6s ease-out ${b.delay}s infinite`,
                }}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function TricolorLayer() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-1/3 bg-[oklch(0.7_0.18_50)] opacity-90" />
      <div className="absolute inset-x-0 top-1/3 h-1/3 bg-white" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[oklch(0.55_0.18_150)] opacity-90" />
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/10" />
    </>
  );
}

function SunLayer() {
  return (
    <div className="absolute inset-0">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60vmax] h-[60vmax] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.98 0.15 90) 0%, oklch(0.85 0.2 70 / 0.4) 30%, transparent 70%)",
        }}
      />
    </div>
  );
}

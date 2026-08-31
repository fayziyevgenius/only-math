"use client";

import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  oldRank?: string;
  newRank?: string;
  onClose: () => void;
}

const rankInfo: Record<
  string,
  {
    name: string;
    number: string;
    color1: string;
    color2: string;
    glow: string;
  }
> = {
  "🥉 Bronze": {
    name: "BRONZE",
    number: "III",
    color1: "#E09A52",
    color2: "#8B451F",
    glow: "rgba(205, 127, 50, 0.85)",
  },

  "🥈 Silver": {
    name: "SILVER",
    number: "II",
    color1: "#F1F5F9",
    color2: "#64748B",
    glow: "rgba(203, 213, 225, 0.8)",
  },

  "🥇 Gold": {
    name: "GOLD",
    number: "I",
    color1: "#FFE66D",
    color2: "#D97706",
    glow: "rgba(250, 204, 21, 0.9)",
  },

  "💎 Diamond": {
    name: "DIAMOND",
    number: "♦",
    color1: "#A5F3FC",
    color2: "#0891B2",
    glow: "rgba(34, 211, 238, 0.9)",
  },

  "👑 Math Genius": {
    name: "MATH GENIUS",
    number: "♛",
    color1: "#FFF7AE",
    color2: "#EAB308",
    glow: "rgba(250, 204, 21, 1)",
  },
};

export default function RankUpModal({
  open,
  oldRank,
  newRank,
  onClose,
}: Props) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!open) {
      setStarted(false);
      return;
    }

    const timer = setTimeout(() => {
      setStarted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  if (!open || !newRank) return null;

  const rank = rankInfo[newRank] || {
    name: newRank.replace(/[^\w\s]/g, "").toUpperCase(),
    number: "?",
    color1: "#facc15",
    color2: "#a16207",
    glow: "rgba(250, 204, 21, 0.8)",
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden">

      {/* ================================================= */}
      {/* BACKGROUND PARTICLES */}
      {/* ================================================= */}

      <div className="absolute inset-0 pointer-events-none">

        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full bg-yellow-400 transition-all duration-[1800ms] ${
              started
                ? "opacity-80 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              transitionDelay: `${(i % 10) * 80}ms`,
            }}
          />
        ))}

      </div>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <div className="relative w-full max-w-3xl px-6 text-center">

        {/* ================================================= */}
        {/* RANK UP TITLE */}
        {/* ================================================= */}

        <div
          className={`transition-all duration-700 ${
            started
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="text-yellow-400 font-black text-5xl md:text-7xl tracking-[0.15em]">
            RANK UP
          </div>

          <div className="mt-3 text-zinc-400 text-lg md:text-xl">
            You have reached a new rank
          </div>
        </div>

        {/* ================================================= */}
        {/* MEDAL */}
        {/* ================================================= */}

        <div className="relative flex justify-center mt-10">

          {/* Glow */}
          <div
            className={`absolute top-16 w-80 h-80 rounded-full blur-[90px] transition-all duration-1000 ${
              started
                ? "opacity-70 scale-100"
                : "opacity-0 scale-50"
            }`}
            style={{
              background: rank.glow,
            }}
          />

          {/* ================================================= */}
          {/* RIBBON */}
          {/* ================================================= */}

          <div
            className={`absolute top-0 z-10 flex justify-center gap-1 transition-all duration-700 ${
              started
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-32"
            }`}
          >

            {/* Left ribbon */}
            <div
              className="w-12 h-28 md:w-16 md:h-36"
              style={{
                background:
                  "linear-gradient(90deg, #991b1b 0%, #ef4444 35%, #ffffff 36%, #ffffff 62%, #2563eb 63%, #1e3a8a 100%)",
                clipPath:
                  "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
                boxShadow: "0 8px 15px rgba(0,0,0,.4)",
              }}
            />

            {/* Right ribbon */}
            <div
              className="w-12 h-28 md:w-16 md:h-36"
              style={{
                background:
                  "linear-gradient(90deg, #1e3a8a 0%, #2563eb 35%, #ffffff 36%, #ffffff 62%, #ef4444 63%, #991b1b 100%)",
                clipPath:
                  "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
                boxShadow: "0 8px 15px rgba(0,0,0,.4)",
              }}
            />

          </div>

          {/* ================================================= */}
          {/* MEDAL BODY */}
          {/* ================================================= */}

          <div
            className={`
              relative
              z-20
              mt-20
              w-64
              h-64
              md:w-72
              md:h-72
              rounded-full
              flex
              items-center
              justify-center
              transition-all
              duration-[1400ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]
              ${
                started
                  ? "opacity-100 scale-100 rotate-[360deg]"
                  : "opacity-0 scale-0 rotate-[-180deg]"
              }
            `}
            style={{
              background: `
                radial-gradient(
                  circle at 32% 25%,
                  #FFD7A8 0%,
                  ${rank.color1} 15%,
                  ${rank.color1} 45%,
                  ${rank.color2} 82%,
                  #4A2410 100%
                )
              `,
              boxShadow: `
                0 0 25px ${rank.glow},
                0 0 70px ${rank.glow},
                0 0 130px ${rank.glow},
                inset 0 10px 15px rgba(255,255,255,.55),
                inset 0 -15px 25px rgba(0,0,0,.4)
              `,
              border: "10px solid rgba(255,255,255,.22)",
            }}
          >

            {/* Outer ring */}
            <div
              className="absolute inset-4 rounded-full"
              style={{
                border: "5px solid rgba(255,255,255,.28)",
                boxShadow:
                  "inset 0 0 20px rgba(0,0,0,.35)",
              }}
            />

            {/* Inner medal */}
            <div
              className="relative w-44 h-44 md:w-52 md:h-52 rounded-full flex flex-col items-center justify-center"
              style={{
                background: `
                  radial-gradient(
                    circle at 35% 25%,
                    ${rank.color1},
                    ${rank.color2}
                  )
                `,
                border: "5px solid rgba(255,255,255,.3)",
                boxShadow:
                  "inset 0 8px 15px rgba(255,255,255,.35), inset 0 -10px 20px rgba(0,0,0,.35)",
              }}
            >

              {/* Number */}
              <div
                className="text-7xl md:text-8xl font-black text-white leading-none"
                style={{
                  textShadow:
                    "0 5px 8px rgba(0,0,0,.55)",
                }}
              >
                {rank.number}
              </div>

              

              <div className="mt-2 text-white text-lg md:text-xl font-black tracking-[0.25em]">
  {rank.name}
</div>

              {/* Shine */}
              <div
                className={`absolute inset-0 rounded-full overflow-hidden pointer-events-none ${
                  started ? "medal-shine" : ""
                }`}
              >
                <div className="absolute -left-[100%] top-0 w-[45%] h-full bg-white/40 skew-x-[-20deg]" />
              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* RANK NAME */}
        {/* ================================================= */}

        <div
          className={`mt-8 transition-all duration-700 delay-[900ms] ${
            started
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-75"
          }`}
        >

          <div
            className="text-5xl md:text-6xl font-black tracking-wider"
            style={{
              color: rank.color1,
              textShadow: `0 0 25px ${rank.glow}`,
            }}
          >
            {rank.name}
          </div>

          <div className="mt-2 text-zinc-500 text-sm uppercase tracking-[0.35em]">
            NEW RANK
          </div>

        </div>

        {/* ================================================= */}
        {/* CONGRATULATIONS */}
        {/* ================================================= */}

        <div
          className={`mt-8 transition-all duration-700 delay-[1200ms] ${
            started
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >

          <div className="text-2xl md:text-3xl font-bold text-white">
            🎉 Congratulations!
          </div>

          <p className="text-zinc-400 mt-2">
            Keep solving problems to unlock the next rank.
          </p>

        </div>

        {/* ================================================= */}
        {/* CONTINUE */}
        {/* ================================================= */}

        <button
          onClick={onClose}
          className={`
            mt-7
            px-12
            py-4
            rounded-2xl
            bg-yellow-400
            hover:bg-yellow-300
            text-black
            text-xl
            font-black
            transition-all
            duration-500
            hover:scale-105
            active:scale-95
            ${
              started
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }
          `}
        >
          Continue
        </button>

      </div>

      {/* ================================================= */}
      {/* ANIMATION CSS */}
      {/* ================================================= */}

      <style jsx>{`

        @keyframes medalShine {
          0% {
            transform: translateX(-150%);
          }

          100% {
            transform: translateX(350%);
          }
        }

        .medal-shine > div {
          animation: medalShine 1.2s ease-in-out 1.1s forwards;
        }

      `}</style>

    </div>
  );
}
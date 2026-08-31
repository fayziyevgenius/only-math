"use client";

import { useMemo } from "react";

const mathSymbols = ["∑", "π", "√", "x²", "∞", "Δ", "∫", "≈"];

export default function GenesisEffect() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        top: `${5 + Math.random() * 90}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${6 + Math.random() * 8}s`,
        size: `${2 + Math.random() * 4}px`,
      })),
    []
  );

  const symbols = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        symbol: mathSymbols[i],
        left: `${8 + Math.random() * 84}%`,
        top: `${10 + Math.random() * 78}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${10 + Math.random() * 8}s`,
      })),
    []
  );

  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-0
        overflow-hidden
        z-0
      "
      aria-hidden="true"
    >
      {/* Soft Genesis glow */}
      <div
        className="
          absolute
          left-1/2
          top-[48%]
          -translate-x-1/2
          -translate-y-1/2
          w-[280px]
          h-[280px]
          sm:w-[420px]
          sm:h-[420px]
          rounded-full
          bg-green-500/[0.035]
          blur-3xl
          animate-genesis-glow
        "
      />

      {/* Golden center glow */}
      <div
        className="
          absolute
          left-1/2
          top-[48%]
          -translate-x-1/2
          -translate-y-1/2
          w-[120px]
          h-[120px]
          sm:w-[180px]
          sm:h-[180px]
          rounded-full
          bg-yellow-400/[0.025]
          blur-3xl
          animate-genesis-glow-reverse
        "
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="
            absolute
            rounded-full
            bg-green-400
            shadow-[0_0_10px_rgba(34,197,94,0.7)]
            animate-genesis-particle
          "
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}

      {/* Gold particles */}
      {particles.slice(0, 10).map((particle) => (
        <span
          key={`gold-${particle.id}`}
          className="
            absolute
            rounded-full
            bg-yellow-300
            shadow-[0_0_10px_rgba(253,224,71,0.7)]
            animate-genesis-particle
          "
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}

      {/* Floating mathematical symbols */}
      {symbols.map((item) => (
        <span
          key={item.id}
          className="
            absolute
            text-green-400/[0.055]
            font-semibold
            text-2xl
            sm:text-4xl
            select-none
            animate-genesis-symbol
          "
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.symbol}
        </span>
      ))}

      {/* Central Genesis energy ring */}
      <div
        className="
          absolute
          left-1/2
          top-[48%]
          -translate-x-1/2
          -translate-y-1/2
          w-[150px]
          h-[150px]
          sm:w-[220px]
          sm:h-[220px]
          rounded-full
          border
          border-green-400/[0.06]
          animate-genesis-ring
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-[48%]
          -translate-x-1/2
          -translate-y-1/2
          w-[100px]
          h-[100px]
          sm:w-[150px]
          sm:h-[150px]
          rounded-full
          border
          border-yellow-300/[0.045]
          animate-genesis-ring-reverse
        "
      />

      {/* Growing seed / sprout */}
      <div
        className="
          absolute
          left-1/2
          top-[48%]
          -translate-x-1/2
          -translate-y-1/2
          flex
          flex-col
          items-center
          opacity-[0.10]
          animate-genesis-sprout
        "
      >
        {/* Leaves */}
        <div className="relative w-16 h-14 sm:w-20 sm:h-16">
          <div
            className="
              absolute
              left-1/2
              bottom-2
              w-[3px]
              h-9
              sm:h-11
              -translate-x-1/2
              bg-green-400
              rounded-full
            "
          />

          <div
            className="
              absolute
              left-[20%]
              top-3
              w-8
              h-4
              sm:w-10
              sm:h-5
              bg-green-400
              rounded-[100%_0]
              rotate-[25deg]
            "
          />

          <div
            className="
              absolute
              right-[20%]
              top-0
              w-8
              h-4
              sm:w-10
              sm:h-5
              bg-green-300
              rounded-[0_100%]
              -rotate-[25deg]
            "
          />
        </div>

        {/* Seed */}
        <div
          className="
            w-8
            h-5
            sm:w-10
            sm:h-6
            rounded-[50%]
            bg-yellow-300
            shadow-[0_0_25px_rgba(253,224,71,0.7)]
          "
        />
      </div>
    </div>
  );
}
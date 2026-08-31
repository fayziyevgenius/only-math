"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const particles = [
  { left: "8%", top: "18%", delay: "0s", duration: "7s" },
  { left: "18%", top: "72%", delay: "1s", duration: "9s" },
  { left: "28%", top: "32%", delay: "2s", duration: "8s" },
  { left: "42%", top: "82%", delay: "0.5s", duration: "10s" },
  { left: "57%", top: "15%", delay: "3s", duration: "8s" },
  { left: "68%", top: "70%", delay: "1.5s", duration: "9s" },
  { left: "79%", top: "30%", delay: "2.5s", duration: "7s" },
  { left: "91%", top: "78%", delay: "4s", duration: "10s" },
  { left: "86%", top: "52%", delay: "1s", duration: "8s" },
  { left: "12%", top: "45%", delay: "3s", duration: "11s" },
  { left: "50%", top: "55%", delay: "2s", duration: "9s" },
];

const stars = [
  { left: "5%", top: "10%", delay: "0s" },
  { left: "14%", top: "40%", delay: "1.2s" },
  { left: "23%", top: "15%", delay: "2.4s" },
  { left: "34%", top: "65%", delay: "0.8s" },
  { left: "47%", top: "22%", delay: "3s" },
  { left: "61%", top: "78%", delay: "1.5s" },
  { left: "72%", top: "12%", delay: "2.2s" },
  { left: "84%", top: "44%", delay: "0.4s" },
  { left: "94%", top: "18%", delay: "1.8s" },
  { left: "76%", top: "88%", delay: "2.8s" },
];

export default function GenesisPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* ========================================================= */}
      {/* ANIMATED BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main purple glow */}
        <div className="absolute left-1/2 top-[38%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[130px] animate-pulse" />

        {/* Blue glow */}
        <div className="absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px] animate-[float_10s_ease-in-out_infinite]" />

        {/* Pink glow */}
        <div className="absolute -right-32 top-1/2 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[120px] animate-[floatReverse_12s_ease-in-out_infinite]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(circle at center, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 20%, transparent 75%)",
          }}
        />

        {/* Stars */}
        {stars.map((star, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-white animate-[twinkle_3s_ease-in-out_infinite]"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
            }}
          />
        ))}

        {/* Floating particles */}
        {particles.map((particle, index) => (
          <span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-purple-300/70 shadow-[0_0_12px_rgba(168,85,247,0.9)] animate-[particleFloat_8s_ease-in-out_infinite]"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}

        {/* ===================================================== */}
        {/* CENTRAL ORBIT SYSTEM */}
        {/* ===================================================== */}

        <div className="absolute left-1/2 top-[38%] h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 sm:h-[800px] sm:w-[800px]">
          {/* Outer orbit */}
          <div className="absolute inset-0 rounded-full border border-purple-500/10 animate-[spin_35s_linear_infinite]" />

          {/* Second orbit */}
          <div className="absolute inset-[9%] rounded-full border border-purple-400/15 animate-[spinReverse_25s_linear_infinite]" />

          {/* Third orbit */}
          <div className="absolute inset-[18%] rounded-full border border-blue-400/10 animate-[spin_18s_linear_infinite]" />

          {/* Fourth orbit */}
          <div className="absolute inset-[27%] rounded-full border border-fuchsia-400/10 animate-[spinReverse_14s_linear_infinite]" />

          {/* Orbiting objects */}
          <div className="absolute inset-0 animate-[spin_35s_linear_infinite]">
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-purple-400 shadow-[0_0_25px_rgba(168,85,247,1)]" />
          </div>

          <div className="absolute inset-[9%] animate-[spinReverse_25s_linear_infinite]">
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,1)]" />
          </div>

          <div className="absolute inset-[18%] animate-[spin_18s_linear_infinite]">
            <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,1)]" />
          </div>
        </div>

        {/* Central energy rings */}
        <div className="absolute left-1/2 top-[38%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/10 animate-[pulseRing_4s_ease-out_infinite]" />

        <div className="absolute left-1/2 top-[38%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/10 animate-[pulseRing_4s_ease-out_1s_infinite]" />
      </div>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-10 sm:px-8 sm:py-14">
        {/* Top navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/afterregister"
            className="rounded-full border border-zinc-700 bg-black/40 px-5 py-2.5 text-sm font-semibold text-zinc-300 backdrop-blur-md transition hover:border-purple-400 hover:text-white"
          >
            ← Dashboard
          </Link>

          <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-300 backdrop-blur-md">
            Only Math
          </div>
        </div>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          {/* Animated Genesis symbol */}
          <div className="relative mb-8 flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
            <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />

            <div className="absolute inset-2 rounded-full border border-purple-400/30 animate-[spin_8s_linear_infinite]" />

            <div className="absolute inset-5 rounded-full border border-dashed border-blue-400/30 animate-[spinReverse_12s_linear_infinite]" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-purple-400/40 bg-black/80 shadow-[0_0_50px_rgba(168,85,247,0.35)] sm:h-24 sm:w-24">
              <span className="text-4xl sm:text-5xl">✦</span>
            </div>
          </div>

          <p
            className={`mb-3 text-sm font-bold uppercase tracking-[0.35em] text-purple-400 transition-all duration-1000 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            Only Math
          </p>

          <h1
            className={`text-5xl font-black tracking-tight sm:text-7xl md:text-8xl transition-all duration-1000 delay-200 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-500 bg-clip-text text-transparent">
              Genesis
            </span>
          </h1>

          <p
            className={`mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg transition-all duration-1000 delay-300 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            The beginning of a new journey. Every challenge, every training
            session and every achievement becomes part of your progress.
          </p>

          {/* Cycle card */}
          <div
            className={`mt-10 w-full max-w-2xl rounded-3xl border border-purple-500/20 bg-zinc-950/60 p-6 shadow-2xl backdrop-blur-xl transition-all duration-1000 delay-500 sm:p-8 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Current Cycle
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  Genesis Cycle
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  17 August — 30 August
                </p>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                <span className="text-4xl">🌌</span>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div
            className={`mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 transition-all duration-1000 delay-700 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <CycleCard icon="🎯" title="SAT" />
            <CycleCard icon="🏆" title="Olympiad" />
            <CycleCard icon="📜" title="Certificate" />
            <CycleCard icon="⚡" title="Math Sprint" />
            <CycleCard icon="📚" title="Training" />
          </div>
        </section>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(80px, -50px);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-70px, 60px);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            opacity: 0.2;
            transform: translateY(0) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateY(-35px) scale(1.3);
          }
        }

        @keyframes pulseRing {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
          }
          40% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

function CycleCard({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-black/40 p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-purple-500/5">
      <div className="text-3xl transition duration-300 group-hover:scale-110">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-zinc-300 group-hover:text-white">
        {title}
      </p>
    </div>
  );
}
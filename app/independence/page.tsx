"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const floatingLights = [
  { left: "7%", top: "18%", delay: "0s", duration: "9s", size: 4 },
  { left: "14%", top: "72%", delay: "2s", duration: "11s", size: 3 },
  { left: "23%", top: "31%", delay: "1s", duration: "8s", size: 5 },
  { left: "32%", top: "84%", delay: "3s", duration: "12s", size: 3 },
  { left: "43%", top: "14%", delay: "1.5s", duration: "10s", size: 4 },
  { left: "56%", top: "78%", delay: "4s", duration: "9s", size: 3 },
  { left: "66%", top: "24%", delay: "2s", duration: "11s", size: 4 },
  { left: "76%", top: "67%", delay: "0.5s", duration: "8s", size: 5 },
  { left: "87%", top: "35%", delay: "3s", duration: "10s", size: 3 },
  { left: "93%", top: "82%", delay: "1s", duration: "12s", size: 4 },
];

const stars = [
  { left: "8%", top: "12%", delay: "0s", size: 2 },
  { left: "18%", top: "25%", delay: "1.5s", size: 3 },
  { left: "29%", top: "9%", delay: "2.2s", size: 2 },
  { left: "38%", top: "21%", delay: "0.8s", size: 2 },
  { left: "51%", top: "11%", delay: "3s", size: 3 },
  { left: "64%", top: "17%", delay: "1.1s", size: 2 },
  { left: "78%", top: "10%", delay: "2.4s", size: 2 },
  { left: "89%", top: "23%", delay: "0.5s", size: 3 },
  { left: "12%", top: "55%", delay: "2.8s", size: 2 },
  { left: "84%", top: "58%", delay: "1.7s", size: 2 },
];

export default function IndependencePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020504] text-white">
      {/* ========================================================= */}
      {/* BACKGROUND                                               */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blue atmosphere */}
        <div className="absolute -left-[220px] top-[10%] h-[620px] w-[620px] rounded-full bg-[#1EB4E8]/[0.055] blur-[150px] animate-[atmosphereLeft_14s_ease-in-out_infinite]" />

        {/* Green atmosphere */}
        <div className="absolute -right-[200px] top-[35%] h-[650px] w-[650px] rounded-full bg-[#1EB53A]/[0.06] blur-[160px] animate-[atmosphereRight_16s_ease-in-out_infinite]" />

        {/* Red atmosphere */}
        <div className="absolute bottom-[-350px] left-1/2 h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-[#CE1126]/[0.035] blur-[180px]" />

        {/* Central soft light */}
        <div className="absolute left-1/2 top-[38%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[130px] animate-[centralBreath_7s_ease-in-out_infinite]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 70%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 70%, transparent)",
          }}
        />

        {/* Stars */}
        {stars.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white animate-[starPulse_4s_ease-in-out_infinite]"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
          />
        ))}

        {/* Floating national lights */}
        {floatingLights.map((light, index) => {
          const type = index % 4;

          let colorClass = "bg-white";
          let shadow = "0 0 14px rgba(255,255,255,.7)";

          if (type === 0) {
            colorClass = "bg-[#1EB4E8]";
            shadow = "0 0 16px rgba(30,180,232,.7)";
          }

          if (type === 1) {
            colorClass = "bg-[#1EB53A]";
            shadow = "0 0 16px rgba(30,181,58,.7)";
          }

          if (type === 2) {
            colorClass = "bg-[#CE1126]";
            shadow = "0 0 16px rgba(206,17,38,.7)";
          }

          return (
            <span
              key={index}
              className={`absolute rounded-full ${colorClass} animate-[lightFloat_10s_ease-in-out_infinite]`}
              style={{
                left: light.left,
                top: light.top,
                width: `${light.size}px`,
                height: `${light.size}px`,
                animationDelay: light.delay,
                animationDuration: light.duration,
                boxShadow: shadow,
              }}
            />
          );
        })}

        {/* Horizontal light lines */}
        <div className="absolute left-0 right-0 top-[27%] h-px bg-gradient-to-r from-transparent via-[#1EB4E8]/10 to-transparent" />

        <div className="absolute left-0 right-0 top-[70%] h-px bg-gradient-to-r from-transparent via-[#1EB53A]/10 to-transparent" />

        {/* Bottom national colors */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1EB4E8]/0 via-[#1EB4E8]/60 to-[#CE1126]/0 opacity-50" />

        <div className="absolute bottom-[2px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="absolute bottom-[3px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#CE1126]/0 via-[#1EB53A]/60 to-transparent opacity-50" />
      </div>

      {/* ========================================================= */}
      {/* CONTENT                                                   */}
      {/* ========================================================= */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        {/* ===================================================== */}
        {/* NAVIGATION                                             */}
        {/* ===================================================== */}

        <header
          className={`flex items-center justify-between transition-all duration-1000 ${
            mounted
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <Link
            href="/afterregister"
            className="group flex items-center gap-2 rounded-full border border-white/[0.09] bg-black/30 px-5 py-2.5 text-sm font-medium text-zinc-400 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.35em] text-zinc-600 sm:block">
              Cycle 02
            </span>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1EB53A] shadow-[0_0_10px_rgba(30,181,58,.8)]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
                Only Math
              </span>
            </div>
          </div>
        </header>

        {/* ===================================================== */}
        {/* HERO                                                    */}
        {/* ===================================================== */}

        <section className="flex flex-1 flex-col items-center justify-center py-14 text-center sm:py-20">
          {/* Top label */}
          <div
            className={`mb-8 flex items-center gap-4 transition-all duration-1000 delay-200 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#1EB4E8]/60 sm:w-16" />

            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-zinc-500 sm:text-xs">
              The Spirit of Freedom
            </p>

            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#1EB53A]/60 sm:w-16" />
          </div>

          {/* ================================================= */}
          {/* UZBEKISTAN FLAG                                     */}
          {/* ================================================= */}

          <div
            className={`relative mb-10 transition-all duration-[1400ms] delay-300 ${
              mounted
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-8 scale-95 opacity-0"
            }`}
          >
            {/* Ambient glow */}
            <div className="absolute left-1/2 top-1/2 h-52 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.06] blur-[70px] sm:h-64 sm:w-96" />

            <div className="absolute left-1/2 top-1/2 h-36 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-[45px] sm:h-44 sm:w-72" />

            {/* Flag */}
            <div className="relative h-[115px] w-[192px] animate-[flagWave_5s_ease-in-out_infinite] sm:h-[145px] sm:w-[242px]">
              <svg
                viewBox="0 0 242 145"
                className="h-full w-full overflow-visible"
                aria-label="Uzbekistan flag"
                role="img"
              >
                <defs>
                  {/* Blue */}
                  <linearGradient
                    id="uzBlue"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#1599C8" />
                    <stop offset="45%" stopColor="#1EB4E8" />
                    <stop offset="100%" stopColor="#168FB9" />
                  </linearGradient>

                  {/* Green */}
                  <linearGradient
                    id="uzGreen"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#168F31" />
                    <stop offset="45%" stopColor="#1EB53A" />
                    <stop offset="100%" stopColor="#14872D" />
                  </linearGradient>

                  {/* Fabric light */}
                  <linearGradient
                    id="fabricLight"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="#000000"
                      stopOpacity="0.20"
                    />

                    <stop
                      offset="20%"
                      stopColor="#ffffff"
                      stopOpacity="0.02"
                    />

                    <stop
                      offset="50%"
                      stopColor="#ffffff"
                      stopOpacity="0.12"
                    />

                    <stop
                      offset="80%"
                      stopColor="#000000"
                      stopOpacity="0.02"
                    />

                    <stop
                      offset="100%"
                      stopColor="#000000"
                      stopOpacity="0.18"
                    />
                  </linearGradient>

                  {/* Flag shadow */}
                  <filter
                    id="flagShadow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="180%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="16"
                      stdDeviation="14"
                      floodColor="#000000"
                      floodOpacity="0.65"
                    />
                  </filter>

                  {/* Flag shape */}
                  <clipPath id="flagShape">
                    <path
                      d="
                        M3 2
                        C28 8 42 -4 66 3
                        C92 11 105 -5 132 3
                        C159 11 175 -4 199 3
                        C215 8 229 1 239 4
                        L239 141
                        C215 136 201 147 178 140
                        C152 133 133 149 107 141
                        C80 133 61 148 37 141
                        C22 136 11 142 3 139
                        Z
                      "
                    />
                  </clipPath>
                </defs>

                <g filter="url(#flagShadow)">
                  <g clipPath="url(#flagShape)">
                    {/* BLUE */}
                    <rect
                      x="0"
                      y="0"
                      width="242"
                      height="49"
                      fill="url(#uzBlue)"
                    />

                    {/* RED */}
                    <rect
                      x="0"
                      y="47"
                      width="242"
                      height="4"
                      fill="#CE1126"
                    />

                    {/* WHITE */}
                    <rect
                      x="0"
                      y="51"
                      width="242"
                      height="43"
                      fill="#FFFFFF"
                    />

                    {/* RED */}
                    <rect
                      x="0"
                      y="94"
                      width="242"
                      height="4"
                      fill="#CE1126"
                    />

                    {/* GREEN */}
                    <rect
                      x="0"
                      y="98"
                      width="242"
                      height="47"
                      fill="url(#uzGreen)"
                    />

                    {/* Fabric lighting */}
                    <rect
                      x="0"
                      y="0"
                      width="242"
                      height="145"
                      fill="url(#fabricLight)"
                    />

                    {/* Fabric folds */}
                    <path
                      d="M30 0 C20 35 40 75 25 145"
                      fill="none"
                      stroke="black"
                      strokeOpacity="0.08"
                      strokeWidth="10"
                    />

                    <path
                      d="M78 0 C92 40 67 80 88 145"
                      fill="none"
                      stroke="white"
                      strokeOpacity="0.055"
                      strokeWidth="12"
                    />

                    <path
                      d="M140 0 C126 45 153 85 134 145"
                      fill="none"
                      stroke="black"
                      strokeOpacity="0.07"
                      strokeWidth="11"
                    />

                    <path
                      d="M196 0 C182 42 208 91 191 145"
                      fill="none"
                      stroke="white"
                      strokeOpacity="0.045"
                      strokeWidth="10"
                    />

                    {/* ================================================= */}
                    {/* CRESCENT */}
                    {/* ================================================= */}

                    <circle
                      cx="31"
                      cy="25"
                      r="14"
                      fill="white"
                    />

                    <circle
                      cx="37"
                      cy="20"
                      r="12"
                      fill="#1EB4E8"
                    />

                    {/* ================================================= */}
                    {/* 12 STARS — 3 / 4 / 5 */}
                    {/* ================================================= */}

                    <g fill="white">
                      {/* TOP ROW — 3 */}

                      <path d="M57 8 L58.7 12.7 L63.7 12.9 L59.8 15.9 L61.1 20.7 L57 18 L52.9 20.7 L54.2 15.9 L50.3 12.9 L55.3 12.7 Z" />

                      <path d="M69 8 L70.7 12.7 L75.7 12.9 L71.8 15.9 L73.1 20.7 L69 18 L64.9 20.7 L66.2 15.9 L62.3 12.9 L67.3 12.7 Z" />

                      <path d="M81 8 L82.7 12.7 L87.7 12.9 L83.8 15.9 L85.1 20.7 L81 18 L76.9 20.7 L78.2 15.9 L74.3 12.9 L79.3 12.7 Z" />

                      {/* MIDDLE ROW — 4 */}

                      <path d="M51 21 L52.7 25.7 L57.7 25.9 L53.8 28.9 L55.1 33.7 L51 31 L46.9 33.7 L48.2 28.9 L44.3 25.9 L49.3 25.7 Z" />

                      <path d="M63 21 L64.7 25.7 L69.7 25.9 L65.8 28.9 L67.1 33.7 L63 31 L58.9 33.7 L60.2 28.9 L56.3 25.9 L61.3 25.7 Z" />

                      <path d="M75 21 L76.7 25.7 L81.7 25.9 L77.8 28.9 L79.1 33.7 L75 31 L70.9 33.7 L72.2 28.9 L68.3 25.9 L73.3 25.7 Z" />

                      <path d="M87 21 L88.7 25.7 L93.7 25.9 L89.8 28.9 L91.1 33.7 L87 31 L82.9 33.7 L84.2 28.9 L80.3 25.9 L85.3 25.7 Z" />

                      {/* BOTTOM ROW — 5 */}

                      <path d="M45 34 L46.7 38.7 L51.7 38.9 L47.8 41.9 L49.1 46.7 L45 44 L40.9 46.7 L42.2 41.9 L38.3 38.9 L43.3 38.7 Z" />

                      <path d="M55 34 L56.7 38.7 L61.7 38.9 L57.8 41.9 L59.1 46.7 L55 44 L50.9 46.7 L52.2 41.9 L48.3 38.9 L53.3 38.7 Z" />

                      <path d="M65 34 L66.7 38.7 L71.7 38.9 L67.8 41.9 L69.1 46.7 L65 44 L60.9 46.7 L62.2 41.9 L58.3 38.9 L63.3 38.7 Z" />

                      <path d="M75 34 L76.7 38.7 L81.7 38.9 L77.8 41.9 L79.1 46.7 L75 44 L70.9 46.7 L72.2 41.9 L68.3 38.9 L73.3 38.7 Z" />

                      <path d="M85 34 L86.7 38.7 L91.7 38.9 L87.8 41.9 L89.1 46.7 L85 44 L80.9 46.7 L82.2 41.9 L78.3 38.9 L83.3 38.7 Z" />
                    </g>

                    {/* ================================================= */}
                    {/* MOVING LIGHT REFLECTION */}
                    {/* ================================================= */}

                    <rect
                      x="-80"
                      y="0"
                      width="45"
                      height="145"
                      fill="white"
                      opacity="0.13"
                      transform="skewX(-16)"
                      className="animate-[flagReflection_5s_ease-in-out_infinite]"
                    />
                  </g>
                </g>
              </svg>
            </div>

            {/* Small light under flag */}
            <div className="absolute -bottom-5 left-1/2 h-px w-28 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* ===================================================== */}
          {/* DATE                                                     */}
          {/* ===================================================== */}

          <div
            className={`mb-3 flex items-center gap-3 transition-all duration-1000 delay-500 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#1EB4E8]/80">
              31
            </span>

            <span className="h-1 w-1 rounded-full bg-[#CE1126]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">
              August
            </span>

            <span className="h-1 w-1 rounded-full bg-[#1EB53A]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#1EB53A]/80">
              2026
            </span>
          </div>

          {/* ===================================================== */}
          {/* MAIN TITLE                                             */}
          {/* ===================================================== */}

          <h1
            className={`relative text-[clamp(3.4rem,11vw,9rem)] font-black leading-[0.82] tracking-[-0.055em] transition-all duration-[1300ms] delay-500 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <span className="block bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
              INDEPENDENCE
            </span>
          </h1>

          {/* Decorative separator */}
          <div
            className={`mt-7 flex items-center gap-3 transition-all duration-1000 delay-600 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#1EB4E8]/50" />

            <div className="h-1 w-1 rounded-full bg-[#CE1126]" />

            <div className="h-px w-16 bg-white/10" />

            <div className="h-1 w-1 rounded-full bg-[#1EB53A]" />

            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#1EB53A]/50" />
          </div>

          {/* ===================================================== */}
          {/* DESCRIPTION                                            */}
          {/* ===================================================== */}

          <div
            className={`mt-7 max-w-xl transition-all duration-1000 delay-700 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <p className="text-sm leading-6 text-zinc-500 sm:text-base sm:leading-7">
              Freedom is not the end of the journey.
              <br className="hidden sm:block" />
              It is the space where your potential begins.
            </p>
          </div>

          {/* ===================================================== */}
          {/* CYCLE INFORMATION                                      */}
          {/* ===================================================== */}

          <div
            className={`mt-10 transition-all duration-1000 delay-[800ms] ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-2xl">
              {/* National color line */}
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-[#1EB4E8] via-white to-[#1EB53A]" />

              <div className="flex flex-col items-center gap-5 px-7 py-5 sm:flex-row sm:gap-10 sm:px-9">
                {/* Current cycle */}
                <div className="text-center sm:text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                    Current Cycle
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-zinc-200">
                    Independence Cycle
                  </p>
                </div>

                <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />

                {/* Duration */}
                <div className="text-center sm:text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                    Duration
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-zinc-400">
                    31 August — 13 September
                  </p>
                </div>

                <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />

                {/* Active */}
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#1EB53A] shadow-[0_0_12px_rgba(30,181,58,.8)]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1EB53A]">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* SECTIONS                                               */}
          {/* ===================================================== */}

          <div
            className={`mt-8 grid w-full max-w-5xl grid-cols-2 gap-3 transition-all duration-1000 delay-[1000ms] sm:grid-cols-5 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <CycleCard
              icon="🎯"
              title="SAT"
              accent="blue"
            />

            <CycleCard
              icon="🏆"
              title="Olympiad"
              accent="green"
            />

            <CycleCard
              icon="📜"
              title="Certificate"
              accent="red"
            />

            <CycleCard
              icon="⚡"
              title="Math Sprint"
              accent="white"
            />

            <CycleCard
              icon="📚"
              title="Training"
              accent="green"
            />
          </div>

          {/* ===================================================== */}
          {/* BOTTOM MESSAGE                                         */}
          {/* ===================================================== */}

          <div
            className={`mt-10 flex items-center gap-3 transition-all duration-1000 delay-[1100ms] ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="h-px w-8 bg-zinc-800" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-zinc-700">
              Learn without limits
            </span>

            <span className="h-px w-8 bg-zinc-800" />
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* ANIMATIONS                                                */}
      {/* ========================================================= */}

      <style jsx global>{`
        /* ======================================================= */
        /* FLAG WAVE                                                */
        /* ======================================================= */

        @keyframes flagWave {
          0%,
          100% {
            transform:
              perspective(900px)
              rotateY(0deg)
              rotateZ(0deg)
              skewY(0deg)
              scaleX(1);
          }

          15% {
            transform:
              perspective(900px)
              rotateY(-3deg)
              rotateZ(0.5deg)
              skewY(0.7deg)
              scaleX(0.99);
          }

          35% {
            transform:
              perspective(900px)
              rotateY(5deg)
              rotateZ(-0.6deg)
              skewY(-1deg)
              scaleX(0.985);
          }

          55% {
            transform:
              perspective(900px)
              rotateY(-6deg)
              rotateZ(0.7deg)
              skewY(1.1deg)
              scaleX(0.99);
          }

          75% {
            transform:
              perspective(900px)
              rotateY(4deg)
              rotateZ(-0.4deg)
              skewY(-0.7deg)
              scaleX(0.995);
          }
        }

        /* ======================================================= */
        /* FLAG LIGHT                                                */
        /* ======================================================= */

        @keyframes flagReflection {
          0% {
            transform: translateX(-100px) skewX(-16deg);
            opacity: 0;
          }

          18% {
            opacity: 0.12;
          }

          45% {
            opacity: 0.08;
          }

          65%,
          100% {
            transform: translateX(350px) skewX(-16deg);
            opacity: 0;
          }
        }

        /* ======================================================= */
        /* BACKGROUND ATMOSPHERE                                     */
        /* ======================================================= */

        @keyframes atmosphereLeft {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(90px, 45px, 0);
          }
        }

        @keyframes atmosphereRight {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-80px, -55px, 0);
          }
        }

        @keyframes centralBreath {
          0%,
          100% {
            opacity: 0.55;
            transform: translate(-50%, -50%) scale(0.95);
          }

          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        /* ======================================================= */
        /* STARS                                                     */
        /* ======================================================= */

        @keyframes starPulse {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.7);
          }

          50% {
            opacity: 0.8;
            transform: scale(1.3);
          }
        }

        /* ======================================================= */
        /* FLOATING LIGHTS                                           */
        /* ======================================================= */

        @keyframes lightFloat {
          0%,
          100% {
            opacity: 0.15;
            transform: translate3d(0, 0, 0) scale(0.8);
          }

          30% {
            opacity: 0.7;
          }

          50% {
            opacity: 1;
            transform: translate3d(18px, -35px, 0) scale(1.15);
          }

          75% {
            opacity: 0.35;
            transform: translate3d(-10px, -65px, 0) scale(0.9);
          }
        }

        /* ======================================================= */
        /* REDUCED MOTION                                            */
        /* ======================================================= */

        @media (max-width: 640px) {
          @keyframes flagWave {
            0%,
            100% {
              transform:
                perspective(700px)
                rotateY(0deg)
                rotateZ(0deg)
                skewY(0deg)
                scaleX(1);
            }

            30% {
              transform:
                perspective(700px)
                rotateY(4deg)
                rotateZ(-0.5deg)
                skewY(-1deg)
                scaleX(0.985);
            }

            60% {
              transform:
                perspective(700px)
                rotateY(-5deg)
                rotateZ(0.5deg)
                skewY(1deg)
                scaleX(0.99);
            }
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

/* ============================================================= */
/* CYCLE CARD                                                    */
/* ============================================================= */

function CycleCard({
  icon,
  title,
  accent,
}: {
  icon: string;
  title: string;
  accent: "blue" | "green" | "red" | "white";
}) {
  const accentStyles = {
    blue: {
      line: "via-[#1EB4E8]/70",
      border: "hover:border-[#1EB4E8]/25",
      glow: "group-hover:bg-[#1EB4E8]/[0.035]",
    },

    green: {
      line: "via-[#1EB53A]/70",
      border: "hover:border-[#1EB53A]/25",
      glow: "group-hover:bg-[#1EB53A]/[0.035]",
    },

    red: {
      line: "via-[#CE1126]/70",
      border: "hover:border-[#CE1126]/25",
      glow: "group-hover:bg-[#CE1126]/[0.035]",
    },

    white: {
      line: "via-white/50",
      border: "hover:border-white/20",
      glow: "group-hover:bg-white/[0.025]",
    },
  };

  const style = accentStyles[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018] px-4 py-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${style.border} ${style.glow}`}
    >
      {/* Hover accent */}
      <div
        className={`absolute left-1/2 top-0 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent ${style.line} to-transparent transition-all duration-500 group-hover:w-2/3`}
      />

      {/* Icon */}
      <div className="text-2xl grayscale-[0.2] transition-all duration-300 group-hover:scale-110 group-hover:grayscale-0">
        {icon}
      </div>

      {/* Title */}
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-200">
        {title}
      </p>
    </div>
  );
}
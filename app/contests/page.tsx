"use client";

import Link from "next/link";

export default function ContestsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20">

      <section className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950">

        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative px-6 py-16 sm:px-10 sm:py-20 text-center">

          <div className="mx-auto w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-4xl">
            🏆
          </div>

          <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-green-400">
            Only Math Contests
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Something big is coming.
          </h1>

          <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg leading-8 text-zinc-400">
            We are preparing a new contest system for the Only Math
            community. Solve challenging problems, compete with other
            students and fight for the top of the leaderboard.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">

            <div className="px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-bold">
                Status
              </p>

              <p className="mt-1 text-lg font-black text-yellow-400">
                Coming Soon
              </p>
            </div>

            <div className="px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-bold">
                Platform
              </p>

              <p className="mt-1 text-lg font-black text-white">
                Only Math
              </p>
            </div>

          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">

            <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
              <div className="text-2xl">🧠</div>

              <h3 className="mt-3 font-black text-white">
                Challenging Problems
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Problems designed to test real mathematical thinking.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
              <div className="text-2xl">⚡</div>

              <h3 className="mt-3 font-black text-white">
                Competition
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Compete with other students and climb the rankings.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
              <div className="text-2xl">🏅</div>

              <h3 className="mt-3 font-black text-white">
                Rewards
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Special recognition and rewards for top performers.
              </p>
            </div>

          </div>

          <Link
            href="/"
            className="inline-flex mt-10 px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black transition"
          >
            ← Back to Only Math
          </Link>

        </div>

      </section>

    </div>
  );
}
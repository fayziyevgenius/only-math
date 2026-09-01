"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Crown,
  Flame,
  CalendarDays,
  ArrowRight,
  Star,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type LeaderboardUser = {
  username: string;
  name: string;
  surname: string;
  geniusPoints: number;
  avatar?: string;
};

type CycleData = {
  cycle: number;
  name: string;
  startDate: string;
  endDate: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const CURRENT_CYCLE: CycleData = {
  cycle: 2,
  name: "Independence Cycle",
  startDate: "August 31, 2026",
  endDate: "September 13, 2026",
};

const avatarImages: Record<string, string> = {
  "only-math": "/logo.png",

  "genesis-cycle":
    "/avatars/genesis-cycle.png",

  "independence-cycle":
    "/avatars/independence-cycle.png",

  "daily-7":
    "/avatars/daily-7.png",

  "solve-question":
    "/avatars/solve-question.png",

  "sprint-60":
    "/avatars/sprint-60.png",

  "perfect-trio":
    "/avatars/perfect-trio.png",

  "top-3":
    "/avatars/top-3.png",
};

/* =========================================================
   AVATAR
========================================================= */

function getAvatarImage(
  avatar?: string
): string {
  if (!avatar) {
    return "/logo.png";
  }

  if (avatarImages[avatar]) {
    return avatarImages[avatar];
  }

  if (avatar.startsWith("/")) {
    return avatar;
  }

  return "/logo.png";
}

/* =========================================================
   DATE HELPERS
========================================================= */

function getDaysRemaining(): number {
  const end = new Date(
    "2026-09-13T23:59:59+05:00"
  );

  const now = new Date();

  const difference =
    end.getTime() - now.getTime();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function IndependenceCyclePage() {
  const [users, setUsers] = useState<
    LeaderboardUser[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [daysRemaining, setDaysRemaining] =
    useState(getDaysRemaining());

  /* =======================================================
     LOAD LEADERBOARD
  ======================================================= */

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(
          "/api/leaderboard",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load leaderboard."
          );
        }

        const data =
          await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (error) {
        console.error(
          "Independence Cycle leaderboard error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  /* =======================================================
     UPDATE DAYS
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysRemaining(
        getDaysRemaining()
      );
    }, 60 * 1000);

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     TOP USERS
  ======================================================= */

  const first = users[0];
  const second = users[1];
  const third = users[2];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        {/* DARK BACKGROUND */}
        <div className="absolute inset-0 bg-black" />

        {/* BLUE GLOW */}
        <div
          className="
            absolute
            top-[-20%]
            left-[-10%]
            w-[55vw]
            h-[55vw]
            rounded-full
            bg-blue-700/10
            blur-[120px]
          "
        />

        {/* GREEN GLOW */}
        <div
          className="
            absolute
            bottom-[-20%]
            right-[-10%]
            w-[55vw]
            h-[55vw]
            rounded-full
            bg-green-600/10
            blur-[120px]
          "
        />

        {/* RED GLOW */}
        <div
          className="
            absolute
            top-[35%]
            right-[20%]
            w-[30vw]
            h-[30vw]
            rounded-full
            bg-red-600/5
            blur-[120px]
          "
        />

        {/* =================================================
            ROTATING FLAGS
        ================================================= */}

        <div
          className="
            absolute
            top-[-180px]
            left-1/2
            -translate-x-1/2
            w-[850px]
            h-[850px]
            rounded-full
            animate-[spin_45s_linear_infinite]
            opacity-[0.12]
          "
        >

          {/* BLUE */}
          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-20
              h-44
              bg-blue-500
              rounded-b-3xl
              shadow-[0_0_80px_rgba(59,130,246,0.6)]
            "
          />

          {/* WHITE */}
          <div
            className="
              absolute
              top-1/2
              left-0
              -translate-y-1/2
              w-44
              h-20
              bg-white
              rounded-r-3xl
              shadow-[0_0_80px_rgba(255,255,255,0.4)]
            "
          />

          {/* GREEN */}
          <div
            className="
              absolute
              bottom-0
              left-1/2
              -translate-x-1/2
              w-20
              h-44
              bg-green-500
              rounded-t-3xl
              shadow-[0_0_80px_rgba(34,197,94,0.6)]
            "
          />

          {/* RED */}
          <div
            className="
              absolute
              top-1/2
              right-0
              -translate-y-1/2
              w-44
              h-20
              bg-red-500
              rounded-l-3xl
              shadow-[0_0_80px_rgba(239,68,68,0.5)]
            "
          />

        </div>

        {/* SECOND ROTATING RING */}

        <div
          className="
            absolute
            top-[5%]
            left-1/2
            -translate-x-1/2
            w-[600px]
            h-[600px]
            rounded-full
            border
            border-blue-500/10
            animate-[spin_35s_linear_infinite_reverse]
          "
        />

        {/* THIRD RING */}

        <div
          className="
            absolute
            top-[12%]
            left-1/2
            -translate-x-1/2
            w-[450px]
            h-[450px]
            rounded-full
            border
            border-green-500/10
            animate-[spin_25s_linear_infinite]
          "
        />

        {/* =================================================
            FLOATING FLAG PARTICLES
        ================================================= */}

        <div
          className="
            absolute
            top-[12%]
            left-[8%]
            text-5xl
            opacity-20
            animate-pulse
          "
        >
          🇺🇿
        </div>

        <div
          className="
            absolute
            top-[24%]
            right-[8%]
            text-4xl
            opacity-15
            animate-pulse
          "
        >
          🇺🇿
        </div>

        <div
          className="
            absolute
            bottom-[18%]
            left-[12%]
            text-4xl
            opacity-15
            animate-pulse
          "
        >
          🇺🇿
        </div>

        <div
          className="
            absolute
            bottom-[12%]
            right-[12%]
            text-5xl
            opacity-20
            animate-pulse
          "
        >
          🇺🇿
        </div>

        {/* GRID */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            bg-[size:50px_50px]
          "
        />

      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div
        className="
          relative
          z-10
          max-w-6xl
          mx-auto
          px-4
          py-8
          md:py-12
        "
      >

        {/* =================================================
            TOP NAV
        ================================================= */}

        <div className="flex items-center justify-between mb-10">

          <Link
            href="/"
            className="
              text-zinc-400
              hover:text-white
              transition
              font-medium
            "
          >
            ← Only Math
          </Link>

          <div
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              border
              border-blue-500/20
              bg-zinc-950/70
              backdrop-blur-xl
            "
          >
            <span className="text-lg">
              🇺🇿
            </span>

            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
              Cycle 02
            </span>
          </div>

        </div>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="text-center">

          {/* SMALL LABEL */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              border
              border-green-500/20
              bg-green-500/5
              backdrop-blur-xl
              mb-7
            "
          >
            <span
              className="
                w-2
                h-2
                rounded-full
                bg-green-400
                animate-pulse
              "
            />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-green-400">
              Independence Season
            </span>
          </div>

          {/* =================================================
              FLAG
          ================================================= */}

          <div className="relative flex justify-center mb-8">

            {/* OUTER RING */}

            <div
              className="
                absolute
                w-64
                h-64
                md:w-80
                md:h-80
                rounded-full
                border
                border-blue-500/10
                animate-[spin_20s_linear_infinite]
              "
            />

            {/* SECOND RING */}

            <div
              className="
                absolute
                w-56
                h-56
                md:w-72
                md:h-72
                rounded-full
                border
                border-green-500/10
                animate-[spin_15s_linear_infinite_reverse]
              "
            />

            {/* FLAG CONTAINER */}

            <div
              className="
                relative
                w-48
                h-36
                md:w-64
                md:h-48
                flex
                items-center
                justify-center
              "
            >

              {/* GLOW */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-blue-500/10
                  blur-3xl
                "
              />

              {/* WAVING FLAG */}

              <div
                className="
                  relative
                  w-full
                  h-full
                  overflow-hidden
                  rounded-xl
                  shadow-[0_0_60px_rgba(37,99,235,0.25)]
                  animate-[wave_4s_ease-in-out_infinite]
                "
              >

                {/* FLAG IMAGE */}

                <img
                  src="/uzbekistan-flag.png"
                  alt="Uzbekistan Flag"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />

                {/* FALLBACK FLAG */}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    flex-col
                    bg-blue-600
                  "
                >

                  <div className="h-1/3 bg-blue-600" />

                  <div className="h-[2px] bg-red-500" />

                  <div className="h-1/3 bg-white" />

                  <div className="h-[2px] bg-red-500" />

                  <div className="h-1/3 bg-green-600" />

                  <div className="absolute top-3 left-4 text-white text-2xl">
                    ☾
                  </div>

                  <div className="absolute top-2 left-12 text-white text-xs tracking-[0.2em]">
                    ✦ ✦ ✦
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* TITLE */}

          <h1
            className="
              text-5xl
              md:text-7xl
              font-black
              tracking-tight
              bg-gradient-to-r
              from-blue-400
              via-white
              to-green-400
              bg-clip-text
              text-transparent
            "
          >
            Independence
          </h1>

          <h2
            className="
              text-2xl
              md:text-4xl
              font-black
              text-white
              mt-2
            "
          >
            Cycle
          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              text-zinc-400
              text-base
              md:text-lg
              mt-6
              leading-relaxed
            "
          >
            Mustaqillik ruhi, bilim va
            matematika bir joyda.
            Bu cycle davomida o'z
            imkoniyatingizni sinang va
            leaderboard tepasiga chiqing.
          </p>

          {/* =================================================
              DATE
          ================================================= */}

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
              mt-7
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-zinc-950/80
                border
                border-zinc-800
              "
            >
              <CalendarDays
                size={16}
                className="text-blue-400"
              />

              <span className="text-sm text-zinc-300">
                Aug 31 — Sep 13, 2026
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-zinc-950/80
                border
                border-zinc-800
              "
            >
              <Flame
                size={16}
                className="text-orange-400"
              />

              <span className="text-sm text-zinc-300">
                {daysRemaining} days remaining
              </span>
            </div>

          </div>

        </section>

        {/* =================================================
            COLOR DIVIDER
        ================================================= */}

        <div className="flex h-1.5 rounded-full overflow-hidden max-w-xl mx-auto mt-12 mb-12 opacity-80">

          <div className="flex-1 bg-blue-500" />

          <div className="flex-1 bg-white" />

          <div className="flex-1 bg-green-500" />

        </div>

        {/* =================================================
            CYCLE INFO
        ================================================= */}

        <section
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
            mb-12
          "
        >

          {/* CARD 1 */}

          <div
            className="
              rounded-3xl
              border
              border-blue-500/15
              bg-zinc-950/70
              backdrop-blur-xl
              p-6
              hover:border-blue-500/30
              transition
            "
          >

            <div className="text-3xl mb-4">
              🇺🇿
            </div>

            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              Cycle
            </p>

            <h3 className="text-2xl font-black mt-1">
              #02
            </h3>

          </div>

          {/* CARD 2 */}

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-zinc-950/70
              backdrop-blur-xl
              p-6
              hover:border-white/20
              transition
            "
          >

            <div className="text-3xl mb-4">
              ⚡
            </div>

            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              Duration
            </p>

            <h3 className="text-2xl font-black mt-1">
              14 Days
            </h3>

          </div>

          {/* CARD 3 */}

          <div
            className="
              rounded-3xl
              border
              border-green-500/15
              bg-zinc-950/70
              backdrop-blur-xl
              p-6
              hover:border-green-500/30
              transition
            "
          >

            <div className="text-3xl mb-4">
              🏆
            </div>

            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              Goal
            </p>

            <h3 className="text-2xl font-black mt-1">
              Reach Top 3
            </h3>

          </div>

        </section>

        {/* =================================================
            LEADERBOARD HEADER
        ================================================= */}

        <section>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

            <div>

              <div className="flex items-center gap-3">

                <Trophy
                  size={30}
                  className="text-yellow-400"
                />

                <h2 className="text-3xl md:text-4xl font-black">
                  Independence Rankings
                </h2>

              </div>

              <p className="text-zinc-500 mt-2">
                Cycle davomida eng ko'p
                Genius Points to'plaganlar.
              </p>

            </div>

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                text-zinc-500
              "
            >
              <Star
                size={16}
                className="text-yellow-400"
              />

              <span>
                {users.length} players
              </span>
            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div
              className="
                border
                border-zinc-800
                rounded-3xl
                p-14
                text-center
                bg-zinc-950/60
              "
            >

              <div
                className="
                  w-10
                  h-10
                  border-4
                  border-zinc-700
                  border-t-green-500
                  rounded-full
                  animate-spin
                  mx-auto
                  mb-5
                "
              />

              <p className="text-zinc-500">
                Loading Independence rankings...
              </p>

            </div>

          ) : users.length === 0 ? (

            /* =================================================
               EMPTY
            ================================================= */

            <div
              className="
                border
                border-zinc-800
                rounded-3xl
                p-14
                text-center
                bg-zinc-950/60
              "
            >

              <div className="text-5xl mb-5">
                🇺🇿
              </div>

              <h3 className="text-2xl font-bold">
                The race has begun.
              </h3>

              <p className="text-zinc-500 mt-2">
                Birinchi bo'lib leaderboardga
                chiqing.
              </p>

            </div>

          ) : (

            <>
              {/* =================================================
                  TOP 3
              ================================================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-5
                  items-end
                "
              >

                {/* SECOND */}

                {second && (
                  <div
                    className="
                      order-2
                      md:order-1
                      rounded-3xl
                      border
                      border-zinc-700
                      bg-zinc-950/80
                      backdrop-blur-xl
                      p-7
                      text-center
                    "
                  >

                    <div className="text-4xl mb-4">
                      🥈
                    </div>

                    <img
                      src={getAvatarImage(
                        second.avatar
                      )}
                      alt={second.username}
                      className="
                        w-24
                        h-24
                        rounded-full
                        object-cover
                        border-4
                        border-zinc-600
                        mx-auto
                        mb-4
                      "
                      onError={(event) => {
                        event.currentTarget.src =
                          "/logo.png";
                      }}
                    />

                    <h3 className="text-xl font-bold">
                      {second.name}{" "}
                      {second.surname}
                    </h3>

                    <p className="text-zinc-500 text-sm mt-1">
                      @{second.username}
                    </p>

                    <p className="text-3xl font-black text-zinc-300 mt-5">
                      {second.geniusPoints}
                    </p>

                    <p className="text-xs text-zinc-600">
                      GENIUS POINTS
                    </p>

                  </div>
                )}

                {/* FIRST */}

                {first && (
                  <div
                    className="
                      order-1
                      md:order-2
                      md:-translate-y-5
                      rounded-3xl
                      border
                      border-yellow-500/30
                      bg-gradient-to-b
                      from-yellow-500/10
                      to-zinc-950/80
                      backdrop-blur-xl
                      p-8
                      text-center
                      shadow-[0_0_60px_rgba(234,179,8,0.08)]
                    "
                  >

                    <Crown
                      size={42}
                      className="
                        text-yellow-400
                        mx-auto
                        mb-2
                      "
                    />

                    <div className="text-4xl mb-4">
                      🥇
                    </div>

                    <img
                      src={getAvatarImage(
                        first.avatar
                      )}
                      alt={first.username}
                      className="
                        w-28
                        h-28
                        rounded-full
                        object-cover
                        border-4
                        border-yellow-400
                        mx-auto
                        mb-4
                      "
                      onError={(event) => {
                        event.currentTarget.src =
                          "/logo.png";
                      }}
                    />

                    <h3 className="text-2xl font-black">
                      {first.name}{" "}
                      {first.surname}
                    </h3>

                    <p className="text-zinc-400 mt-1">
                      @{first.username}
                    </p>

                    <p className="text-4xl font-black text-yellow-400 mt-5">
                      {first.geniusPoints}
                    </p>

                    <p className="text-xs text-zinc-600">
                      GENIUS POINTS
                    </p>

                  </div>
                )}

                {/* THIRD */}

                {third && (
                  <div
                    className="
                      order-3
                      rounded-3xl
                      border
                      border-orange-700/40
                      bg-zinc-950/80
                      backdrop-blur-xl
                      p-7
                      text-center
                    "
                  >

                    <div className="text-4xl mb-4">
                      🥉
                    </div>

                    <img
                      src={getAvatarImage(
                        third.avatar
                      )}
                      alt={third.username}
                      className="
                        w-24
                        h-24
                        rounded-full
                        object-cover
                        border-4
                        border-orange-700
                        mx-auto
                        mb-4
                      "
                      onError={(event) => {
                        event.currentTarget.src =
                          "/logo.png";
                      }}
                    />

                    <h3 className="text-xl font-bold">
                      {third.name}{" "}
                      {third.surname}
                    </h3>

                    <p className="text-zinc-500 text-sm mt-1">
                      @{third.username}
                    </p>

                    <p className="text-3xl font-black text-orange-400 mt-5">
                      {third.geniusPoints}
                    </p>

                    <p className="text-xs text-zinc-600">
                      GENIUS POINTS
                    </p>

                  </div>
                )}

              </div>

              {/* =================================================
                  ALL USERS
              ================================================= */}

              <div
                className="
                  mt-8
                  rounded-3xl
                  overflow-hidden
                  border
                  border-zinc-800
                  bg-zinc-950/70
                  backdrop-blur-xl
                "
              >

                <div
                  className="
                    px-5
                    md:px-7
                    py-5
                    border-b
                    border-zinc-800
                    flex
                    items-center
                    gap-3
                  "
                >

                  <Trophy
                    size={23}
                    className="text-yellow-400"
                  />

                  <div>

                    <h3 className="text-xl font-bold">
                      All Rankings
                    </h3>

                    <p className="text-xs text-zinc-600 mt-1">
                      Independence Cycle
                    </p>

                  </div>

                </div>

                <div className="divide-y divide-zinc-800">

                  {users.map(
                    (player, index) => {

                      const rank =
                        index + 1;

                      return (
                        <div
                          key={`${player.username}-${index}`}
                          className="
                            px-4
                            md:px-7
                            py-5
                            flex
                            items-center
                            gap-3
                            md:gap-5
                            hover:bg-white/[0.02]
                            transition
                          "
                        >

                          {/* RANK */}

                          <div
                            className="
                              w-9
                              md:w-12
                              shrink-0
                              text-center
                            "
                          >

                            {rank === 1 ? (
                              <span className="text-2xl">
                                🥇
                              </span>
                            ) : rank === 2 ? (
                              <span className="text-2xl">
                                🥈
                              </span>
                            ) : rank === 3 ? (
                              <span className="text-2xl">
                                🥉
                              </span>
                            ) : (
                              <span className="text-zinc-600 font-bold">
                                #{rank}
                              </span>
                            )}

                          </div>

                          {/* AVATAR */}

                          <img
                            src={getAvatarImage(
                              player.avatar
                            )}
                            alt={player.username}
                            className="
                              w-11
                              h-11
                              md:w-14
                              md:h-14
                              rounded-full
                              object-cover
                              border
                              border-zinc-700
                              shrink-0
                            "
                            onError={(event) => {
                              event.currentTarget.src =
                                "/logo.png";
                            }}
                          />

                          {/* USER */}

                          <div className="flex-1 min-w-0">

                            <h4 className="font-bold truncate">
                              {player.name}{" "}
                              {player.surname}
                            </h4>

                            <p className="text-zinc-500 text-sm truncate">
                              @{player.username}
                            </p>

                          </div>

                          {/* GP */}

                          <div className="text-right shrink-0">

                            <p className="text-xs text-zinc-600">
                              GP
                            </p>

                            <p
                              className={`
                                text-xl
                                md:text-2xl
                                font-black
                                ${
                                  rank === 1
                                    ? "text-yellow-400"
                                    : rank === 2
                                    ? "text-zinc-300"
                                    : rank === 3
                                    ? "text-orange-400"
                                    : "text-green-400"
                                }
                              `}
                            >
                              {
                                player.geniusPoints
                              }
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

            </>
          )}

        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section
          className="
            mt-14
            rounded-3xl
            border
            border-zinc-800
            bg-zinc-950/60
            backdrop-blur-xl
            p-7
            md:p-10
          "
        >

          <div className="flex items-center gap-3 mb-7">

            <div
              className="
                w-11
                h-11
                rounded-2xl
                bg-green-500/10
                border
                border-green-500/20
                flex
                items-center
                justify-center
              "
            >
              🇺🇿
            </div>

            <div>

              <h2 className="text-2xl font-black">
                Independence Cycle
              </h2>

              <p className="text-zinc-500 text-sm">
                How to become a champion
              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            <div>

              <div className="text-2xl mb-3">
                01
              </div>

              <h3 className="font-bold">
                Solve Problems
              </h3>

              <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                Certificate, SAT va
                Olympiad masalalarini
                yeching.
              </p>

            </div>

            <div>

              <div className="text-2xl mb-3">
                02
              </div>

              <h3 className="font-bold">
                Earn GP
              </h3>

              <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                Har bir to'g'ri javob
                orqali Genius Points
                to'plang.
              </p>

            </div>

            <div>

              <div className="text-2xl mb-3">
                03
              </div>

              <h3 className="font-bold">
                Reach Top 3
              </h3>

              <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                Cycle yakunida eng
                yuqori natijani ko'rsating.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <div
          className="
            mt-10
            text-center
            pb-10
          "
        >

          <p className="text-zinc-600 text-sm mb-4">
            Your independence is built
            through knowledge.
          </p>

          <Link
            href="/daily"
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-white
              text-black
              font-bold
              hover:scale-105
              transition
            "
          >
            Start Solving

            <ArrowRight size={18} />

          </Link>

        </div>

      </div>

      {/* ===================================================
          CUSTOM ANIMATION
      =================================================== */}

      <style jsx global>{`

        @keyframes wave {

          0%,
          100% {
            transform:
              perspective(600px)
              rotateY(-3deg)
              skewY(0deg);
          }

          25% {
            transform:
              perspective(600px)
              rotateY(6deg)
              skewY(1deg);
          }

          50% {
            transform:
              perspective(600px)
              rotateY(-6deg)
              skewY(-1deg);
          }

          75% {
            transform:
              perspective(600px)
              rotateY(4deg)
              skewY(1deg);
          }

        }

      `}</style>

    </main>
  );
}
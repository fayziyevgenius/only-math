"use client";

import { useEffect, useState } from "react";

type User = {
  name: string;
  surname: string;
  username: string;

  geniusPoints: number;

  olympiadIndependenceSolved?: boolean;

  // Hacker achievement
  // 8 belgili Independence kod to'liq ochilganda true bo'ladi
  independenceCodeUnlocked?: boolean;

  stats: {
    national?: {
      attempts: number;
      correct: number;
    };

    sat?: {
      attempts: number;
      correct: number;
    };

    olympiad?: {
      attempts: number;
      correct: number;

      independence?: {
        attempts: number;
        correct: number;
      };
    };

    daily?: {
      attempts: number;
      correct: number;
    };

    mathSpirit?: {
      games: number;
      highestScore: number;
      totalScore: number;
      bestCombo: number;
    };
  };

  topThree?: boolean;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  requirement: string;
  image: string;
  unlocked: boolean;
};

export default function AchievementsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUserData =
          localStorage.getItem("currentUser");

        if (!currentUserData) {
          setLoading(false);
          return;
        }

        const localUser = JSON.parse(
          currentUserData
        );

        if (!localUser.username) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/me", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: localUser.username,
          }),

          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to load user:",
            data
          );

          setLoading(false);
          return;
        }

        console.log(
          "ACHIEVEMENTS USER:",
          data
        );

        setUser(data);

        localStorage.setItem(
          "currentUser",
          JSON.stringify(data)
        );
      } catch (error) {
        console.error(
          "Failed to load achievements user:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 mx-auto rounded-full border-4 border-zinc-800 border-t-green-500 animate-spin" />

          <p className="mt-5 text-zinc-400">
            Loading achievements...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // NO USER
  // =====================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

        <div className="text-center">

          <h1 className="text-3xl font-black">
            Please sign in
          </h1>

          <p className="text-zinc-500 mt-2">
            Your achievements could not be loaded.
          </p>

        </div>

      </div>
    );
  }

  const currentUser = user;

  // =====================================================
  // SAFE STATS
  // =====================================================

  const nationalAttempts = Number(
    currentUser.stats?.national?.attempts || 0
  );

  const nationalCorrect = Number(
    currentUser.stats?.national?.correct || 0
  );

  const satAttempts = Number(
    currentUser.stats?.sat?.attempts || 0
  );

  const satCorrect = Number(
    currentUser.stats?.sat?.correct || 0
  );

  const olympiadAttempts = Number(
    currentUser.stats?.olympiad?.attempts || 0
  );

  const olympiadCorrect = Number(
    currentUser.stats?.olympiad?.correct || 0
  );

  // =====================================================
  // INDEPENDENCE CYCLE
  // =====================================================

  const olympiadIndependenceAttempts =
    Number(
      currentUser.stats?.olympiad?.independence
        ?.attempts || 0
    );

  const olympiadIndependenceCorrect =
    Number(
      currentUser.stats?.olympiad?.independence
        ?.correct || 0
    );

  const dailyAttempts = Number(
    currentUser.stats?.daily?.attempts || 0
  );

  const highestSprintScore = Number(
    currentUser.stats?.mathSpirit?.highestScore || 0
  );

  // =====================================================
  // 1. DAILY MASTER
  // =====================================================

  const daily7Unlocked =
    dailyAttempts >= 7;

  // =====================================================
  // 2. PROBLEM SOLVER
  //
  // ANY academic question:
  // Certificate OR SAT OR Olympiad
  //
  // Olympiad:
  // - old stats.olympiad.attempts
  // - Independence attempts
  // - Independence solved
  // =====================================================

  const olympiadSolved =
    olympiadAttempts > 0 ||
    olympiadIndependenceAttempts > 0 ||
    currentUser.olympiadIndependenceSolved === true;

  const solveAnyQuestionUnlocked =
    nationalAttempts > 0 ||
    satAttempts > 0 ||
    olympiadSolved;

  // =====================================================
  // 3. SPRINT RUNNER
  // =====================================================

  const sprint60Unlocked =
    highestSprintScore >= 60;

  // =====================================================
  // 4. PERFECT TRIO
  // =====================================================

  const certificatePerfect =
    nationalAttempts === 20 &&
    nationalCorrect === 20;

  const satPerfect =
    satAttempts === 20 &&
    satCorrect === 20;

  const olympiadPerfect =
    olympiadAttempts === 20 &&
    olympiadCorrect === 20;

  const perfectTrioUnlocked =
    certificatePerfect &&
    satPerfect &&
    olympiadPerfect;

  // =====================================================
  // 5. TOP 3
  // =====================================================

  const top3Unlocked =
    currentUser.topThree === true;

  // =====================================================
  // 6. INDEPENDENCE CYCLE
  //
  // Independence'da:
  // Certificate
  // SAT
  // Olympiad
  //
  // dan kamida bitta savol.
  // =====================================================

  const independenceCycleUnlocked =
    nationalAttempts > 0 ||
    satAttempts > 0 ||
    olympiadIndependenceAttempts > 0 ||
    currentUser.olympiadIndependenceSolved === true;

  // =====================================================
  // 7. HACKER
  //
  // 8 belgili maxfiy kod to'liq ochilganda unlock.
  //
  // Backend:
  // independenceCodeUnlocked === true
  // =====================================================

  const hackerUnlocked =
    currentUser.independenceCodeUnlocked === true;

  // =====================================================
  // DEBUG
  // =====================================================

  console.log(
    "========== ACHIEVEMENT STATUS =========="
  );

  console.log(
    "National attempts:",
    nationalAttempts
  );

  console.log(
    "SAT attempts:",
    satAttempts
  );

  console.log(
    "Olympiad attempts:",
    olympiadAttempts
  );

  console.log(
    "Independence attempts:",
    olympiadIndependenceAttempts
  );

  console.log(
    "Independence solved:",
    currentUser.olympiadIndependenceSolved
  );

  console.log(
    "Problem Solver:",
    solveAnyQuestionUnlocked
  );

  console.log(
    "Independence Cycle:",
    independenceCycleUnlocked
  );

  console.log(
    "Hacker:",
    hackerUnlocked
  );

  console.log(
    "Perfect Trio:",
    perfectTrioUnlocked
  );

  // =====================================================
  // ACHIEVEMENTS
  // =====================================================

  const achievements: Achievement[] = [

    // ===================================================
    // INDEPENDENCE CYCLE
    // ===================================================

    {
      id: "independence-cycle",

      title: "Independence Cycle",

      description:
        "Only Math tarixidagi Independence Cycle'da qatnashganingizni bildiruvchi maxsus avatar.",

      requirement:
        "Independence Cycle'da Certificate, SAT yoki Olympiad'dan kamida bitta savol yeching.",

      image:
        "/avatars/independence-cycle.png",

      unlocked:
        independenceCycleUnlocked,
    },

    // ===================================================
    // DAILY MASTER
    // ===================================================

    {
      id: "daily-7",

      title: "Daily Master",

      description:
        "Daily Challenge'ni muntazam bajargan foydalanuvchilar uchun.",

      requirement:
        "7 ta Daily Problem yeching.",

      image:
        "/avatars/daily-7in.png",

      unlocked:
        daily7Unlocked,
    },

    // ===================================================
    // PROBLEM SOLVER
    // ===================================================

    {
      id: "solve-question",

      title: "Problem Solver",

      description:
        "Birinchi akademik savolingizni yechganingizni bildiradi.",

      requirement:
        "Certificate, SAT yoki Olympiad'dan kamida bitta savol yeching.",

      image:
        "/avatars/solve-questionin.png",

      unlocked:
        solveAnyQuestionUnlocked,
    },

    // ===================================================
    // SPRINT RUNNER
    // ===================================================

    {
      id: "sprint-60",

      title: "Sprint Runner",

      description:
        "Math Sprint'da yuqori tezlik va aniqlikni ko'rsatganlar uchun.",

      requirement:
        "Math Sprint'da 60 yoki undan yuqori score oling.",

      image:
        "/avatars/sprint-60in.png",

      unlocked:
        sprint60Unlocked,
    },

    // ===================================================
    // PERFECT TRIO
    // ===================================================

    {
      id: "perfect-trio",

      title: "Perfect Trio",

      description:
        "Uchta asosiy yo'nalishda mukammal natija ko'rsatganlar uchun.",

      requirement:
        "Certificate, SAT va Olympiad'dan perfect score oling.",

      image:
        "/avatars/perfect-trioin.png",

      unlocked:
        perfectTrioUnlocked,
    },

    // ===================================================
    // TOP 3
    // ===================================================

    {
      id: "top-3",

      title: "Top 3",

      description:
        "Only Math leaderboard'ining eng kuchli foydalanuvchilari uchun.",

      requirement:
        "Global Leaderboard'da Top 3 o'rinni egallang.",

      image:
        "/avatars/top-3in.png",

      unlocked:
        top3Unlocked,
    },

    // ===================================================
    // HACKER
    // ===================================================

    {
      id: "hacker",

      title: "Hacker",

      description:
        "Independence Cycle'dagi maxfiy 8 belgili kodni to'liq ochgan foydalanuvchilar uchun.",

      requirement:
        "8 belgidan iborat maxfiy kodni to'liq oching.",

      image:
        "/avatars/hacker.png",

      unlocked:
        hackerUnlocked,
    },
  ];

  // =====================================================
  // COUNTERS
  // =====================================================

  const unlockedCount =
    achievements.filter(
      (achievement) =>
        achievement.unlocked
    ).length;

  const totalAchievements =
    achievements.length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-10 md:py-10">

      <div className="max-w-6xl mx-auto">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 p-6 sm:p-8 md:p-10">

          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-green-500/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black tracking-wider">
                  <span>✦</span>
                  ACHIEVEMENTS
                </div>

                <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-5">
                  Your achievements
                </h1>

                <p className="text-zinc-400 text-base sm:text-lg mt-3 max-w-2xl">
                  Challenge yourself, unlock unique
                  avatars and build your Only Math
                  profile.
                </p>

              </div>

              <div className="shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 px-6 py-5 min-w-[180px]">

                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                  Unlocked
                </p>

                <p className="text-4xl font-black text-green-400 mt-1">

                  {unlockedCount}

                  <span className="text-zinc-600 text-2xl">
                    /{totalAchievements}
                  </span>

                </p>

                <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalAchievements === 0
                          ? 0
                          : (unlockedCount /
                              totalAchievements) *
                            100
                      }%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            USER STATUS
        ===================================================== */}

        <section className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">

                <img
                  src="/logo.png"
                  alt="Only Math"
                  className="w-full h-full object-cover"
                />

              </div>

              <div>

                <p className="text-zinc-500 text-sm">
                  Player
                </p>

                <p className="text-xl font-black text-white">
                  {currentUser.name}{" "}
                  {currentUser.surname}
                </p>

                <p className="text-sm text-zinc-600">
                  @{currentUser.username}
                </p>

              </div>

            </div>

            <div className="text-left sm:text-right">

              <p className="text-zinc-500 text-sm">
                Math Sprint best
              </p>

              <p className="text-3xl font-black text-green-400">
                {highestSprintScore}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            ACHIEVEMENT GRID
        ===================================================== */}

        <section className="mt-8">

          <div className="flex items-end justify-between mb-6">

            <div>

              <p className="text-xs uppercase tracking-widest text-zinc-600 font-bold">
                Collection
              </p>

              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                Unlock your avatars
              </h2>

            </div>

            <p className="hidden sm:block text-sm text-zinc-600">
              {unlockedCount} unlocked
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {achievements.map(
              (achievement) => (

                <div
                  key={achievement.id}
                  className={`
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    bg-zinc-950
                    transition-all
                    ${
                      achievement.unlocked
                        ? "border-green-500/30 hover:border-green-500/60"
                        : "border-zinc-800"
                    }
                  `}
                >

                  {/* IMAGE */}

                  <div className="p-5">

                    <div className="relative aspect-square max-w-[220px] mx-auto rounded-3xl overflow-hidden bg-zinc-900">

                      <img
                        src={
                          achievement.image
                        }
                        alt={
                          achievement.title
                        }
                        className={`
                          w-full
                          h-full
                          object-cover
                          transition
                          ${
                            achievement.unlocked
                              ? ""
                              : "grayscale brightness-[0.35]"
                          }
                        `}
                      />

                      {!achievement.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">

                          <div className="w-16 h-16 rounded-2xl bg-black/70 border border-zinc-700 flex items-center justify-center text-3xl">
                            🔒
                          </div>

                        </div>
                      )}

                      {achievement.unlocked && (
                        <div className="absolute top-3 right-3">

                          <div className="w-9 h-9 rounded-full bg-green-500 text-black flex items-center justify-center font-black shadow-lg shadow-green-500/20">
                            ✓
                          </div>

                        </div>
                      )}

                    </div>

                  </div>

                  {/* INFO */}

                  <div className="px-5 pb-6">

                    <div className="flex items-center justify-between gap-3">

                      <h3 className="text-xl font-black">
                        {achievement.title}
                      </h3>

                      {achievement.unlocked ? (

                        <span className="text-xs font-black text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                          UNLOCKED
                        </span>

                      ) : (

                        <span className="text-xs font-black text-zinc-600 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
                          LOCKED
                        </span>

                      )}

                    </div>

                    <p className="text-sm text-zinc-500 mt-3 leading-6">
                      {achievement.description}
                    </p>

                    <div
                      className={`
                        mt-5
                        rounded-2xl
                        p-4
                        border
                        ${
                          achievement.unlocked
                            ? "bg-green-500/5 border-green-500/10"
                            : "bg-zinc-900 border-zinc-800"
                        }
                      `}
                    >

                      <p className="text-[10px] uppercase tracking-widest font-black text-zinc-600">

                        {achievement.unlocked
                          ? "Achievement complete"
                          : "Shart"}

                      </p>

                      <p
                        className={`
                          text-sm
                          leading-5
                          mt-1
                          ${
                            achievement.unlocked
                              ? "text-green-400"
                              : "text-zinc-400"
                          }
                        `}
                      >

                        {achievement.unlocked
                          ? "✓ Siz bu achievementni ochgansiz."
                          : achievement.requirement}

                      </p>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =====================================================
            INDEPENDENCE STATUS
        ===================================================== */}

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl">
              🧮
            </div>

            <div>

              <h3 className="text-xl font-black">
                Independence Cycle Achievement Status
              </h3>

              <p className="text-sm text-zinc-600">
                Independence Cycle holati
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Olympiad attempts
              </p>

              <p className="text-3xl font-black text-white mt-1">
                {olympiadAttempts}
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Independence attempts
              </p>

              <p className="text-3xl font-black text-white mt-1">
                {olympiadIndependenceAttempts}
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Independence solved
              </p>

              <p
                className={`text-xl font-black mt-2 ${
                  currentUser.olympiadIndependenceSolved
                    ? "text-green-400"
                    : "text-zinc-500"
                }`}
              >
                {currentUser.olympiadIndependenceSolved
                  ? "✓ YES"
                  : "NO"}
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Independence Cycle
              </p>

              <p
                className={`text-xl font-black mt-2 ${
                  independenceCycleUnlocked
                    ? "text-green-400"
                    : "text-zinc-500"
                }`}
              >
                {independenceCycleUnlocked
                  ? "✓ UNLOCKED"
                  : "🔒 LOCKED"}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            HACKER STATUS
        ===================================================== */}

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
              🧑‍💻
            </div>

            <div>

              <h3 className="text-xl font-black">
                Hacker Achievement
              </h3>

              <p className="text-sm text-zinc-600">
                8 belgili maxfiy kod holati
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Required
              </p>

              <p className="text-3xl font-black text-white mt-1">
                8
              </p>

              <p className="text-sm text-zinc-500 mt-1">
                code characters
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Code status
              </p>

              <p
                className={`text-xl font-black mt-2 ${
                  hackerUnlocked
                    ? "text-green-400"
                    : "text-zinc-500"
                }`}
              >
                {hackerUnlocked
                  ? "✓ COMPLETE"
                  : "🔒 INCOMPLETE"}
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Hacker
              </p>

              <p
                className={`text-xl font-black mt-2 ${
                  hackerUnlocked
                    ? "text-green-400"
                    : "text-zinc-500"
                }`}
              >
                {hackerUnlocked
                  ? "✓ UNLOCKED"
                  : "🔒 LOCKED"}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            MATH SPRINT STATUS
        ===================================================== */}

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xl">
              ⚡
            </div>

            <div>

              <h3 className="text-xl font-black">
                Math Sprint Achievement
              </h3>

              <p className="text-sm text-zinc-600">
                60+ score achievement status
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Highest score
              </p>

              <p className="text-3xl font-black text-white mt-1">
                {highestSprintScore}
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Required
              </p>

              <p className="text-3xl font-black text-green-400 mt-1">
                60+
              </p>

            </div>

            <div className="col-span-2 md:col-span-1 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">

              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Status
              </p>

              <p
                className={`
                  text-xl
                  font-black
                  mt-2
                  ${
                    sprint60Unlocked
                      ? "text-green-400"
                      : "text-zinc-500"
                  }
                `}
              >
                {sprint60Unlocked
                  ? "✓ Unlocked"
                  : "🔒 Locked"}
              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}
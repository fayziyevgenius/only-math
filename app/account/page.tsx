"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTitle } from "@/lib/title";

type User = {
  name: string;
  surname: string;
  email: string;
  username: string;
  birthday: string;

  avatar?: string;

  geniusPoints: number;
  streak: number;
  title: string;

  // =========================================
  // HACKER
  // =========================================

  hackerUnlocked?: boolean;

  // =========================================
  // STATS
  // =========================================

  stats: {
    national: {
      attempts: number;
      correct: number;
    };

    sat: {
      attempts: number;
      correct: number;
    };

    olympiad: {
      attempts: number;
      correct: number;
    };

    daily: {
      attempts: number;
      correct: number;
    };

    mathSpirit: {
      games: number;
      highestScore: number;
      totalScore: number;
      bestCombo: number;
    };
  };

  topThree?: boolean;
};

type Avatar = {
  id: string;
  name: string;
  image: string;
  unlocked: boolean;
  requirement?: string;
  description: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);

  const [avatarOpen, setAvatarOpen] =
    useState(false);

  const [loadingAvatar, setLoadingAvatar] =
    useState(false);

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUserData =
          localStorage.getItem("currentUser");

        if (!currentUserData) return;

        const localUser =
          JSON.parse(currentUserData);

        if (!localUser.username) return;

        const res = await fetch("/api/me", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
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

          return;
        }

        // =================================================
        // SERVERDAGI USER ASOSIY MANBA
        // =================================================

        setUser(data);

        // =================================================
        // LOCAL STORAGE SYNC
        // =================================================

        localStorage.setItem(
          "currentUser",
          JSON.stringify(data)
        );

        // =================================================
        // AVATAR SYNC
        // =================================================

        if (data.avatar) {
          localStorage.setItem(
            "onlyMathAvatar",
            data.avatar
          );
        }
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );
      }
    }

    loadUser();
  }, []);

  // =====================================================
  // CHANGE AVATAR
  // =====================================================

  async function changeAvatar(
    avatar: Avatar
  ) {
    if (!avatar.unlocked) return;

    if (!user) return;

    if (loadingAvatar) return;

    try {
      setLoadingAvatar(true);

      const res = await fetch(
        "/api/update-avatar",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username: user.username,
            avatar: avatar.id,
          }),

          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "========== /api/update-avatar ERROR =========="
        );

        console.error(
          "Status:",
          res.status
        );

        console.error(
          "Status Text:",
          res.statusText
        );

        console.error(
          "Response:",
          data
        );

        console.error(
          "Current User:",
          user
        );

        console.error(
          "=============================================="
        );

        alert(
          data?.error ||
            `Failed to update avatar (${res.status})`
        );

        return;
      }

      // =================================================
      // SERVERDAN QAYTGAN AVATAR
      // =================================================

      const newAvatar =
        data.avatar || avatar.id;

      // =================================================
      // UPDATE REACT STATE
      // =================================================

      setUser(
        (previousUser) => {
          if (!previousUser) {
            return previousUser;
          }

          return {
            ...previousUser,
            avatar: newAvatar,
          };
        }
      );

      // =================================================
      // UPDATE LOCAL STORAGE
      // =================================================

      const currentUserData =
        localStorage.getItem(
          "currentUser"
        );

      if (currentUserData) {
        const currentUser =
          JSON.parse(
            currentUserData
          );

        const updatedUser = {
          ...currentUser,
          avatar: newAvatar,
        };

        localStorage.setItem(
          "currentUser",
          JSON.stringify(updatedUser)
        );
      }

      localStorage.setItem(
        "onlyMathAvatar",
        newAvatar
      );

      // =================================================
      // CLOSE MODAL
      // =================================================

      setAvatarOpen(false);
    } catch (error) {
      console.error(
        "Avatar update error:",
        error
      );

      alert("Server Error.");
    } finally {
      setLoadingAvatar(false);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  // =====================================================
  // CURRENT USER
  // =====================================================

  const currentUser = user;

  // =====================================================
  // ACCURACY png
  // =====================================================

  const nationalAccuracy =
    currentUser.stats.national.attempts === 0
      ? 0
      : Math.round(
          (currentUser.stats.national.correct /
            currentUser.stats.national.attempts) *
            100
        );

  const satAccuracy =
    currentUser.stats.sat.attempts === 0
      ? 0
      : Math.round(
          (currentUser.stats.sat.correct /
            currentUser.stats.sat.attempts) *
            100
        );

  const olympiadAccuracy =
    currentUser.stats.olympiad.attempts === 0
      ? 0
      : Math.round(
          (currentUser.stats.olympiad.correct /
            currentUser.stats.olympiad.attempts) *
            100
        );

  const dailyAccuracy =
    currentUser.stats.daily.attempts === 0
      ? 0
      : Math.round(
          (currentUser.stats.daily.correct /
            currentUser.stats.daily.attempts) *
            100
        );

  const averageSprintScore =
    currentUser.stats.mathSpirit.games === 0
      ? 0
      : Math.round(
          currentUser.stats.mathSpirit.totalScore /
            currentUser.stats.mathSpirit.games
        );

  // =====================================================
  // ACHIEVEMENTS
  // =====================================================

  // =====================================================
  // 1. DAILY MASTER
  // =====================================================

  const daily7Unlocked =
    currentUser.stats.daily.attempts >= 7;

  // =====================================================
  // 2. INDEPENDENCE CYCLE
  //
  // Certificate / SAT / Olympiad'dan
  // kamida bitta savol yechilgan bo'lsa
  // =====================================================

  const solvedAnyQuestion =
    currentUser.stats.national.attempts > 0 ||
    currentUser.stats.sat.attempts > 0 ||
    currentUser.stats.olympiad.attempts > 0;

  const independenceCycleUnlocked =
    solvedAnyQuestion;

  // =====================================================
  // 3. PROBLEM SOLVER
  // =====================================================

  const problemSolverUnlocked =
    solvedAnyQuestion;

  // =====================================================
  // 4. MATH SPRINT 60+
  // =====================================================

  const sprint60Unlocked =
    currentUser.stats.mathSpirit
      .highestScore >= 60;

  // =====================================================
  // 5. PERFECT CERTIFICATE
  // =====================================================

  const perfectCertificate =
    currentUser.stats.national.attempts > 0 &&
    currentUser.stats.national.correct ===
      currentUser.stats.national.attempts;

  // =====================================================
  // 6. PERFECT SAT
  // =====================================================

  const perfectSAT =
    currentUser.stats.sat.attempts > 0 &&
    currentUser.stats.sat.correct ===
      currentUser.stats.sat.attempts;

  // =====================================================
  // 7. PERFECT OLYMPIAD
  // =====================================================

  const perfectOlympiad =
    currentUser.stats.olympiad.attempts > 0 &&
    currentUser.stats.olympiad.correct ===
      currentUser.stats.olympiad.attempts;

  // =====================================================
  // 8. PERFECT THREE
  // =====================================================

  const perfectThreeUnlocked =
    perfectCertificate &&
    perfectSAT &&
    perfectOlympiad;

  // =====================================================
  // 9. TOP 3
  // =====================================================

  const topThreeUnlocked =
    currentUser.topThree === true;

  // =====================================================
  // 10. HACKER
  //
  // Faqat 8 talik kodni to'g'ri ochganda
  // backend currentUser.hackerUnlocked = true
  // qilib qo'yadi.
  // =====================================================

  const hackerUnlocked =
    currentUser.hackerUnlocked === true;

  // =====================================================
  // DEBUG
  // =====================================================

  console.log(
    "========== ACCOUNT ACHIEVEMENTS =========="
  );

  console.log(
    "Independence Cycle:",
    independenceCycleUnlocked
  );

  console.log(
    "Problem Solver:",
    problemSolverUnlocked
  );

  console.log(
    "Daily Master:",
    daily7Unlocked
  );

  console.log(
    "Sprint Runner:",
    sprint60Unlocked
  );

  console.log(
    "Perfect Certificate:",
    perfectCertificate
  );

  console.log(
    "Perfect SAT:",
    perfectSAT
  );

  console.log(
    "Perfect Olympiad:",
    perfectOlympiad
  );

  console.log(
    "Perfect Three:",
    perfectThreeUnlocked
  );

  console.log(
    "Top 3:",
    topThreeUnlocked
  );

  console.log(
    "Hacker:",
    hackerUnlocked
  );

  console.log(
    "=========================================="
  );

  // =====================================================
  // AVATARS
  // =====================================================

  const avatars: Avatar[] = [
    // ===================================================
    // DEFAULT
    // ===================================================

    {
      id: "only-math",

      name: "Only Math",

      image:
        "/logo.png",

      unlocked: true,

      description:
        "Only Math asosiy avatari.",
    },

    // ===================================================
    // INDEPENDENCE CYCLE
    // ===================================================

    {
      id: "independence-cycle",

      name: "Independence Cycle",

      image:
        "/avatars/independence-cycle.png",

      unlocked:
        independenceCycleUnlocked,

      requirement:
        "Independence Cycle'da Certificate, SAT yoki Olympiad'dan kamida bitta savol yeching.",

      description:
        "Independence Cycle uchun maxsus avatar.",
    },

    // ===================================================
    // DAILY MASTER
    // ===================================================

    {
      id: "daily-7",

      name: "Daily Master",

      image:
        "/avatars/daily-7in.png",

      unlocked:
        daily7Unlocked,

      requirement:
        "7 ta Daily Problem yeching.",

      description:
        "Daily mashg'ulotlarini muntazam bajarganlar uchun.",
    },

    // ===================================================
    // PROBLEM SOLVER
    // ===================================================

    {
      id: "solve-question",

      name: "Problem Solver",

      image:
        "/avatars/solve-questionin.png",

      unlocked:
        problemSolverUnlocked,

      requirement:
        "Certificate, SAT yoki Olympiad'dan kamida bitta savol yeching.",

      description:
        "Birinchi akademik savolini yechgan foydalanuvchi uchun.",
    },

    // ===================================================
    // SPRINT RUNNER
    // ===================================================

    {
      id: "sprint-60",

      name: "Sprint Runner",

      image:
        "/avatars/sprint-60in.png",

      unlocked:
        sprint60Unlocked,

      requirement:
        "Math Sprint'da 60 yoki undan yuqori ball oling.",

      description:
        "Tezlik va aniqlikni namoyish qilganlar uchun.",
    },

    // ===================================================
    // PERFECT TRIO
    // ===================================================

    {
      id: "perfect-trio",

      name: "Perfect Trio",

      image:
        "/avatars/perfect-trioin.png",

      unlocked:
        perfectThreeUnlocked,

      requirement:
        "Certificate, SAT va Olympiad'dan mukammal natija oling.",

      description:
        "Uchala yo'nalishda ham perfect natijaga erishganlar uchun.",
    },

    // ===================================================
    // TOP 3
    // ===================================================

    {
      id: "top-3",

      name: "Top 3",

      image:
        "/avatars/top-3in.png",

      unlocked:
        topThreeUnlocked,

      requirement:
        "Leaderboard'da Top 3 o'rinni egallang.",

      description:
        "Eng kuchli foydalanuvchilar uchun maxsus avatar.",
    },

    // ===================================================
    // HACKER
    // ===================================================

    {
      id: "hacker",

      name: "Hacker",

      image:
        "/avatars/hacker.png",

      unlocked:
        hackerUnlocked,

      requirement:
        "8 talik maxfiy kodni to'g'ri oching.",

      description:
        "Maxfiy 8 talik kodni muvaffaqiyatli ochganlar uchun maxsus avatar.",
    },
  ];

  // =====================================================
  // ACTIVE AVATAR
  // =====================================================

  const serverAvatar =
    currentUser.avatar ||
    "only-math";

  const activeAvatar =
    avatars.find(
      (avatar) =>
        avatar.id === serverAvatar &&
        avatar.unlocked
    ) || avatars[0];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">

      <div className="max-w-5xl mx-auto">

        <div className="border border-gray-700 rounded-3xl p-6 md:p-10">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">

            {/* =================================================
                AVATAR
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                setAvatarOpen(true)
              }
              className="
                group
                relative
                w-28
                h-28
                md:w-32
                md:h-32
                rounded-full
                overflow-hidden
                bg-zinc-900
                border
                border-zinc-700
                hover:border-green-500
                transition
                shrink-0
              "
            >

              <img
                src={
                  activeAvatar.image
                }
                alt={
                  activeAvatar.name
                }
                className="
                  w-full
                  h-full
                  object-cover
                  rounded-full
                  transition
                  group-hover:scale-105
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-black/60
                  opacity-0
                  group-hover:opacity-100
                  transition
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                  text-white
                "
              >
                Change
              </div>

            </button>

            {/* =================================================
                PROFILE
            ================================================= */}

            <div className="text-center md:text-left">

              <h1 className="text-3xl md:text-5xl font-bold">
                {currentUser.name}{" "}
                {currentUser.surname}
              </h1>

              <p className="text-yellow-400 text-xl mt-2">
                {getTitle(
                  currentUser.geniusPoints
                )}
              </p>

              <p className="text-gray-400 mt-2 text-lg break-all">
                @{currentUser.username}
              </p>

              <p className="text-green-400 text-sm mt-2">
                {activeAvatar.name}
              </p>

            </div>

          </div>

          {/* =================================================
              PROFILE INFORMATION
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

            {/* NAME */}

            <div>

              <p className="text-gray-400">
                Name
              </p>

              <p className="text-xl md:text-2xl break-words">
                {currentUser.name}
              </p>

            </div>

            {/* SURNAME */}

            <div>

              <p className="text-gray-400">
                Surname
              </p>

              <p className="text-xl md:text-2xl break-words">
                {currentUser.surname}
              </p>

            </div>

            {/* EMAIL */}

            <div>

              <p className="text-gray-400">
                Email
              </p>

              <p className="text-xl md:text-2xl break-all">
                {currentUser.email}
              </p>

            </div>

            {/* USERNAME */}

            <div>

              <p className="text-gray-400">
                Username
              </p>

              <p className="text-xl md:text-2xl break-all">
                @{currentUser.username}
              </p>

            </div>

            {/* BIRTHDAY */}

            <div>

              <p className="text-gray-400">
                Birthday
              </p>

              <p className="text-xl md:text-2xl break-words">
                {currentUser.birthday}
              </p>

            </div>

          </div>

          {/* =================================================
              EDIT PROFILE
          ================================================= */}

          <Link href="/edit-profile">

            <button
              type="button"
              className="
                mt-12
                bg-white
                text-black
                px-8
                py-3
                rounded-full
                font-bold
                hover:scale-105
                transition
              "
            >
              Edit Profile
            </button>

          </Link>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="mt-14">

            <h2 className="text-4xl font-bold mb-8">
              📊 Learning Statistics
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* =================================================
                  NATIONAL CERTIFICATE
              ================================================= */}

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                <h3 className="text-2xl font-bold mb-4">
                  🇺🇿 National Certificate
                </h3>

                <div className="flex justify-between mb-2">

                  <span>
                    Attempts
                  </span>

                  <span>
                    {
                      currentUser.stats
                        .national
                        .attempts
                    }
                  </span>

                </div>

                <div className="flex justify-between mb-2">

                  <span>
                    Correct
                  </span>

                  <span className="text-green-400">
                    {
                      currentUser.stats
                        .national
                        .correct
                    }
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Accuracy
                  </span>

                  <span className="text-yellow-400">
                    {nationalAccuracy}%
                  </span>

                </div>

              </div>

              {/* =================================================
                  SAT
              ================================================= */}

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                <h3 className="text-2xl font-bold mb-4">
                  🎓 SAT Math
                </h3>

                <div className="flex justify-between mb-2">

                  <span>
                    Attempts
                  </span>

                  <span>
                    {
                      currentUser.stats
                        .sat
                        .attempts
                    }
                  </span>

                </div>

                <div className="flex justify-between mb-2">

                  <span>
                    Correct
                  </span>

                  <span className="text-green-400">
                    {
                      currentUser.stats
                        .sat
                        .correct
                    }
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Accuracy
                  </span>

                  <span className="text-yellow-400">
                    {satAccuracy}%
                  </span>

                </div>

              </div>

              {/* =================================================
                  OLYMPIAD
              ================================================= */}

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                <h3 className="text-2xl font-bold mb-4">
                  🏆 Olympiad
                </h3>

                <div className="flex justify-between mb-2">

                  <span>
                    Attempts
                  </span>

                  <span>
                    {
                      currentUser.stats
                        .olympiad
                        .attempts
                    }
                  </span>

                </div>

                <div className="flex justify-between mb-2">

                  <span>
                    Correct
                  </span>

                  <span className="text-green-400">
                    {
                      currentUser.stats
                        .olympiad
                        .correct
                    }
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Accuracy
                  </span>

                  <span className="text-yellow-400">
                    {olympiadAccuracy}%
                  </span>

                </div>

              </div>

              {/* =================================================
                  DAILY
              ================================================= */}

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                <h3 className="text-2xl font-bold mb-4">
                  📅 Daily Problem
                </h3>

                <div className="flex justify-between mb-2">

                  <span>
                    Attempts
                  </span>

                  <span>
                    {
                      currentUser.stats
                        .daily
                        .attempts
                    }
                  </span>

                </div>

                <div className="flex justify-between mb-2">

                  <span>
                    Correct
                  </span>

                  <span className="text-green-400">
                    {
                      currentUser.stats
                        .daily
                        .correct
                    }
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Accuracy
                  </span>

                  <span className="text-yellow-400">
                    {dailyAccuracy}%
                  </span>

                </div>

              </div>

              {/* =================================================
                  MATH SPRINT
              ================================================= */}

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:col-span-2">

                <h3 className="text-2xl font-bold mb-5">
                  ⚡ Math Sprint
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

                  {/* GAMES */}

                  <div>

                    <p className="text-zinc-400">
                      Games
                    </p>

                    <h2 className="text-3xl font-bold">
                      {
                        currentUser.stats
                          .mathSpirit
                          .games
                      }
                    </h2>

                  </div>

                  {/* HIGHEST */}

                  <div>

                    <p className="text-zinc-400">
                      Highest Score
                    </p>

                    <h2 className="text-3xl font-bold text-green-400">
                      {
                        currentUser.stats
                          .mathSpirit
                          .highestScore
                      }
                    </h2>

                  </div>

                  {/* AVERAGE */}

                  <div>

                    <p className="text-zinc-400">
                      Average Score
                    </p>

                    <h2 className="text-3xl font-bold text-blue-400">
                      {averageSprintScore}
                    </h2>

                  </div>

                  {/* BEST COMBO */}

                  <div>

                    <p className="text-zinc-400">
                      Best Combo
                    </p>

                    <h2 className="text-3xl font-bold text-orange-400">
                      🔥{" "}
                      {
                        currentUser.stats
                          .mathSpirit
                          .bestCombo
                      }
                    </h2>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          AVATAR MODAL
      ===================================================== */}

      {avatarOpen && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/80
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() =>
            setAvatarOpen(false)
          }
        >

          <div
            className="
              w-full
              max-w-3xl
              max-h-[90vh]
              overflow-y-auto
              bg-zinc-950
              border
              border-zinc-800
              rounded-3xl
              p-6
              md:p-8
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-center justify-between mb-7">

              <div>

                <p className="text-green-400 text-xs uppercase tracking-widest font-bold">
                  Profile
                </p>

                <h2 className="text-3xl font-black text-white mt-1">
                  Choose your avatar
                </h2>

                <p className="text-zinc-500 mt-1">
                  Bajargan achievementlaringiz orqali yangi avatarlarni oching.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setAvatarOpen(false)
                }
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-zinc-900
                  border
                  border-zinc-800
                  text-zinc-400
                  hover:text-white
                  hover:border-zinc-600
                  transition
                "
              >
                ✕
              </button>

            </div>

            {/* =================================================
                AVATAR GRID
            ================================================= */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

              {avatars.map(
                (avatar) => {

                  const isSelected =
                    activeAvatar.id ===
                    avatar.id;

                  return (

                    <button
                      key={avatar.id}
                      type="button"
                      disabled={
                        !avatar.unlocked ||
                        loadingAvatar
                      }
                      onClick={() =>
                        changeAvatar(
                          avatar
                        )
                      }
                      className={`
                        relative
                        rounded-2xl
                        border
                        p-3
                        text-left
                        transition-all
                        ${
                          avatar.unlocked
                            ? "cursor-pointer hover:border-green-500 hover:bg-zinc-900"
                            : "cursor-not-allowed opacity-60"
                        }
                        ${
                          isSelected
                            ? "border-green-500 bg-green-500/10"
                            : "border-zinc-800 bg-black"
                        }
                      `}
                    >

                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900">

                        <img
                          src={
                            avatar.image
                          }
                          alt={
                            avatar.name
                          }
                          className={`
                            w-full
                            h-full
                            object-cover
                            rounded-xl
                            ${
                              avatar.unlocked
                                ? ""
                                : "grayscale brightness-50"
                            }
                          `}
                        />

                        {/* =================================================
                            LOCK
                        ================================================= */}

                        {!avatar.unlocked && (

                          <div
                            className="
                              absolute
                              inset-0
                              flex
                              items-center
                              justify-center
                              bg-black/45
                            "
                          >

                            <span className="text-3xl">
                              🔒
                            </span>

                          </div>

                        )}

                        {/* =================================================
                            SELECTED
                        ================================================= */}

                        {isSelected && (

                          <div
                            className="
                              absolute
                              top-2
                              right-2
                              w-7
                              h-7
                              rounded-full
                              bg-green-500
                              text-black
                              flex
                              items-center
                              justify-center
                              font-black
                            "
                          >
                            ✓
                          </div>

                        )}

                      </div>

                      {/* =================================================
                          NAME
                      ================================================= */}

                      <p
                        className={`
                          mt-3
                          font-bold
                          text-sm
                          ${
                            avatar.unlocked
                              ? "text-white"
                              : "text-zinc-500"
                          }
                        `}
                      >
                        {avatar.name}
                      </p>

                      {/* =================================================
                          LOCKED REQUIREMENT
                      ================================================= */}

                      {!avatar.unlocked &&
                        avatar.requirement && (

                          <p className="text-[11px] leading-4 text-zinc-600 mt-1">

                            🔒{" "}
                            {
                              avatar.requirement
                            }

                          </p>

                        )}

                      {/* =================================================
                          UNLOCKED
                      ================================================= */}

                      {avatar.unlocked && (

                        <p className="text-[11px] text-green-400 mt-1">

                          ✓ Unlocked

                        </p>

                      )}

                    </button>

                  );
                }
              )}

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mt-7 pt-5 border-t border-zinc-800">

              <p className="text-sm text-zinc-500 text-center">

                🔓 Achievementlarni
                bajarganingiz sari yangi
                avatarlar ochiladi.

              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
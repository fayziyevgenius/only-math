"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

import {
  getCycleForDate,
  getQuestionForDay,
  type DailyQuestion,
} from "@/lib/dailyQuestions";

/* =========================================================
   TYPES
========================================================= */

type Result = {
  correct: boolean;
  points: number;
  cycle: string;
  cycleName: string;
  cycleDay: number;
  globalPoints: number;
  cyclePoints: number;
  rankUp: boolean;
  oldRank: string;
  newRank: string;
  message: string;
};

type User = {
  username?: string;
  name?: string;
  surname?: string;
  email?: string;

  geniusPoints?: number;
  currentCycleGP?: number;
  streak?: number;
  title?: string;

  avatar?: string;
};

/* =========================================================
   HELPERS
========================================================= */

function getTashkentDateKey(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(
    new Date()
  );

  const year =
    parts.find(
      (part) => part.type === "year"
    )?.value ?? "";

  const month =
    parts.find(
      (part) => part.type === "month"
    )?.value ?? "";

  const day =
    parts.find(
      (part) => part.type === "day"
    )?.value ?? "";

  return `${year}-${month}-${day}`;
}

function getCategoryLabel(
  category: DailyQuestion["category"]
): string {
  if (category === "certificate") {
    return "Certificate";
  }

  if (category === "olympiad") {
    return "Olympiad";
  }

  return "SAT";
}

function getCategoryIcon(
  category: DailyQuestion["category"]
): string {
  if (category === "certificate") {
    return "📜";
  }

  if (category === "olympiad") {
    return "🏆";
  }

  return "📐";
}

function getCycleIcon(
  cycle: "genesis" | "independence"
): string {
  return cycle === "genesis"
    ? "🌱"
    : "🇺🇿";
}

/* =========================================================
   GET LOGGED USERNAME
========================================================= */

function getStoredUsername(): string | null {
  /*
   * 1. Avval eski username keyni tekshiramiz.
   */

  const directUsername =
    localStorage.getItem("username");

  if (
    directUsername &&
    directUsername.trim()
  ) {
    return directUsername.trim();
  }

  /*
   * 2. Agar username key bo'lmasa,
   * currentUser ichidan olamiz.
   */

  const currentUserData =
    localStorage.getItem(
      "currentUser"
    );

  if (!currentUserData) {
    return null;
  }

  try {
    const currentUser =
      JSON.parse(currentUserData);

    const username =
      currentUser?.username;

    if (
      username &&
      String(username).trim()
    ) {
      const cleanUsername =
        String(username).trim();

      /*
       * Keyingi sahifalar uchun ham saqlab qo'yamiz.
       */

      localStorage.setItem(
        "username",
        cleanUsername
      );

      return cleanUsername;
    }
  } catch (error) {
    console.error(
      "Failed to parse currentUser:",
      error
    );
  }

  return null;
}

/* =========================================================
   GET COMPLETED DAYS
========================================================= */

function getCompletedDays(
  cycle: "genesis" | "independence"
): number[] {
  const storageKey =
    cycle === "genesis"
      ? "daily-genesis-completed"
      : "daily-independence-completed";

  const raw =
    localStorage.getItem(
      storageKey
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed
        .map(Number)
        .filter(
          (day) =>
            Number.isInteger(day) &&
            day >= 1 &&
            day <= 14
        );
    }
  } catch (error) {
    console.error(
      "Failed to parse completed days:",
      error
    );
  }

  return [];
}

/* =========================================================
   PAGE
========================================================= */

export default function DailyPage() {
  /* =======================================================
     STATE
  ======================================================= */

  const [username, setUsername] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<Result | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [todayKey, setTodayKey] =
    useState("");

  const [completedDays, setCompletedDays] =
    useState<number[]>([]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function initializeDaily() {
      try {
        /* =================================================
           GET USERNAME
        ================================================= */

        const storedUsername =
          getStoredUsername();

        if (!storedUsername) {
          if (mounted) {
            setUsername(null);
            setLoading(false);
          }

          return;
        }

        if (mounted) {
          setUsername(
            storedUsername
          );
        }

        /* =================================================
           TODAY
        ================================================= */

        const dateKey =
          getTashkentDateKey();

        if (mounted) {
          setTodayKey(dateKey);
        }

        /* =================================================
           ACTIVE CYCLE
        ================================================= */

        const activeCycle =
          getCycleForDate(
            dateKey
          );

        /* =================================================
           COMPLETED DAYS
        ================================================= */

        if (activeCycle) {
          const days =
            getCompletedDays(
              activeCycle.cycle
            );

          if (mounted) {
            setCompletedDays(days);
          }
        }

        /* =================================================
           LOAD USER FROM SERVER
        ================================================= */

        const res =
          await fetch(
            "/api/me",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                username:
                  storedUsername,
              }),

              cache: "no-store",
            }
          );

        let data: any = null;

        try {
          data =
            await res.json();
        } catch {
          data = null;
        }

        /* =================================================
           SERVER ERROR
        ================================================= */

        if (!res.ok) {
          console.error(
            "========== FAILED TO LOAD USER =========="
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
            "Username:",
            storedUsername
          );

          console.error(
            "Response:",
            data
          );

          console.error(
            "=========================================="
          );

          if (mounted) {
            setError(
              data?.error ||
                `Failed to load user (${res.status}).`
            );
          }

          return;
        }

        /* =================================================
           SUCCESS
        ================================================= */

        if (!data) {
          if (mounted) {
            setError(
              "Server returned empty user data."
            );
          }

          return;
        }

        if (mounted) {
          setUser(data);
        }

        /*
         * currentUser ni serverdagi eng yangi
         * ma'lumot bilan yangilaymiz.
         */

        localStorage.setItem(
          "currentUser",
          JSON.stringify(data)
        );

        /*
         * username keyni ham saqlaymiz.
         */

        if (data?.username) {
          localStorage.setItem(
            "username",
            String(data.username)
          );

          if (mounted) {
            setUsername(
              String(data.username)
            );
          }
        }
      } catch (err) {
        console.error(
          "========== DAILY INITIALIZATION ERROR =========="
        );

        console.error(err);

        console.error(
          "================================================="
        );

        if (mounted) {
          setError(
            "Failed to load Daily Challenge."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeDaily();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     ACTIVE CYCLE
  ======================================================= */

  const activeCycle =
    useMemo(() => {
      if (!todayKey) {
        return null;
      }

      return getCycleForDate(
        todayKey
      );
    }, [todayKey]);

  /* =======================================================
     TODAY QUESTION
  ======================================================= */

  const question =
    useMemo(() => {
      if (!activeCycle) {
        return null;
      }

      return getQuestionForDay(
        activeCycle.cycle,
        activeCycle.day
      );
    }, [activeCycle]);

  /* =======================================================
     TODAY COMPLETED
  ======================================================= */

  const todayCompleted =
    activeCycle
      ? completedDays.includes(
          activeCycle.day
        )
      : false;

  /* =======================================================
     PROGRESS
  ======================================================= */

  const progressPercent =
    activeCycle
      ? Math.round(
          (activeCycle.day / 14) *
            100
        )
      : 0;

  /* =======================================================
     SAVE COMPLETED DAY
  ======================================================= */

  function saveCompletedDay(
    cycle:
      | "genesis"
      | "independence",
    day: number
  ) {
    const storageKey =
      cycle === "genesis"
        ? "daily-genesis-completed"
        : "daily-independence-completed";

    const current =
      getCompletedDays(cycle);

    if (!current.includes(day)) {
      const updated = [
        ...current,
        day,
      ].sort(
        (a, b) => a - b
      );

      localStorage.setItem(
        storageKey,
        JSON.stringify(updated)
      );

      setCompletedDays(updated);
    }
  }

  /* =======================================================
     SUBMIT ANSWER
  ======================================================= */

  async function handleSubmit() {
    if (
      !username ||
      !question ||
      !activeCycle ||
      !selectedAnswer ||
      submitting ||
      todayCompleted
    ) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/daily",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username,
              answer:
                selectedAnswer,
            }),

            cache: "no-store",
          }
        );

      let data: any = null;

      try {
        data =
          await res.json();
      } catch {
        data = null;
      }

      /* =================================================
         ERROR
      ================================================= */

      if (!res.ok) {
        console.error(
          "========== DAILY SUBMIT ERROR =========="
        );

        console.error(
          "Status:",
          res.status
        );

        console.error(
          "Response:",
          data
        );

        console.error(
          "========================================"
        );

        setError(
          data?.error ||
            `Failed to submit answer (${res.status}).`
        );

        return;
      }

      /* =================================================
         RESULT
      ================================================= */

      const resultData: Result = {
        correct:
          Number(data?.correct) === 1,

        points:
          Number(
            data?.points
          ) || 0,

        cycle:
          data?.cycle || "",

        cycleName:
          data?.cycleName || "",

        cycleDay:
          Number(
            data?.cycleDay
          ) || activeCycle.day,

        globalPoints:
          Number(
            data?.globalPoints
          ) || 0,

        cyclePoints:
          Number(
            data?.cyclePoints
          ) || 0,

        rankUp:
          Boolean(
            data?.rankUp
          ),

        oldRank:
          data?.oldRank ||
          "🌱 Beginner",

        newRank:
          data?.newRank ||
          "🌱 Beginner",

        message:
          data?.message ||
          "",
      };

      setResult(
        resultData
      );

      /* =================================================
         UPDATE USER STATE
      ================================================= */

      setUser((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,

          geniusPoints:
            resultData.globalPoints,

          currentCycleGP:
            resultData.cyclePoints,

          title:
            resultData.newRank,
        };
      });

      /* =================================================
         UPDATE LOCAL STORAGE
      ================================================= */

      const currentUserData =
        localStorage.getItem(
          "currentUser"
        );

      if (currentUserData) {
        try {
          const currentUser =
            JSON.parse(
              currentUserData
            );

          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...currentUser,

              geniusPoints:
                resultData.globalPoints,

              currentCycleGP:
                resultData.cyclePoints,

              title:
                resultData.newRank,
            })
          );
        } catch (error) {
          console.error(
            "Failed to update currentUser:",
            error
          );
        }
      }

      /* =================================================
         SAVE COMPLETED DAY
      ================================================= */

      saveCompletedDay(
        activeCycle.cycle,
        activeCycle.day
      );

      /* =================================================
         CLEAR SELECTED ANSWER
      ================================================= */

      setSelectedAnswer(null);

      /* =================================================
         CONFETTI
      ================================================= */

      if (resultData.correct) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: {
            y: 0.65,
          },
        });
      }
    } catch (err) {
      console.error(
        "Daily submit error:",
        err
      );

      setError(
        "Server Error. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center px-6">

          <div className="w-10 h-10 border-4 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-zinc-400">
            Loading Daily Challenge...
          </p>

        </div>
      </main>
    );
  }

  /* =======================================================
     NO USER
  ======================================================= */

  if (!username) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">

        <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">

          <div className="text-5xl mb-5">
            🔐
          </div>

          <h1 className="text-2xl font-black">
            Please log in
          </h1>

          <p className="text-zinc-400 mt-2">
            You need to log in to access
            the Daily Challenge.
          </p>

        </div>

      </main>
    );
  }

  /* =======================================================
     NO ACTIVE CYCLE
  ======================================================= */

  if (!activeCycle) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white px-4 py-10">

        <div className="max-w-3xl mx-auto">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">

            <div className="text-5xl mb-5">
              📅
            </div>

            <h1 className="text-2xl font-black">
              No Active Daily Challenge
            </h1>

            <p className="text-zinc-400 mt-3">
              There is no active Daily
              Challenge today.
            </p>

          </div>

        </div>

      </main>
    );
  }

  /* =======================================================
     QUESTION NOT FOUND
  ======================================================= */

  if (!question) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white px-4 py-10">

        <div className="max-w-3xl mx-auto">

          <div className="rounded-3xl border border-red-900/50 bg-red-950/20 p-8 text-center">

            <div className="text-5xl mb-5">
              ⚠️
            </div>

            <h1 className="text-2xl font-black">
              Question Not Configured
            </h1>

            <p className="text-zinc-400 mt-3">
              Today's Daily Challenge
              question has not been
              configured yet.
            </p>

          </div>

        </div>

      </main>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-3 sm:px-5 py-5 sm:py-8">

      <div className="max-w-5xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-2xl">
                {getCycleIcon(
                  activeCycle.cycle
                )}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Daily Challenge
              </h1>

            </div>

            <p className="text-zinc-500 text-sm mt-1">
              {activeCycle.name}
            </p>

          </div>

          {/* USER GP */}

          <div className="flex items-center gap-3">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">

              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Global GP
              </p>

              <p className="text-lg font-black">
                {Number(
                  user?.geniusPoints ||
                    0
                )}
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">

              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Cycle GP
              </p>

              <p className="text-lg font-black">
                {Number(
                  user?.currentCycleGP ||
                    0
                )}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            CYCLE CARD
        ================================================= */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Current Cycle
              </p>

              <h2 className="text-xl sm:text-2xl font-black mt-1">

                {getCycleIcon(
                  activeCycle.cycle
                )}{" "}

                {activeCycle.name}

              </h2>

              <p className="text-zinc-500 text-sm mt-1">
                Day {activeCycle.day} of 14
              </p>

            </div>

            <div className="text-left sm:text-right">

              <p className="text-xs text-zinc-500">
                Progress
              </p>

              <p className="font-black text-lg">
                {progressPercent}%
              </p>

            </div>

          </div>

          {/* PROGRESS */}

          <div className="mt-5 h-2 rounded-full bg-zinc-800 overflow-hidden">

            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
              }}
            />

          </div>

          {/* DAYS */}

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 mt-5">

            {Array.from(
              {
                length: 14,
              },
              (_, index) => {

                const day =
                  index + 1;

                const completed =
                  completedDays.includes(
                    day
                  );

                const current =
                  day ===
                  activeCycle.day;

                return (
                  <div
                    key={day}
                    className={`
                      aspect-square
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      text-xs
                      sm:text-sm
                      font-bold
                      border
                      transition
                      ${
                        current
                          ? "bg-white text-black border-white"
                          : completed
                          ? "bg-zinc-800 text-white border-zinc-700"
                          : "bg-zinc-950 text-zinc-600 border-zinc-800"
                      }
                    `}
                  >
                    {completed
                      ? "✓"
                      : day}
                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4 text-red-300 text-sm">

            {error}

          </div>
        )}

        {/* =================================================
            QUESTION CARD
        ================================================= */}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 overflow-hidden">

          {/* QUESTION HEADER */}

          <div className="border-b border-zinc-800 px-5 sm:px-7 py-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl">

                  {getCategoryIcon(
                    question.category
                  )}

                </div>

                <div>

                  <p className="font-black">
                    {getCategoryLabel(
                      question.category
                    )}
                  </p>

                  <p className="text-xs text-zinc-500">
                    Day {activeCycle.day}
                  </p>

                </div>

              </div>

              <div className="rounded-xl border border-zinc-800 px-3 py-2">

                <span className="text-sm font-bold">
                  +{question.points} GP
                </span>

              </div>

            </div>

          </div>

          {/* QUESTION */}

          <div className="px-5 sm:px-7 py-7">

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-line">
              {question.question}
            </h2>

            {/* TABLE */}

            {question.table && (
              <div className="mt-6 overflow-x-auto">

                <table className="w-full max-w-xl border-collapse text-sm">

                  <thead>

                    <tr>

                      {question.table.headers.map(
                        (header) => (
                          <th
                            key={header}
                            className="border border-zinc-700 bg-zinc-800 px-4 py-3 text-left"
                          >
                            {header}
                          </th>
                        )
                      )}

                    </tr>

                  </thead>

                  <tbody>

                    {question.table.rows.map(
                      (
                        row,
                        rowIndex
                      ) => (
                        <tr
                          key={
                            rowIndex
                          }
                        >

                          {row.map(
                            (
                              value,
                              cellIndex
                            ) => (
                              <td
                                key={
                                  cellIndex
                                }
                                className="border border-zinc-700 px-4 py-3"
                              >
                                {value}
                              </td>
                            )
                          )}

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

            {/* ANSWERS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">

              {question.options.map(
                (
                  option,
                  index
                ) => {

                  const letter =
                    String.fromCharCode(
                      65 + index
                    );

                  const selected =
                    selectedAnswer ===
                    option;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={
                        todayCompleted ||
                        submitting
                      }
                      onClick={() =>
                        setSelectedAnswer(
                          option
                        )
                      }
                      className={`
                        group
                        w-full
                        text-left
                        rounded-2xl
                        border
                        px-4
                        py-4
                        transition-all
                        ${
                          selected
                            ? "border-white bg-white text-black"
                            : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                        }
                        ${
                          todayCompleted
                            ? "cursor-default opacity-80"
                            : "cursor-pointer"
                        }
                      `}
                    >

                      <div className="flex items-center gap-4">

                        <span
                          className={`
                            w-9
                            h-9
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            font-black
                            text-sm
                            ${
                              selected
                                ? "bg-black text-white"
                                : "bg-zinc-800 text-zinc-300"
                            }
                          `}
                        >
                          {letter}
                        </span>

                        <span className="font-semibold">
                          {option}
                        </span>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

            {/* SUBMIT */}

            <button
              type="button"
              disabled={
                !selectedAnswer ||
                submitting ||
                todayCompleted
              }
              onClick={
                handleSubmit
              }
              className="
                w-full
                mt-6
                rounded-2xl
                bg-white
                text-black
                py-4
                font-black
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:bg-zinc-200
              "
            >

              {todayCompleted
                ? "✓ Completed"
                : submitting
                ? "Submitting..."
                : "Submit Answer"}

            </button>

          </div>

        </div>

        {/* =================================================
            COMPLETED MESSAGE
        ================================================= */}

        {todayCompleted &&
          !result && (
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center">

              <div className="text-4xl mb-3">
                ✅
              </div>

              <h3 className="text-xl font-black">
                Today's challenge is
                completed.
              </h3>

              <p className="text-zinc-500 text-sm mt-2">
                Come back tomorrow for
                the next question.
              </p>

            </div>
          )}

        {/* =================================================
            RESULT MODAL
        ================================================= */}

        {result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() =>
                setResult(null)
              }
            />

            <div className="relative w-full max-w-md rounded-3xl border border-zinc-700 bg-zinc-900 p-7 shadow-2xl">

              {/* RESULT ICON */}

              <div className="text-center">

                <div className="text-6xl">
                  {result.correct
                    ? "🎉"
                    : "😔"}
                </div>

                <h2 className="text-2xl font-black mt-4">
                  {result.correct
                    ? "Correct!"
                    : "Incorrect"}
                </h2>

                <p className="text-zinc-500 mt-2">
                  {result.message}
                </p>

              </div>

              {/* GP */}

              <div className="grid grid-cols-2 gap-3 mt-7">

                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">

                  <p className="text-xs text-zinc-500">
                    Global GP
                  </p>

                  <p className="text-2xl font-black mt-1">
                    {result.globalPoints}
                  </p>

                </div>

                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">

                  <p className="text-xs text-zinc-500">
                    Cycle GP
                  </p>

                  <p className="text-2xl font-black mt-1">
                    {result.cyclePoints}
                  </p>

                </div>

              </div>

              {/* CYCLE */}

              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 mt-3">

                <p className="text-xs text-zinc-500">
                  Cycle
                </p>

                <p className="text-white font-black mt-1">

                  {result.cycle ===
                  "genesis"
                    ? "🌱 Genesis Cycle"
                    : "🇺🇿 Independence Cycle"}

                  {" · Day "}

                  {result.cycleDay}

                </p>

              </div>

              {/* RANK UP */}

              {result.rankUp && (
                <div className="mt-4 rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-center">

                  <p className="text-xs text-zinc-400 uppercase tracking-wider">
                    Rank Up!
                  </p>

                  <p className="font-black text-lg mt-1">
                    {result.newRank}
                  </p>

                </div>
              )}

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setResult(null)
                }
                className="w-full mt-6 rounded-2xl bg-white text-black py-4 font-black hover:bg-zinc-200 transition"
              >
                Continue
              </button>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import RankUpModal from "@/app/components/RankUpModal";

type CycleTheme = "genesis" | "independence";

type Cycle = {
  name: string;
  number: number;
  start: string;
  end: string;
  theme: CycleTheme;
};

type Question = {
  id: number;
  question: string;
  options: string[];
  points: number;
  image?: string;
};

type Result = {
  success: boolean;
  points: number;
  correct: number;
  incorrect: number;
  total: number;
  rankUp: boolean;
  oldRank: string;
  newRank: string;
  message: string;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const CYCLES: Cycle[] = [
  {
    name: "Genesis Cycle",
    number: 1,
    start: "2026-08-17",
    end: "2026-08-30",
    theme: "genesis",
  },
  {
    name: "Independence Cycle",
    number: 2,
    start: "2026-08-31",
    end: "2026-09-13",
    theme: "independence",
  },
];

function getStartDate(cycle: Cycle) {
  return new Date(`${cycle.start}T00:00:00+05:00`);
}

function getEndDate(cycle: Cycle) {
  return new Date(`${cycle.end}T23:59:59+05:00`);
}

function getCurrentCycle(): Cycle | null {
  const now = new Date();

  for (const cycle of CYCLES) {
    const start = getStartDate(cycle);
    const end = getEndDate(cycle);

    if (now >= start && now <= end) {
      return cycle;
    }
  }

  return null;
}

function getNextCycle(): Cycle | null {
  const now = new Date();

  for (const cycle of CYCLES) {
    const start = getStartDate(cycle);

    if (now < start) {
      return cycle;
    }
  }

  return null;
}

function getCountdown(target: Date): Countdown {
  const diff = Math.max(0, target.getTime() - Date.now());

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function formatCountdown(countdown: Countdown) {
  return `${countdown.days} Days ${countdown.hours} Hours ${countdown.minutes} Minutes`;
}

function MathText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];

  const regex =
    /(\^\([^)]*\)|\^[A-Za-z0-9]+)|(\b-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?\b)/g;

  let lastIndex = 0;

  text.replace(
    regex,
    (match, exponent, fraction, offset) => {
      const index = Number(offset);

      if (index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, index)}
          </span>
        );
      }

      if (exponent) {
        let value = exponent.slice(1);

        if (
          value.startsWith("(") &&
          value.endsWith(")")
        ) {
          value = value.slice(1, -1);
        }

        parts.push(
          <sup
            key={`sup-${index}`}
            className="text-[0.7em] leading-none relative -top-[0.15em]"
          >
            {value}
          </sup>
        );
      } else if (fraction) {
        const [numerator, denominator] =
          fraction.split("/");

        parts.push(
          <span
            key={`fraction-${index}`}
            className="inline-flex flex-col align-middle mx-1 leading-none text-center"
          >
            <span className="px-1 border-b border-zinc-400">
              {numerator}
            </span>

            <span className="px-1">
              {denominator}
            </span>
          </span>
        );
      }

      lastIndex = index + match.length;

      return match;
    }
  );

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-end-${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return <>{parts}</>;
}

function CountdownBox({
  title,
  countdown,
  cycleName,
}: {
  title: string;
  countdown: Countdown;
  cycleName: string;
}) {
  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <p className="text-zinc-500 text-sm text-center">
        {title}
      </p>

      <h3 className="text-green-400 font-bold text-lg sm:text-xl text-center mt-2">
        {cycleName}
      </h3>

      <div className="grid grid-cols-4 gap-2 mt-5">
        <div className="bg-black rounded-xl p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-white">
            {countdown.days}
          </p>
          <p className="text-[10px] sm:text-xs text-zinc-500 mt-1">
            DAYS
          </p>
        </div>

        <div className="bg-black rounded-xl p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-white">
            {countdown.hours}
          </p>
          <p className="text-[10px] sm:text-xs text-zinc-500 mt-1">
            HOURS
          </p>
        </div>

        <div className="bg-black rounded-xl p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-white">
            {countdown.minutes}
          </p>
          <p className="text-[10px] sm:text-xs text-zinc-500 mt-1">
            MINUTES
          </p>
        </div>

        <div className="bg-black rounded-xl p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-white">
            {countdown.seconds}
          </p>
          <p className="text-[10px] sm:text-xs text-zinc-500 mt-1">
            SECONDS
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OlympiadPage() {
  const [cycle, setCycle] =
    useState<Cycle | null>(null);

  const [nextCycle, setNextCycle] =
    useState<Cycle | null>(null);

  const [countdown, setCountdown] =
    useState<Countdown>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  const [nextCycleCountdown, setNextCycleCountdown] =
    useState<Countdown>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [questionsLoading, setQuestionsLoading] =
    useState(true);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<Result | null>(null);

  const [completed, setCompleted] =
    useState(false);

  const [showRankUp, setShowRankUp] =
    useState(false);

  const [rankData, setRankData] =
    useState<{
      oldRank: string;
      newRank: string;
    } | null>(null);

  const successSound =
    useRef<HTMLAudioElement | null>(null);

  const failSound =
    useRef<HTMLAudioElement | null>(null);

  const perfectSound =
    useRef<HTMLAudioElement | null>(null);

  const rankupSound =
    useRef<HTMLAudioElement | null>(null);

  /*
  =========================================================
  INITIALIZE CYCLE + COUNTDOWN
  =========================================================
  */

  useEffect(() => {
    function updateCycle() {
      const current = getCurrentCycle();
      const next = getNextCycle();

      setCycle(current);
      setNextCycle(next);

      /*
      If a cycle is currently active,
      countdown = time until this cycle ends.
      */

      if (current) {
        const end = getEndDate(current);

        setCountdown(
          getCountdown(end)
        );
      }

      /*
      If there is no active cycle,
      countdown = time until next cycle starts.
      */

      if (!current && next) {
        const start = getStartDate(next);

        setCountdown(
          getCountdown(start)
        );
      }

      /*
      Countdown for next cycle.
      */

      if (next) {
        const start = getStartDate(next);

        setNextCycleCountdown(
          getCountdown(start)
        );
      }
    }

    updateCycle();

    const interval =
      setInterval(updateCycle, 1000);

    successSound.current =
      new Audio("/sounds/success.mp3");

    failSound.current =
      new Audio("/sounds/fail.mp3");

    perfectSound.current =
      new Audio("/sounds/perfect.mp3");

    rankupSound.current =
      new Audio("/sounds/rankup.mp3");

    return () => {
      clearInterval(interval);

      successSound.current?.pause();
      failSound.current?.pause();
      perfectSound.current?.pause();
      rankupSound.current?.pause();
    };
  }, []);

  /*
  =========================================================
  LOAD QUESTIONS
  =========================================================
  */

  useEffect(() => {
    if (!cycle) {
      setQuestions([]);
      setQuestionsLoading(false);
      return;
    }

    async function loadQuestions() {
      try {
        setQuestionsLoading(true);

        const res = await fetch(
          "/api/olympiad/questions",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to load Olympiad questions."
          );
        }

        const data =
          await res.json();

        if (
          !Array.isArray(
            data.questions
          )
        ) {
          throw new Error(
            "Invalid questions format."
          );
        }

        setQuestions(
          data.questions
        );
      } catch (error) {
        console.error(
          "Olympiad questions error:",
          error
        );

        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    }

    loadQuestions();
  }, [cycle]);

  /*
  =========================================================
  CURRENT QUESTION
  =========================================================
  */

  const question =
    questions[currentQuestion];

  const selectedAnswer = question
    ? answers[question.id] || ""
    : "";

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) /
          questions.length) *
        100
      : 0;

  /*
  =========================================================
  SELECT ANSWER
  =========================================================
  */

  function selectAnswer(
    answer: string
  ) {
    if (!question) return;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: answer,
    }));
  }

  /*
  =========================================================
  NEXT QUESTION
  =========================================================
  */

  function nextQuestion() {
    if (!selectedAnswer) {
      alert(
        "Please select an answer."
      );
      return;
    }

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /*
  =========================================================
  PREVIOUS QUESTION
  =========================================================
  */

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (prev) => prev - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /*
  =========================================================
  SUBMIT
  =========================================================
  */

  async function handleSubmit() {
    const currentUser =
      localStorage.getItem(
        "currentUser"
      );

    if (!currentUser) {
      alert(
        "Please sign in first."
      );
      return;
    }

    if (
      Object.keys(answers).length !==
      questions.length
    ) {
      alert(
        "Please answer all questions."
      );
      return;
    }

    let user: any;

    try {
      user = JSON.parse(
        currentUser
      );
    } catch {
      alert(
        "Your session is invalid. Please sign in again."
      );
      return;
    }

    if (!user?.username) {
      alert(
        "Please sign in first."
      );
      return;
    }

    if (!cycle) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/olympiad",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username:
              user.username,

            answers,

            cycle:
              cycle.theme,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        if (
          data.error ===
          "You have already completed this Olympiad test."
        ) {
          setCompleted(true);
          setLoading(false);
          return;
        }

        alert(
          data.error ||
            "Something went wrong."
        );

        setLoading(false);
        return;
      }

      setResult(data);

      if (
        data.correct ===
        questions.length
      ) {
        perfectSound.current
          ?.play()
          .catch(() => {});

        confetti({
          particleCount: 220,
          spread: 100,
          origin: {
            y: 0.6,
          },
        });
      } else if (
        data.correct > 0
      ) {
        successSound.current
          ?.play()
          .catch(() => {});
      } else {
        failSound.current
          ?.play()
          .catch(() => {});
      }

      setAnswers({});
      setCurrentQuestion(0);
    } catch (error) {
      console.error(
        "Olympiad submit error:",
        error
      );

      alert("Server Error.");
    }

    setLoading(false);
  }

  /*
  =========================================================
  LOADING
  =========================================================
  */

  if (questionsLoading) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto mb-5" />

          <p className="text-zinc-400 text-base sm:text-lg">
            Loading Olympiad questions...
          </p>
        </div>
      </div>
    );
  }

  /*
  =========================================================
  BEFORE / AFTER CYCLE
  =========================================================
  */

  if (!cycle) {
    if (!nextCycle) {
      return (
        <div className="w-full min-h-[500px] flex items-center justify-center px-4">
          <div className="text-center max-w-lg">
            <div className="text-5xl mb-5">
              🏆
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Olympiad
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-7">
              There is currently no
              upcoming Olympiad cycle.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full min-h-[500px] flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">
          <div className="text-5xl mb-5">
            🏆
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Olympiad
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-7">
            The next Olympiad cycle
            has not started yet.
          </p>

          <CountdownBox
            title="Next Olympiad"
            cycleName={
              nextCycle.name
            }
            countdown={countdown}
          />

          <p className="text-zinc-600 text-xs mt-4">
            The countdown updates
            automatically.
          </p>
        </div>
      </div>
    );
  }

  /*
  =========================================================
  NO QUESTIONS
  =========================================================
  */

  if (questions.length === 0) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">
          <div className="text-5xl mb-5">
            🏆
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {cycle.name}
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-7">
            Questions for this cycle
            are not available yet.
          </p>

          <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Cycle ends in
            </p>

            <p className="text-green-400 font-bold text-lg mt-2">
              {formatCountdown(
                countdown
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  /*
  =========================================================
  MAIN PAGE
  =========================================================
  */

  return (
    <div className="w-full max-w-5xl pb-16 sm:pb-20">

      {/* HEADER */}

      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">
              Olympiad
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base">
              Solve the questions below
              and earn Genius Points.
            </p>
          </div>

          {/* CURRENT CYCLE */}

          <div
            className={`self-start px-4 py-2 rounded-xl border text-sm font-bold ${
              cycle.theme ===
              "independence"
                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                : "bg-green-500/10 border-green-500/20 text-green-400"
            }`}
          >
            {cycle.theme ===
            "independence"
              ? "🇺🇿 Independence Cycle"
              : "✦ Genesis Cycle"}
          </div>
        </div>

        {/* CURRENT CYCLE COUNTDOWN */}

        <div className="mt-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                Current Cycle
              </p>

              <p className="text-white font-bold text-sm sm:text-base mt-1">
                {cycle.name}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-zinc-500 text-xs">
                Cycle ends in
              </p>

              <p className="text-green-400 font-bold text-sm sm:text-base mt-1">
                {formatCountdown(
                  countdown
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}

      <div className="mb-5 sm:mb-8">
        <div className="flex justify-between items-center mb-2 sm:mb-3 gap-4">
          <span className="text-zinc-400 text-sm sm:text-base font-medium">
            Question{" "}
            {currentQuestion + 1} /{" "}
            {questions.length}
          </span>

          <span className="text-green-400 text-sm sm:text-base font-bold">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full h-2.5 sm:h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* QUESTION CARD */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">

        {/* CARD HEADER */}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 sm:mb-8">

          <div>
            <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider mb-1.5 sm:mb-2">
              Question{" "}
              {currentQuestion + 1}
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Olympiad Problem
            </h2>
          </div>

          <span className="self-start sm:self-auto bg-green-600 px-4 py-2 rounded-full font-bold text-sm sm:text-base text-white whitespace-nowrap">
            +{question.points} GP
          </span>
        </div>

        {/* QUESTION */}

        <div className="bg-black border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-5 sm:mb-8">

          {/* IMAGE */}

          {question.image && (
            <div className="mb-6 flex justify-center">
              <img
                src={question.image}
                alt={`Question ${question.id} diagram`}
                className="max-w-full h-auto rounded-xl border border-zinc-800"
              />
            </div>
          )}

          {/* TEXT */}

          <div className="text-base sm:text-lg md:text-xl text-white leading-8 md:leading-9 whitespace-pre-line break-words overflow-wrap-anywhere">
            <MathText
              text={
                question.question
              }
            />
          </div>
        </div>

        {/* OPTIONS */}

        <div className="space-y-3 sm:space-y-4">
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
                letter;

              return (
                <button
                  key={`${question.id}-${letter}`}
                  type="button"
                  onClick={() =>
                    selectAnswer(
                      letter
                    )
                  }
                  className={`w-full flex items-start gap-3 sm:gap-4 text-left rounded-xl sm:rounded-2xl border p-3 sm:p-4 md:p-5 transition ${
                    selected
                      ? "border-green-500 bg-green-500/10"
                      : "border-zinc-800 bg-black hover:border-zinc-600"
                  }`}
                >
                  <span
                    className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base ${
                      selected
                        ? "bg-green-500 text-black"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {letter}
                  </span>

                  <span className="flex-1 text-sm sm:text-base md:text-lg text-white leading-7 pt-1 break-words whitespace-pre-line overflow-wrap-anywhere">
                    <MathText
                      text={
                        option
                      }
                    />
                  </span>

                  {selected && (
                    <span className="text-green-400 text-xl font-bold shrink-0">
                      ✓
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* NAVIGATION */}

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-zinc-800 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">

          <button
            type="button"
            onClick={
              previousQuestion
            }
            disabled={
              currentQuestion ===
                0 ||
              loading
            }
            className="w-full sm:w-auto px-5 sm:px-7 py-3 sm:py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm sm:text-base disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          {currentQuestion ===
          questions.length - 1 ? (
            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                loading ||
                !selectedAnswer
              }
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Submitting..."
                : "Submit Olympiad ✓"}
            </button>
          ) : (
            <button
              type="button"
              onClick={
                nextQuestion
              }
              disabled={
                !selectedAnswer
              }
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>

      {/* RESULT MODAL */}

      {result && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-[650px] max-h-[90vh] overflow-y-auto">

            <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">
              🏆 Olympiad Results
            </h1>

            <div className="space-y-4 sm:space-y-5 text-base sm:text-xl">

              <p>
                ⭐ Genius Points:

                <span className="text-green-400 font-bold">
                  {" "}
                  +{result.points}
                </span>
              </p>

              <p>
                ✅ Correct:

                <span className="text-green-400 font-bold">
                  {" "}
                  {result.correct}
                </span>
              </p>

              <p>
                ❌ Incorrect:

                <span className="text-red-400 font-bold">
                  {" "}
                  {result.incorrect}
                </span>
              </p>

              <p>
                📊 Score:

                <span className="text-white font-bold">
                  {" "}
                  {result.correct}
                  {" / "}
                  {result.total}
                </span>
              </p>

              {result.rankUp && (
                <p className="text-yellow-400 font-bold text-center">
                  🎉 Rank Up!

                  <br />

                  <span className="text-sm sm:text-base text-zinc-300">
                    {result.oldRank}
                    {" → "}
                    {result.newRank}
                  </span>
                </p>
              )}

            </div>

            <button
              type="button"
              onClick={() => {

                if (
                  result.rankUp
                ) {
                  setRankData({
                    oldRank:
                      result.oldRank,

                    newRank:
                      result.newRank,
                  });

                  setResult(null);

                  setShowRankUp(
                    true
                  );

                  setTimeout(() => {
                    rankupSound.current
                      ?.play()
                      .catch(
                        () => {}
                      );
                  }, 200);
                } else {
                  setResult(null);
                  setCompleted(true);
                }

              }}
              className="mt-6 sm:mt-8 w-full bg-green-600 hover:bg-green-700 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-xl transition"
            >
              Continue
            </button>

          </div>
        </div>
      )}

      {/* COMPLETED / NEXT CYCLE MODAL */}

      {completed && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-[650px] max-h-[90vh] overflow-y-auto">

            <h1 className="text-2xl sm:text-4xl font-bold text-center mb-5 sm:mb-6">
              🏆 Olympiad Completed
            </h1>

            <p className="text-center text-zinc-300 text-base sm:text-xl leading-8">
              Congratulations! 🎉
              <br />
              You have completed this
              Olympiad test.
            </p>

            {nextCycle ? (
              <CountdownBox
                title="Next Olympiad Cycle"
                cycleName={
                  nextCycle.name
                }
                countdown={
                  nextCycleCountdown
                }
              />
            ) : (
              <div className="mt-6 bg-zinc-800 rounded-2xl p-5 text-center">
                <p className="text-zinc-300">
                  No upcoming cycle
                  is currently
                  scheduled.
                </p>
              </div>
            )}

            <div className="mt-6 p-5 rounded-2xl bg-zinc-800">

              <p className="text-zinc-300 text-sm sm:text-base">
                You can continue
                earning Genius Points
                from:
              </p>

              <div className="mt-4 space-y-2 text-sm sm:text-base">
                <p>📘 SAT</p>
                <p>📚 Certificate</p>
                <p>⚡ Math Sprint</p>
                <p>🧩 Daily Problems</p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setCompleted(false)
              }
              className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 sm:py-4 rounded-xl text-base sm:text-xl font-bold"
            >
              Got it
            </button>

          </div>
        </div>
      )}

      {/* RANK UP MODAL */}

      {showRankUp &&
        rankData && (
          <RankUpModal
            open={
              showRankUp
            }
            oldRank={
              rankData.oldRank
            }
            newRank={
              rankData.newRank
            }
            onClose={() => {
              setShowRankUp(
                false
              );

              setRankData(
                null
              );

              /*
              After rank-up modal closes,
              show next cycle countdown.
              */

              setCompleted(
                true
              );
            }}
          />
        )}

    </div>
  );
}
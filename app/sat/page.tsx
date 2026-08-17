"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import RankUpModal from "@/app/components/RankUpModal";

type Question = {
  id: number;
  question: string;
  options: string[];
  points: number;
  image?: string;
  type?: "image" | "table" | "math";
  table?: {
    headers: string[];
    rows: string[][];
  };
};

type Result = {
  points: number;
  correct: number;
  incorrect: number;
  total: number;
  rankUp?: boolean;
  oldRank?: string;
  newRank?: string;
};

type RankData = {
  oldRank: string;
  newRank: string;
};

type Cycle = "genesis" | "independence";

/* =========================================================
   MATH TEXT
========================================================= */

function MathText({
  text,
  block = false,
}: {
  text: string;
  block?: boolean;
}) {
  if (!text) return null;

  if (block) {
    let math = text.trim();

    if (math.startsWith("\\[") && math.endsWith("\\]")) {
      math = math.slice(2, -2).trim();
    }

    if (math.startsWith("\\(") && math.endsWith("\\)")) {
      math = math.slice(2, -2).trim();
    }

    return (
      <div className="w-full overflow-x-auto py-2">
        <div className="min-w-max text-white">
          <BlockMath math={math} />
        </div>
      </div>
    );
  }

  const hasExplicitMath =
    text.includes("\\(") ||
    text.includes("\\)") ||
    text.includes("\\[") ||
    text.includes("\\]");

  if (!hasExplicitMath) {
    const looksLikeLatex =
      text.includes("\\frac") ||
      text.includes("\\sqrt") ||
      text.includes("\\geq") ||
      text.includes("\\leq") ||
      text.includes("\\cdot") ||
      text.includes("\\times") ||
      text.includes("\\sum") ||
      text.includes("\\log") ||
      text.includes("^") ||
      text.includes("_");

    if (looksLikeLatex) {
      return (
        <span className="inline-block align-middle">
          <InlineMath math={text} />
        </span>
      );
    }

    return <span>{text}</span>;
  }

  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const inlineStart = remaining.indexOf("\\(");
    const blockStart = remaining.indexOf("\\[");

    let start = -1;
    let isBlock = false;

    if (
      inlineStart !== -1 &&
      (blockStart === -1 || inlineStart < blockStart)
    ) {
      start = inlineStart;
    } else if (blockStart !== -1) {
      start = blockStart;
      isBlock = true;
    }

    if (start === -1) {
      result.push(
        <span key={`text-${key++}`}>
          {remaining}
        </span>
      );
      break;
    }

    if (start > 0) {
      result.push(
        <span key={`text-${key++}`}>
          {remaining.slice(0, start)}
        </span>
      );
    }

    const closeToken = isBlock ? "\\]" : "\\)";

    const closeIndex = remaining.indexOf(
      closeToken,
      start + 2
    );

    if (closeIndex === -1) {
      result.push(
        <span key={`text-${key++}`}>
          {remaining.slice(start)}
        </span>
      );
      break;
    }

    const math = remaining.slice(
      start + 2,
      closeIndex
    );

    if (isBlock) {
      result.push(
        <div
          key={`block-${key++}`}
          className="w-full overflow-x-auto my-3"
        >
          <BlockMath math={math} />
        </div>
      );
    } else {
      result.push(
        <span
          key={`inline-${key++}`}
          className="inline-block align-middle"
        >
          <InlineMath math={math} />
        </span>
      );
    }

    remaining = remaining.slice(
      closeIndex + closeToken.length
    );
  }

  return <>{result}</>;
}

/* =========================================================
   OPTION
========================================================= */

function MathOption({
  option,
}: {
  option: string;
}) {
  return (
    <span className="text-base sm:text-lg text-white leading-relaxed">
      <MathText text={option} />
    </span>
  );
}

/* =========================================================
   CYCLE
========================================================= */

function getCurrentCycle(): Cycle | null {
  const now = new Date();

  const genesisStart = new Date(
    "2026-08-17T00:00:00+05:00"
  );

  const independenceStart = new Date(
    "2026-08-31T00:00:00+05:00"
  );

  if (now < genesisStart) {
    return null;
  }

  if (now < independenceStart) {
    return "genesis";
  }

  return "independence";
}

function getNextCycleDate(): Date {
  const now = new Date();

  const genesisStart = new Date(
    "2026-08-17T00:00:00+05:00"
  );

  const independenceStart = new Date(
    "2026-08-31T00:00:00+05:00"
  );

  if (now < genesisStart) {
    return genesisStart;
  }

  if (now < independenceStart) {
    return independenceStart;
  }

  return new Date(
    "2026-09-14T00:00:00+05:00"
  );
}

function getCycleName(
  cycle: Cycle | null
) {
  if (cycle === "genesis") {
    return "Genesis Cycle";
  }

  if (cycle === "independence") {
    return "Independence Cycle";
  }

  return "Next SAT";
}

/* =========================================================
   COUNTDOWN
========================================================= */

function getCountdown(target: Date) {
  const diff =
    target.getTime() - Date.now();

  if (diff <= 0) {
    return "Available now!";
  }

  const days = Math.floor(
    diff / 86400000
  );

  const hours = Math.floor(
    (diff % 86400000) / 3600000
  );

  const minutes = Math.floor(
    (diff % 3600000) / 60000
  );

  return `${days} Days ${hours} Hours ${minutes} Minutes`;
}

/* =========================================================
   PAGE
========================================================= */

export default function SATPage() {
  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  /*
    MUHIM:
    answers endi option text emas,
    A/B/C/D saqlaydi.

    Masalan:
    {
      1: "C",
      2: "A",
      3: "D"
    }
  */
  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [questionsLoading, setQuestionsLoading] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<Result | null>(null);

  const [completed, setCompleted] =
    useState(false);

  const [showRankUp, setShowRankUp] =
    useState(false);

  const [rankData, setRankData] =
    useState<RankData | null>(null);

  const [timeLeft, setTimeLeft] =
    useState("");

  const [cycle, setCycle] =
    useState<Cycle | null>(null);

  const [imageError, setImageError] =
    useState(false);

  const successSound =
    useRef<HTMLAudioElement | null>(null);

  const failSound =
    useRef<HTMLAudioElement | null>(null);

  const perfectSound =
    useRef<HTMLAudioElement | null>(null);

  /* =======================================================
     DETERMINE CYCLE
  ======================================================= */

  useEffect(() => {
    const updateCycle = () => {
      setCycle(getCurrentCycle());
    };

    updateCycle();

    const interval = setInterval(
      updateCycle,
      1000
    );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     COUNTDOWN
  ======================================================= */

  useEffect(() => {
    const updateTimer = () => {
      const nextCycleDate =
        getNextCycleDate();

      setTimeLeft(
        getCountdown(nextCycleDate)
      );
    };

    updateTimer();

    const interval = setInterval(
      updateTimer,
      1000
    );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     LOAD QUESTIONS
  ======================================================= */

  useEffect(() => {
    async function loadQuestions() {
      if (!cycle) {
        setQuestions([]);
        setQuestionsLoading(false);
        return;
      }

      try {
        setQuestionsLoading(true);

        const res = await fetch(
          "/api/sat/questions",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to load SAT questions"
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
            "Invalid questions format"
          );
        }

        setQuestions(
          data.questions
        );
      } catch (error) {
        console.error(
          "SAT questions error:",
          error
        );

        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    }

    loadQuestions();
  }, [cycle]);

  /* =======================================================
     SOUNDS
  ======================================================= */

  useEffect(() => {
    successSound.current =
      new Audio(
        "/sounds/success.mp3"
      );

    failSound.current =
      new Audio(
        "/sounds/fail.mp3"
      );

    perfectSound.current =
      new Audio(
        "/sounds/perfect.mp3"
      );

    if (successSound.current) {
      successSound.current.volume = 0.6;
    }

    if (failSound.current) {
      failSound.current.volume = 0.6;
    }

    if (perfectSound.current) {
      perfectSound.current.volume = 0.8;
    }

    return () => {
      successSound.current?.pause();
      failSound.current?.pause();
      perfectSound.current?.pause();
    };
  }, []);

  /* =======================================================
     CURRENT QUESTION
  ======================================================= */

  const question =
    questions.length > 0
      ? questions[currentQuestion]
      : null;

  /*
    MUHIM:
    selectedAnswer endi "A", "B", "C", "D"
    bo'ladi.
  */
  const selectedAnswer =
    question
      ? answers[question.id]
      : "";

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) /
          questions.length) *
        100
      : 0;

  /* =======================================================
     IMAGE
  ======================================================= */

  function getQuestionImage(
    q: Question
  ): string | null {
    if (q.image) {
      return q.image.split("?")[0];
    }

    return null;
  }

  /* =======================================================
     SELECT ANSWER
  ======================================================= */

  /*
    MUHIM FIX:

    Old:
      selectAnswer(option)

    New:
      selectAnswer("A")
      selectAnswer("B")
      selectAnswer("C")
      selectAnswer("D")
  */

  function selectAnswer(
    letter: string
  ) {
    if (!question) return;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: letter,
    }));
  }

  /* =======================================================
     NEXT
  ======================================================= */

  function nextQuestion() {
    if (!question) return;

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

      setImageError(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /* =======================================================
     PREVIOUS
  ======================================================= */

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (prev) => prev - 1
      );

      setImageError(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

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
      Object.keys(answers)
        .length !==
      questions.length
    ) {
      alert(
        "Please answer all questions."
      );
      return;
    }

    if (!cycle) {
      alert(
        "The SAT cycle is not available yet."
      );
      return;
    }

    let user: {
      username?: string;
    };

    try {
      user =
        JSON.parse(currentUser);
    } catch {
      alert(
        "Invalid user session."
      );
      return;
    }

    if (!user.username) {
      alert(
        "Invalid user session."
      );
      return;
    }

    setLoading(true);

    try {
      /*
        Backendga quyidagidek yuboriladi:

        {
          username: "...",
          answers: {
            1: "C",
            2: "A",
            3: "D"
          },
          cycle: "genesis"
        }

        Bu backenddagi answer key bilan
        to'g'ridan-to'g'ri mos keladi.
      */

      console.log(
        "SAT answers being submitted:",
        answers
      );

      const res = await fetch(
        "/api/sat",
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

            cycle,
          }),
        }
      );

      const data =
        await res.json();

      console.log(
        "SAT result:",
        data
      );

      if (!res.ok) {
        if (
          data.error?.includes(
            "already completed"
          )
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

      setResult({
        points:
          Number(
            data.points
          ) || 0,

        correct:
          Number(
            data.correct
          ) || 0,

        incorrect:
          Number(
            data.incorrect
          ) || 0,

        total:
          Number(
            data.total
          ) ||
          Number(
            data.totalQuestions
          ) ||
          questions.length,

        rankUp:
          data.rankUp,

        oldRank:
          data.oldRank,

        newRank:
          data.newRank,
      });

      /* =====================================================
         SOUNDS
      ===================================================== */

      if (
        data.correct ===
        data.total
      ) {
        perfectSound.current
          ?.play()
          .catch(() => {});

        confetti({
          particleCount: 180,
          spread: 90,
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

      /*
        Natija chiqqandan keyin
        eski answersni tozalaymiz.
      */
      setAnswers({});
      setCurrentQuestion(0);
    } catch (error) {
      console.error(
        "SAT submit error:",
        error
      );

      alert(
        "Server Error."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     BEFORE CYCLE
  ======================================================= */

  if (!cycle) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">

          <div className="text-5xl mb-5">
            🧮
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            SAT is coming soon
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-7">
            The first SAT cycle will begin
            on August 17.
          </p>

          <div className="mt-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-zinc-500 text-sm">
              Genesis Cycle starts in
            </p>

            <p className="text-green-400 font-bold text-xl sm:text-2xl mt-2">
              {timeLeft}
            </p>

          </div>

        </div>
      </div>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (questionsLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center px-4">
        <div className="text-center">

          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-400 text-sm sm:text-base">
            Loading SAT...
          </p>

        </div>
      </div>
    );
  }

  /* =======================================================
     NO QUESTIONS
  ======================================================= */

  if (
    questions.length === 0
  ) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center px-4">
        <div className="text-center max-w-md">

          <div className="text-5xl mb-5">
            🧮
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            SAT unavailable
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-6">
            The SAT questions are
            currently unavailable.
          </p>

          <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">

            <p className="text-zinc-500 text-sm">
              Next Cycle
            </p>

            <p className="text-green-400 font-bold text-lg mt-2">
              {timeLeft}
            </p>

          </div>

        </div>
      </div>
    );
  }

  /* =======================================================
     QUESTION SAFETY
  ======================================================= */

  if (!question) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center px-4">
        <div className="text-center">

          <p className="text-red-400 font-bold">
            Unable to load this question.
          </p>

          <button
            type="button"
            onClick={() =>
              setCurrentQuestion(0)
            }
            className="mt-5 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold"
          >
            Restart
          </button>

        </div>
      </div>
    );
  }

  const questionImage =
    getQuestionImage(question);

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 px-3 sm:px-5">

      {/* HEADER */}

      <div className="mb-5 sm:mb-7">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

          <div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              SAT
            </h1>

            <p className="text-sm sm:text-base text-gray-400">
              Solve the questions below and earn Genius Points.
            </p>

          </div>

          <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-green-400 font-bold uppercase">
            {getCycleName(cycle)}
          </span>

        </div>

      </div>

      {/* PROGRESS */}

      <div className="mb-5 sm:mb-7">

        <div className="flex justify-between items-center mb-2">

          <span className="text-xs sm:text-sm text-gray-400 font-medium">
            Question {currentQuestion + 1} /{" "}
            {questions.length}
          </span>

          <span className="text-xs sm:text-sm text-green-400 font-bold">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* QUESTION CARD */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-7">

        {/* QUESTION HEADER */}

        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">

          <div>

            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">
              Question {currentQuestion + 1}
            </p>

            <h2 className="text-base sm:text-xl font-bold text-white">
              Solve the problem
            </h2>

          </div>

          <span className="shrink-0 bg-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white">
            +{question.points} GP
          </span>

        </div>

        {/* QUESTION */}

        <div className="bg-black border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-4">

          <div className="text-base sm:text-lg md:text-xl text-white leading-relaxed overflow-x-auto">

            <MathText
              text={
                question.question
              }
            />

          </div>

        </div>

        {/* IMAGE */}

        {questionImage &&
          !imageError && (
            <div className="mb-5">

              <div className="bg-black border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden flex justify-center items-center p-2 sm:p-3">

                <img
                  src={questionImage}
                  alt={`SAT question ${question.id} diagram`}
                  className="block w-auto max-w-full max-h-[280px] sm:max-h-[380px] md:max-h-[450px] object-contain rounded-lg"
                  onError={() =>
                    setImageError(true)
                  }
                />

              </div>

              <p className="text-center text-[10px] sm:text-xs text-zinc-600 mt-2">
                Diagram for Question{" "}
                {question.id}
              </p>

            </div>
          )}

        {questionImage &&
          imageError && (
            <div className="mb-5 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-center">

              <p className="text-red-400 text-sm font-semibold">
                Diagram could not be loaded.
              </p>

            </div>
          )}

        {/* =================================================
            OPTIONS
        ================================================= */}

        <div className="space-y-2.5 sm:space-y-3">

          {question.options.map(
            (
              option,
              index
            ) => {

              /*
                A = 0
                B = 1
                C = 2
                D = 3
              */

              const letter =
                String.fromCharCode(
                  65 + index
                );

              /*
                MUHIM FIX:

                answers ichida option text emas,
                A/B/C/D turadi.
              */

              const selected =
                selectedAnswer ===
                letter;

              return (
                <button
                  key={`${question.id}-${index}`}
                  type="button"
                  onClick={() =>
                    selectAnswer(
                      letter
                    )
                  }
                  className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 flex items-center gap-3 sm:gap-4 overflow-hidden ${
                    selected
                      ? "border-green-500 bg-green-500/10"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-800"
                  }`}
                >

                  {/* LETTER */}

                  <span
                    className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-base ${
                      selected
                        ? "bg-green-500 text-black"
                        : "bg-zinc-800 text-gray-300"
                    }`}
                  >
                    {letter}
                  </span>

                  {/* OPTION */}

                  <span className="min-w-0 flex-1 overflow-x-auto text-white">

                    <MathOption
                      option={
                        option
                      }
                    />

                  </span>

                  {/* CHECK */}

                  {selected && (
                    <span className="shrink-0 text-green-400 text-lg sm:text-xl">
                      ✓
                    </span>
                  )}

                </button>
              );
            }
          )}

        </div>

        {/* NAVIGATION */}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between mt-6 sm:mt-8 gap-2.5">

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
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm sm:text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed transition"
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
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Submitting..."
                : "Submit Test ✓"}
            </button>

          ) : (

            <button
              type="button"
              onClick={
                nextQuestion
              }
              disabled={
                !selectedAnswer ||
                loading
              }
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next Question →
            </button>

          )}

        </div>

      </div>

      {/* ===================================================
          RESULT MODAL
      =================================================== */}

      {result && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5">

          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto">

            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              🏆 SAT Results
            </h1>

            <div className="space-y-3 text-base sm:text-lg">

              <p>
                ⭐ Genius Points:{" "}
                <span className="text-green-400 font-bold">
                  +{result.points}
                </span>
              </p>

              <p>
                ✅ Correct:{" "}
                <span className="text-green-400 font-bold">
                  {result.correct}
                </span>
              </p>

              <p>
                ❌ Incorrect:{" "}
                <span className="text-red-400 font-bold">
                  {result.incorrect}
                </span>
              </p>

              <p>
                📊 Total:{" "}
                <span className="text-white font-bold">
                  {result.total}
                </span>
              </p>

              {result.rankUp && (
                <p className="text-yellow-400 font-bold text-center">
                  🎉 Rank Up!
                </p>
              )}

            </div>

            {/* NEXT CYCLE */}

            <div className="mt-6 bg-black border border-zinc-800 rounded-2xl p-5 text-center">

              <p className="text-zinc-500 text-sm">
                ⏳ Next SAT Cycle
              </p>

              <h2 className="text-green-400 font-bold text-xl sm:text-2xl mt-2">
                {timeLeft}
              </h2>

              <p className="text-zinc-500 text-xs mt-2">
                {cycle ===
                "genesis"
                  ? "Independence Cycle"
                  : "Next Cycle"}
              </p>

            </div>

            <button
              type="button"
              onClick={() => {

                if (
                  result.rankUp
                ) {
                  setRankData({
                    oldRank:
                      result.oldRank ||
                      "",
                    newRank:
                      result.newRank ||
                      "",
                  });

                  setResult(
                    null
                  );

                  setShowRankUp(
                    true
                  );
                } else {
                  setResult(
                    null
                  );

                  setCompleted(
                    true
                  );
                }

              }}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold text-base sm:text-lg transition"
            >
              Continue
            </button>

          </div>

        </div>
      )}

      {/* ===================================================
          COMPLETED MODAL
      =================================================== */}

      {completed && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5">

          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto">

            <h1 className="text-2xl sm:text-4xl font-bold text-center mb-5">
              🧮 SAT Completed
            </h1>

            <p className="text-center text-zinc-300 text-sm sm:text-lg leading-7">
              Congratulations! 🎉
              <br />
              You have already completed this SAT test.
            </p>

            <div className="bg-black rounded-xl sm:rounded-2xl p-5 mt-6 text-center">

              <p className="text-zinc-400 text-sm">
                ⏳ Next SAT Cycle
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mt-2 text-green-400">
                {timeLeft}
              </h2>

              <p className="text-zinc-500 text-xs mt-2">
                {cycle ===
                "genesis"
                  ? "Independence Cycle"
                  : "Next Cycle"}
              </p>

            </div>

            <div className="mt-6 space-y-3 text-sm sm:text-base">

              <p className="font-semibold">
                🔓 When the next SAT Cycle becomes available:
              </p>

              <p>
                ✅ Brand New SAT Questions
              </p>

              <p>
                📚 New Problems
              </p>

              <p>
                ⭐ Earn More Genius Points
              </p>

            </div>

            <div className="mt-6 p-4 rounded-xl bg-zinc-800">

              <p className="text-zinc-300 text-sm leading-6">
                💡 While you wait, keep earning Genius Points by solving Olympiad, Certificate, Daily Problems and Math Sprint.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setCompleted(
                  false
                )
              }
              className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-base sm:text-lg font-bold transition"
            >
              Got it
            </button>

          </div>

        </div>
      )}

      {/* ===================================================
          RANK UP
      =================================================== */}

      <RankUpModal
        open={showRankUp}
        oldRank={
          rankData?.oldRank ||
          ""
        }
        newRank={
          rankData?.newRank ||
          ""
        }
        onClose={() => {

          setShowRankUp(
            false
          );

          setRankData(
            null
          );

          setCompleted(
            true
          );

        }}
      />

    </div>
  );
}
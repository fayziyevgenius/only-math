"use client";

import {
  useEffect,
  useState,
} from "react";

import "katex/dist/katex.min.css";

import {
  InlineMath,
  BlockMath,
} from "react-katex";

import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Trophy,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Question = {
  id: number;
  type?: "math" | "geometry";
  question: string;
  expression?: string;
  options: string[];
  points: number;
  correctAnswer?: number;
  image?: string;
};

type Cycle = {
  name: string;
  title: string;
  start: string;
  end: string;
  questions: Question[];
};

type Attempt = {
  answer: number;
  correct: boolean;
  completedAt: string;
};

/* =========================================================
   MATH TEXT
========================================================= */

function MathText({
  text,
}: {
  text: string;
}) {
  const result: React.ReactNode[] = [];

  let remaining = text;

  let key = 0;

  while (remaining.length > 0) {
    const inlineStart =
      remaining.indexOf("\\(");

    const blockStart =
      remaining.indexOf("\\[");

    let start = -1;

    let isBlock = false;

    if (
      inlineStart !== -1 &&
      (blockStart === -1 ||
        inlineStart < blockStart)
    ) {
      start = inlineStart;
      isBlock = false;
    } else if (blockStart !== -1) {
      start = blockStart;
      isBlock = true;
    }

    /*
      Math yo'q
    */

    if (start === -1) {
      result.push(
        <span key={`text-${key++}`}>
          {remaining}
        </span>
      );

      break;
    }

    /*
      Mathgacha bo'lgan text
    */

    if (start > 0) {
      result.push(
        <span key={`text-${key++}`}>
          {remaining.slice(0, start)}
        </span>
      );
    }

    const closeToken = isBlock
      ? "\\]"
      : "\\)";

    const closeIndex =
      remaining.indexOf(
        closeToken,
        start + 2
      );

    /*
      Formula yopilmagan bo'lsa
    */

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
          className="
            w-full
            overflow-x-auto
            py-3
          "
        >
          <BlockMath math={math} />
        </div>
      );
    } else {
      result.push(
        <span
          key={`inline-${key++}`}
          className="
            inline-block
            align-middle
          "
        >
          <InlineMath math={math} />
        </span>
      );
    }

    remaining = remaining.slice(
      closeIndex +
        closeToken.length
    );
  }

  return <>{result}</>;
}

/* =========================================================
   OPTION
========================================================= */

function MathOption({
  text,
}: {
  text: string;
}) {
  return (
    <span className="text-white text-base sm:text-lg">
      <MathText text={text} />
    </span>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function TrainingPage() {
  const [cycles, setCycles] =
    useState<Cycle[]>([]);

  const [attempts, setAttempts] =
    useState<
      Record<
        string,
        Record<string, Attempt>
      >
    >({});

  const [openQuestions, setOpenQuestions] =
    useState<
      Record<string, boolean>
    >({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState<
      Record<string, boolean>
    >({});

  const [username, setUsername] =
    useState("");

  /* =======================================================
     USERNAME
  ======================================================= */

  useEffect(() => {
    try {
      const storedUsername =
        localStorage.getItem(
          "username"
        );

      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch {
      // ignore
    }
  }, []);

  /* =======================================================
     LOAD TRAINING
  ======================================================= */

  useEffect(() => {
    if (!username) return;

    async function loadTraining() {
      try {
        setLoading(true);

        setError("");

        const response =
          await fetch(
            `/api/training?username=${encodeURIComponent(
              username
            )}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load training."
          );
        }

        setCycles(
          data.cycles || []
        );

        setAttempts(
          data.attempts || {}
        );
      } catch (err: any) {
        console.error(err);

        setError(
          err.message ||
            "Failed to load training."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTraining();
  }, [username]);

  /* =======================================================
     TOGGLE
  ======================================================= */

  function toggleQuestion(
    key: string
  ) {
    setOpenQuestions(
      (previous) => ({
        ...previous,

        [key]:
          !previous[key],
      })
    );
  }

  /* =======================================================
     ANSWER
  ======================================================= */

  async function submitAnswer(
    cycleName: string,
    question: Question,
    answer: number
  ) {
    const key =
      `${cycleName}-${question.id}`;

    if (
      attempts[cycleName]?.[
        String(question.id)
      ]
    ) {
      return;
    }

    if (submitting[key]) {
      return;
    }

    try {
      setSubmitting(
        (previous) => ({
          ...previous,
          [key]: true,
        })
      );

      const response =
        await fetch(
          "/api/training",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username,

              cycle: cycleName,

              questionId:
                question.id,

              answer,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to submit answer."
        );
      }

      const attempt: Attempt = {
        answer:
          data.selectedAnswer,

        correct:
          data.correct,

        completedAt:
          new Date().toISOString(),
      };

      /*
        Natijani darhol ekranga chiqaramiz.
      */

      setAttempts(
        (previous) => ({
          ...previous,

          [cycleName]: {
            ...(previous[
              cycleName
            ] || {}),

            [String(
              question.id
            )]: attempt,
          },
        })
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(
        (previous) => ({
          ...previous,
          [key]: false,
        })
      );
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">
          Loading training...
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div
          className="
            max-w-lg
            w-full
            rounded-3xl
            border
            border-red-500/20
            bg-red-500/5
            p-8
            text-center
          "
        >
          <XCircle
            className="
              mx-auto
              mb-4
              text-red-400
            "
            size={48}
          />

          <h1 className="text-xl font-bold text-white mb-2">
            Training could not be loaded
          </h1>

          <p className="text-zinc-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO TRAINING
  ======================================================= */

  if (cycles.length === 0) {
    return (
      <div className="min-h-[calc(100vh-40px)] flex items-center justify-center px-6">
        <div
          className="
            w-full
            max-w-2xl
            rounded-3xl
            border
            border-zinc-800
            bg-zinc-950/80
            p-10
            text-center
          "
        >
          <BookOpen
            size={48}
            className="
              mx-auto
              mb-5
              text-green-400
            "
          />

          <h1 className="text-3xl font-black text-white mb-3">
            No training yet
          </h1>

          <p className="text-zinc-500">
            Previous cycle questions will
            appear here after a cycle ends.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        px-4
        py-8
        md:px-8
      "
    >
      <div
        className="
          max-w-5xl
          mx-auto
        "
      >
        {/* HEADER */}

        <div className="mb-8">
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
              bg-green-500/10
              text-green-400
              text-xs
              font-bold
              uppercase
              tracking-widest
              mb-4
            "
          >
            <BookOpen size={14} />

            Training Archive
          </div>

          <h1
            className="
              text-4xl
              md:text-5xl
              font-black
              text-white
              mb-3
            "
          >
            Previous Cycles
          </h1>

          <p className="text-zinc-500 max-w-2xl">
            Bu yerda oldingi cycle'larda berilgan
            barcha savollarni qayta ishlashingiz
            mumkin.
          </p>
        </div>

        {/* CYCLES */}

        <div className="space-y-6">
          {cycles.map((cycle) => {
            const cycleAttempts =
              attempts[
                cycle.name
              ] || {};

            const solvedCount =
              Object.keys(
                cycleAttempts
              ).length;

            return (
              <div
                key={cycle.name}
                className="
                  overflow-hidden
                  rounded-3xl
                  border
                  border-zinc-800
                  bg-zinc-950/80
                  shadow-2xl
                "
              >
                {/* CYCLE HEADER */}

                <div
                  className="
                    p-5
                    md:p-6
                    border-b
                    border-zinc-800
                    bg-zinc-900/40
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          w-12
                          h-12
                          rounded-2xl
                          flex
                          items-center
                          justify-center
                          bg-green-500/10
                          border
                          border-green-500/20
                        "
                      >
                        <Trophy
                          className="text-green-400"
                          size={24}
                        />
                      </div>

                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-white">
                          {cycle.title}
                        </h2>

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                            mt-1
                            text-xs
                            text-zinc-500
                          "
                        >
                          <span className="flex items-center gap-1">
                            <CalendarDays
                              size={13}
                            />

                            {cycle.start}
                            {" → "}
                            {cycle.end}
                          </span>

                          <span>
                            {cycle.questions.length}{" "}
                            questions
                          </span>

                          <span>
                            {solvedCount}/
                            {cycle.questions.length}{" "}
                            completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QUESTIONS */}

                <div className="p-3 md:p-5 space-y-3">
                  {cycle.questions.map(
                    (question) => {
                      const questionKey =
                        `${cycle.name}-${question.id}`;

                      const isOpen =
                        !!openQuestions[
                          questionKey
                        ];

                      const attempt =
                        cycleAttempts[
                          String(
                            question.id
                          )
                        ];

                      const alreadyAnswered =
                        !!attempt;

                      return (
                        <div
                          key={questionKey}
                          className="
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-zinc-900/40
                            overflow-hidden
                          "
                        >
                          {/* QUESTION BAR */}

                          <button
                            type="button"
                            onClick={() =>
                              toggleQuestion(
                                questionKey
                              )
                            }
                            className="
                              w-full
                              flex
                              items-center
                              justify-between
                              gap-4
                              p-4
                              text-left
                              hover:bg-zinc-800/40
                              transition
                            "
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div
                                className="
                                  w-9
                                  h-9
                                  shrink-0
                                  rounded-xl
                                  bg-zinc-800
                                  flex
                                  items-center
                                  justify-center
                                  text-green-400
                                  font-bold
                                "
                              >
                                {question.id}
                              </div>

                              <div className="text-white font-semibold truncate">
                                <MathText
                                  text={
                                    question.question
                                  }
                                />
                              </div>
                            </div>

                            {isOpen ? (
                              <ChevronUp
                                size={20}
                                className="text-zinc-500 shrink-0"
                              />
                            ) : (
                              <ChevronDown
                                size={20}
                                className="text-zinc-500 shrink-0"
                              />
                            )}
                          </button>

                          {/* CONTENT */}

                          {isOpen && (
                            <div
                              className="
                                border-t
                                border-zinc-800
                                p-4
                                md:p-6
                              "
                            >
                              {/* QUESTION */}

                              <div className="text-lg text-white leading-relaxed mb-5">
                                <MathText
                                  text={
                                    question.question
                                  }
                                />
                              </div>

                              {/* EXPRESSION */}

                              {question.expression && (
                                <div
                                  className="
                                    rounded-2xl
                                    border
                                    border-zinc-800
                                    bg-black/50
                                    px-4
                                    py-5
                                    mb-5
                                    overflow-x-auto
                                    text-white
                                  "
                                >
                                  <BlockMath
                                    math={
                                      question.expression
                                    }
                                  />
                                </div>
                              )}

                              {/* IMAGE */}

                              {question.image && (
                                <div className="mb-6 flex justify-center">
                                  <img
                                    src={
                                      question.image
                                    }
                                    alt={`Question ${question.id}`}
                                    className="
                                      max-w-full
                                      max-h-[500px]
                                      rounded-xl
                                      object-contain
                                      border
                                      border-zinc-800
                                    "
                                  />
                                </div>
                              )}

                              {/* OPTIONS */}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {question.options.map(
                                  (
                                    option,
                                    optionIndex
                                  ) => {
                                    const selected =
                                      attempt?.answer ===
                                      optionIndex;

                                    const correct =
                                      attempt &&
                                      optionIndex ===
                                        question
                                          .correctAnswer;

                                    let className =
                                      `
                                      w-full
                                      text-left
                                      rounded-2xl
                                      border
                                      p-4
                                      transition
                                      `;

                                    if (
                                      correct
                                    ) {
                                      className +=
                                        `
                                        border-green-500
                                        bg-green-500/10
                                        text-green-400
                                        `;
                                    } else if (
                                      selected
                                    ) {
                                      className +=
                                        `
                                        border-red-500
                                        bg-red-500/10
                                        text-red-400
                                        `;
                                    } else if (
                                      alreadyAnswered
                                    ) {
                                      className +=
                                        `
                                        border-zinc-800
                                        bg-zinc-900/40
                                        text-zinc-500
                                        `;
                                    } else {
                                      className +=
                                        `
                                        border-zinc-800
                                        bg-zinc-900/50
                                        hover:border-green-500/50
                                        hover:bg-green-500/5
                                        text-white
                                        `;
                                    }

                                    return (
                                      <button
                                        key={
                                          optionIndex
                                        }
                                        type="button"
                                        disabled={
                                          alreadyAnswered ||
                                          !!submitting[
                                            questionKey
                                          ]
                                        }
                                        onClick={() =>
                                          submitAnswer(
                                            cycle.name,
                                            question,
                                            optionIndex
                                          )
                                        }
                                        className={
                                          className
                                        }
                                      >
                                        <div className="flex items-center gap-3">
                                          <span
                                            className="
                                              font-black
                                              shrink-0
                                            "
                                          >
                                            {String.fromCharCode(
                                              65 +
                                                optionIndex
                                            )}
                                            .
                                          </span>

                                          <MathOption
                                            text={
                                              option
                                            }
                                          />

                                          {correct && (
                                            <CheckCircle2
                                              size={
                                                20
                                              }
                                              className="
                                                ml-auto
                                                shrink-0
                                                text-green-400
                                              "
                                            />
                                          )}

                                          {selected &&
                                            !correct && (
                                              <XCircle
                                                size={
                                                  20
                                                }
                                                className="
                                                  ml-auto
                                                  shrink-0
                                                  text-red-400
                                                "
                                              />
                                            )}
                                        </div>
                                      </button>
                                    );
                                  }
                                )}
                              </div>

                              {/* RESULT */}

                              {attempt && (
                                <div
                                  className={`
                                    mt-5
                                    rounded-2xl
                                    border
                                    p-4
                                    ${
                                      attempt.correct
                                        ? "border-green-500/20 bg-green-500/5"
                                        : "border-red-500/20 bg-red-500/5"
                                    }
                                  `}
                                >
                                  <div className="flex items-center gap-3">
                                    {attempt.correct ? (
                                      <CheckCircle2
                                        className="text-green-400"
                                        size={22}
                                      />
                                    ) : (
                                      <XCircle
                                        className="text-red-400"
                                        size={22}
                                      />
                                    )}

                                    <div>
                                      <p
                                        className={`
                                          font-bold
                                          ${
                                            attempt.correct
                                              ? "text-green-400"
                                              : "text-red-400"
                                          }
                                        `}
                                      >
                                        {attempt.correct
                                          ? "Correct!"
                                          : "Incorrect"}
                                      </p>

                                      <p className="text-xs text-zinc-500 mt-1">
                                        This question
                                        cannot be
                                        attempted again.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* GP */}

                              <div className="mt-5 text-right text-xs text-zinc-600">
                                Training • 0 GP
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
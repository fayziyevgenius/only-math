"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import confetti from "canvas-confetti";

import RankUpModal from "@/app/components/RankUpModal";

import {
  dailyQuestions,
  GENESIS_END_DATE,
  GENESIS_START_DATE,
  type DailyQuestion,
} from "@/lib/dailyQuestions";

type AnswerState = {
  selected: string;
  checked: boolean;
  correct: boolean;
};

type RankData = {
  oldRank: string;
  newRank: string;
};

const categoryInfo = {
  certificate: {
    label: "Certificate",
    subtitle: "National Certificate",
    icon: "🏅",
    accent:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },

  olympiad: {
    label: "Olympiad",
    subtitle: "Mathematical Challenge",
    icon: "♟",
    accent:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  sat: {
    label: "SAT",
    subtitle: "SAT Practice",
    icon: "◈",
    accent:
      "border-purple-500/20 bg-purple-500/10 text-purple-400",
  },
};

function getDateKey(date: Date) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return getDateKey(new Date());
}

function getMonthName(
  month: number
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
    }
  ).format(
    new Date(
      2026,
      month,
      1
    )
  );
}

function getDateDifference(
  start: string,
  end: string
) {
  const startDate = new Date(
    `${start}T00:00:00Z`
  );

  const endDate = new Date(
    `${end}T00:00:00Z`
  );

  return Math.floor(
    (endDate.getTime() -
      startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function getCurrentCycleDay(
  dateKey: string
) {
  const start = new Date(
    `${GENESIS_START_DATE}T00:00:00Z`
  );

  const end = new Date(
    `${GENESIS_END_DATE}T00:00:00Z`
  );

  const current = new Date(
    `${dateKey}T00:00:00Z`
  );

  if (
    current < start ||
    current > end
  ) {
    return null;
  }

  return (
    Math.floor(
      (current.getTime() -
        start.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );
}

export default function DailyPage() {
  const [answers, setAnswers] =
    useState<
      Record<number, AnswerState>
    >({});

  const [completed, setCompleted] =
    useState(false);

  const [calendarDate, setCalendarDate] =
    useState(new Date());

  const [
    completedDays,
    setCompletedDays,
  ] = useState<
    Record<string, boolean>
  >({});

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const [rankData, setRankData] =
    useState<RankData | null>(null);

  const [
    showRankUp,
    setShowRankUp,
  ] = useState(false);

  const todayKey =
    getTodayKey();

  const cycleDay =
    getCurrentCycleDay(
      todayKey
    );

  const question: DailyQuestion | null =
    cycleDay
      ? dailyQuestions.find(
          (item) =>
            item.day === cycleDay
        ) ?? null
      : null;

  const answer =
    question
      ? answers[question.id]
      : undefined;

  const completedQuestions =
    answer?.checked ? 1 : 0;

  const earnedPoints =
    answer?.checked &&
    answer.correct
      ? question?.points || 0
      : 0;

  const progress =
    completedQuestions === 1
      ? 100
      : 0;

  /*
   * Load today's answer
   */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          `daily-${todayKey}`
        );

      if (!saved) {
        setAnswers({});
        setCompleted(false);
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (parsed.answers) {
        setAnswers(
          parsed.answers
        );
      }

      if (parsed.completed) {
        setCompleted(true);
      }
    } catch (error) {
      console.error(
        "Failed to load Daily progress:",
        error
      );
    }
  }, [todayKey]);

  /*
   * Save today's answer
   */

  useEffect(() => {
    try {
      localStorage.setItem(
        `daily-${todayKey}`,
        JSON.stringify({
          answers,
          completed,
        })
      );
    } catch (error) {
      console.error(
        "Failed to save Daily progress:",
        error
      );
    }
  }, [
    answers,
    completed,
    todayKey,
  ]);

  /*
   * Completed calendar days
   */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "daily-completed-days"
        );

      if (saved) {
        setCompletedDays(
          JSON.parse(saved)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load completed Daily days:",
        error
      );
    }
  }, []);

  /*
   * Calendar
   */

  const calendarDays = useMemo(() => {
    const year =
      calendarDate.getFullYear();

    const month =
      calendarDate.getMonth();

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();

    const mondayFirstOffset =
      firstDay === 0
        ? 6
        : firstDay - 1;

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();

    const previousMonthDays =
      new Date(
        year,
        month,
        0
      ).getDate();

    const cells: {
      day: number;
      currentMonth: boolean;
    }[] = [];

    for (
      let i = 0;
      i < mondayFirstOffset;
      i++
    ) {
      cells.push({
        day:
          previousMonthDays -
          mondayFirstOffset +
          i +
          1,

        currentMonth: false,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      cells.push({
        day,
        currentMonth: true,
      });
    }

    while (cells.length < 42) {
      cells.push({
        day:
          cells.length -
          daysInMonth -
          mondayFirstOffset +
          1,

        currentMonth: false,
      });
    }

    return cells;
  }, [calendarDate]);

  function selectAnswer(
    answerValue: string
  ) {
    if (!question) {
      return;
    }

    if (answer?.checked) {
      return;
    }

    setAnswers(
      (previous) => ({
        ...previous,

        [question.id]: {
          selected:
            answerValue,

          checked: false,

          correct: false,
        },
      })
    );
  }

  function checkAnswer() {
    if (!question) {
      return;
    }

    if (!answer?.selected) {
      return;
    }

    if (answer.checked) {
      return;
    }

    const isCorrect =
      answer.selected ===
      question.correctAnswer;

    setAnswers(
      (previous) => ({
        ...previous,

        [question.id]: {
          selected:
            answer.selected,

          checked: true,

          correct:
            isCorrect,
        },
      })
    );
  }

  async function finishDaily() {
    if (!question) {
      return;
    }

    if (!answer?.checked) {
      return;
    }

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

    let user;

    try {
      user =
        JSON.parse(
          currentUser
        );
    } catch {
      alert(
        "Please sign in again."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/daily",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username:
                user.username,

              answer:
                answer.selected,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        if (
          data.error ===
          "You have already completed today's Daily Challenge."
        ) {
          markTodayCompleted();

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

      if (data.correct === 1) {
        confetti({
          particleCount: 180,
          spread: 90,

          origin: {
            y: 0.6,
          },
        });
      }

      markTodayCompleted();

      setCompleted(true);
    } catch (error) {
      console.error(error);

      alert(
        "Server Error."
      );
    } finally {
      setLoading(false);
    }
  }

  function markTodayCompleted() {
    const updated = {
      ...completedDays,

      [todayKey]: true,
    };

    setCompletedDays(
      updated
    );

    try {
      localStorage.setItem(
        "daily-completed-days",
        JSON.stringify(
          updated
        )
      );
    } catch (error) {
      console.error(
        "Failed to save completed day:",
        error
      );
    }
  }

  function previousMonth() {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + 1,
        1
      )
    );
  }

  function getCellDate(
    day: number
  ) {
    return new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      day
    );
  }

  function isToday(
    day: number
  ) {
    return (
      getDateKey(
        getCellDate(day)
      ) === todayKey
    );
  }

  function isCompletedDay(
    day: number
  ) {
    const date =
      getCellDate(day);

    return Boolean(
      completedDays[
        getDateKey(date)
      ]
    );
  }

  function openResult() {
    if (!result) {
      setCompleted(false);

      return;
    }

    if (result.rankUp) {
      setRankData({
        oldRank:
          result.oldRank,

        newRank:
          result.newRank,
      });

      setResult(null);

      setCompleted(false);

      setShowRankUp(true);

      return;
    }

    setResult(null);

    setCompleted(false);
  }

  /*
   * BEFORE GENESIS
   */

  if (!cycleDay) {
    return (
      <div className="w-full max-w-6xl mx-auto pb-24 px-3 sm:px-5 lg:px-0">
        <section className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative p-7 sm:p-10 lg:p-14 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-4xl">
              ✦
            </div>

            <p className="mt-7 text-xs uppercase tracking-widest text-green-400 font-black">
              Genesis Cycle
            </p>

            <h1 className="mt-2 text-3xl sm:text-5xl font-black text-white">
              Daily Challenge
            </h1>

            <p className="mt-4 text-zinc-400 text-sm sm:text-lg">
              Genesis Cycle starts on
            </p>

            <p className="mt-2 text-2xl sm:text-3xl font-black text-green-400">
              August 17, 2026
            </p>

            <div className="mt-7 max-w-xl mx-auto grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
                <p className="text-xs text-zinc-500 uppercase">
                  Cycle
                </p>

                <p className="text-lg font-black text-white mt-1">
                  14 Days
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
                <p className="text-xs text-zinc-500 uppercase">
                  Daily
                </p>

                <p className="text-lg font-black text-white mt-1">
                  1 Question
                </p>
              </div>
            </div>

            <p className="mt-7 text-sm text-zinc-500">
              SAT → Olympiad →
              Certificate
            </p>
          </div>
        </section>
      </div>
    );
  }

  const info =
    categoryInfo[
      question!.category
    ];

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 px-3 sm:px-5 lg:px-0">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 mb-8">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs sm:text-sm font-bold mb-5">
                <span>🔥</span>
                DAILY CHALLENGE
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Train your mind.
              </h1>

              <p className="mt-3 text-zinc-400 text-sm sm:text-lg max-w-2xl leading-6 sm:leading-7">
                One challenge every
                day. Keep your streak
                and climb the
                leaderboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 sm:px-5 py-4 min-w-0 sm:min-w-[130px]">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500">
                  Cycle Day
                </p>

                <p className="text-2xl font-black text-white mt-1">
                  {cycleDay}/14
                </p>

                <p className="text-[10px] sm:text-xs text-zinc-500">
                  Genesis
                </p>
              </div>

              <div className="rounded-2xl bg-green-500/10 border border-green-500/20 px-4 sm:px-5 py-4 min-w-0 sm:min-w-[130px]">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-green-500/70">
                  Reward
                </p>

                <p className="text-2xl font-black text-green-400 mt-1">
                  +{earnedPoints}
                </p>

                <p className="text-[10px] sm:text-xs text-green-500/60">
                  / {question!.points} GP
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="text-zinc-500">
                Today's progress
              </span>

              <span className="text-green-400 font-bold">
                {Math.round(
                  progress
                )}
                %
              </span>
            </div>

            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CYCLE INFO */}

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            Cycle
          </p>

          <p className="text-lg font-black text-white mt-1">
            🌱 Genesis
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            Today
          </p>

          <p className="text-lg font-black text-white mt-1">
            Day {cycleDay}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            Date
          </p>

          <p className="text-lg font-black text-white mt-1">
            {new Intl.DateTimeFormat(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ).format(
              new Date(
                `${todayKey}T00:00:00`
              )
            )}
          </p>
        </div>
      </section>

      {/* CALENDAR */}

      <section className="bg-zinc-950 border border-zinc-800 rounded-[28px] p-4 sm:p-7 mb-10">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-green-400 font-bold">
              Your journey
            </p>

            <h2 className="text-xl sm:text-3xl font-black text-white mt-1">
              {getMonthName(
                calendarDate.getMonth()
              )}{" "}
              {calendarDate.getFullYear()}
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={
                previousMonth
              }
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-white transition"
            >
              ←
            </button>

            <button
              type="button"
              onClick={
                nextMonth
              }
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-white transition"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map((day) => (
            <div
              key={day}
              className="text-center text-[9px] sm:text-xs font-bold uppercase tracking-wider text-zinc-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarDays.map(
            (item, index) => {
              const today =
                item.currentMonth &&
                isToday(item.day);

              const completedDay =
                item.currentMonth &&
                isCompletedDay(
                  item.day
                );

              return (
                <div
                  key={`${item.day}-${index}`}
                  className={`
                    aspect-square
                    rounded-lg sm:rounded-xl
                    flex flex-col
                    items-center
                    justify-center
                    relative
                    transition
                    ${
                      !item.currentMonth
                        ? "text-zinc-800 bg-transparent"
                        : completedDay
                        ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                        : today
                        ? "border-2 border-green-500 text-green-400 bg-green-500/5"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }
                  `}
                >
                  <span
                    className={`
                      text-[11px] sm:text-sm font-bold
                      ${
                        completedDay
                          ? "text-black"
                          : ""
                      }
                    `}
                  >
                    {item.day}
                  </span>

                  {completedDay && (
                    <span className="text-[7px] sm:text-[8px] uppercase font-black mt-0.5">
                      ✓ Done
                    </span>
                  )}

                  {today &&
                    !completedDay && (
                      <span className="text-[7px] sm:text-[8px] uppercase font-black mt-0.5 text-green-400">
                        Today
                      </span>
                    )}
                </div>
              );
            }
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-6 pt-5 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Completed
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
            <span className="w-2.5 h-2.5 rounded-full border border-green-500" />
            Today
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
            🔥 Streak
          </div>
        </div>
      </section>

      {/* QUESTION HEADER */}

      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 font-bold">
            Today's challenge
          </p>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            One question.
          </h2>
        </div>

        <div className="hidden sm:block text-sm text-zinc-500">
          Day {cycleDay} / 14
        </div>
      </div>

      {/* QUESTION */}

      <section className="bg-zinc-950 border border-zinc-800 rounded-[28px] overflow-hidden">
        {/* HEADER */}

        <div className="p-5 sm:p-7 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`
                  w-11 h-11 sm:w-12 sm:h-12
                  rounded-2xl
                  flex items-center justify-center
                  text-lg sm:text-xl
                  border
                  ${info.accent}
                `}
              >
                {info.icon}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {info.label}
                  </h3>

                  <span className="text-xs text-zinc-600">
                    Day {cycleDay}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  {info.subtitle}
                </p>
              </div>
            </div>

            <div
              className={`
                self-start sm:self-auto
                px-3.5 py-2
                rounded-full
                text-xs sm:text-sm
                font-black
                border
                ${info.accent}
              `}
            >
              +{question!.points} GP
            </div>
          </div>
        </div>

        {/* QUESTION BODY */}

        <div className="p-5 sm:p-7">
          <div className="mb-7">
            <h4 className="text-base sm:text-lg md:text-xl leading-7 sm:leading-8 font-semibold text-white whitespace-pre-line">
              {question!.question}
            </h4>
          </div>

          {/* TABLE */}

          {question!.table && (
            <div className="mb-7 rounded-2xl border border-zinc-800 overflow-hidden bg-black">
              <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  Values
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[280px] border-collapse">
                  <thead>
                    <tr className="bg-zinc-900">
                      {question!.table.headers.map(
                        (
                          header,
                          index
                        ) => (
                          <th
                            key={
                              index
                            }
                            className="px-4 py-3 sm:px-5 sm:py-4 text-center text-xs sm:text-sm font-bold text-zinc-300 border-r border-zinc-800 last:border-r-0"
                          >
                            {
                              header
                            }
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {question!.table.rows.map(
                      (
                        row,
                        rowIndex
                      ) => (
                        <tr
                          key={
                            rowIndex
                          }
                          className="border-t border-zinc-800"
                        >
                          {row.map(
                            (
                              cell,
                              cellIndex
                            ) => (
                              <td
                                key={
                                  cellIndex
                                }
                                className="px-4 py-3 sm:px-5 sm:py-4 text-center text-base sm:text-lg font-semibold text-white border-r border-zinc-800 last:border-r-0"
                              >
                                {
                                  cell
                                }
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OPTIONS */}

          <div className="grid gap-3">
            {question!.options.map(
              (
                option,
                index
              ) => {
                const selected =
                  answer?.selected ===
                  option;

                const checked =
                  answer?.checked;

                const isCorrect =
                  checked &&
                  option ===
                    question!
                      .correctAnswer;

                const isWrong =
                  checked &&
                  selected &&
                  !answer?.correct;

                const letter =
                  String.fromCharCode(
                    65 + index
                  );

                return (
                  <button
                    key={`${question!.id}-${index}`}
                    type="button"
                    disabled={checked}
                    onClick={() =>
                      selectAnswer(
                        option
                      )}
                    className={`
                      w-full
                      text-left
                      rounded-2xl
                      border
                      p-3.5 sm:p-4
                      flex items-center
                      gap-3 sm:gap-4
                      transition-all
                      ${
                        isCorrect
                          ? "border-green-500 bg-green-500/10"
                          : isWrong
                          ? "border-red-500 bg-red-500/10"
                          : selected
                          ? "border-green-500/60 bg-green-500/5"
                          : "border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800"
                      }
                      ${
                        checked
                          ? "cursor-default"
                          : "cursor-pointer"
                      }
                    `}
                  >
                    <span
                      className={`
                        shrink-0
                        w-9 h-9 sm:w-10 sm:h-10
                        rounded-xl
                        flex items-center justify-center
                        text-sm sm:text-base
                        font-black
                        ${
                          isCorrect
                            ? "bg-green-500 text-black"
                            : isWrong
                            ? "bg-red-500 text-white"
                            : selected
                            ? "bg-green-500 text-black"
                            : "bg-zinc-800 text-zinc-300"
                        }
                      `}
                    >
                      {letter}
                    </span>

                    <span className="text-sm sm:text-base md:text-lg font-medium text-white">
                      {option}
                    </span>

                    {isCorrect && (
                      <span className="ml-auto text-green-400 text-xl">
                        ✓
                      </span>
                    )}

                    {isWrong && (
                      <span className="ml-auto text-red-400 text-xl">
                        ×
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* CHECK */}

          {!answer?.checked && (
            <button
              type="button"
              disabled={
                !answer?.selected
              }
              onClick={
                checkAnswer
              }
              className="
                mt-6
                w-full sm:w-auto
                px-7 py-3.5
                rounded-xl
                bg-white
                text-black
                font-black
                transition
                hover:bg-zinc-200
                disabled:opacity-30
                disabled:cursor-not-allowed
              "
            >
              Check Answer →
            </button>
          )}

          {/* ANSWER RESULT */}

          {answer?.checked && (
            <div
              className={`
                mt-5
                rounded-2xl
                p-4
                border
                flex flex-col sm:flex-row
                items-start sm:items-center
                justify-between
                gap-3
                ${
                  answer.correct
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }
              `}
            >
              <div>
                <p
                  className={`font-black ${
                    answer.correct
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {answer.correct
                    ? "✓ Correct answer"
                    : "✕ Incorrect answer"}
                </p>

                {!answer.correct && (
                  <p className="text-sm text-zinc-400 mt-1">
                    Correct answer:{" "}
                    <span className="text-white font-bold">
                      {
                        question!
                          .correctAnswer
                      }
                    </span>
                  </p>
                )}
              </div>

              <span
                className={`font-black ${
                  answer.correct
                    ? "text-green-400"
                    : "text-zinc-600"
                }`}
              >
                {answer.correct
                  ? `+${question!.points} GP`
                  : "+0 GP"}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* COMPLETE */}

      <div className="mt-8">
        <button
          type="button"
          onClick={
            finishDaily
          }
          disabled={
            !answer?.checked ||
            loading ||
            completed
          }
          className="
            w-full
            py-4 sm:py-5
            rounded-2xl
            bg-green-600
            hover:bg-green-500
            text-white
            font-black
            text-base sm:text-lg
            transition
            disabled:opacity-30
            disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Submitting..."
            : completed
            ? "Today's Challenge Completed ✓"
            : answer?.checked
            ? "Complete Today's Challenge ✓"
            : "Check your answer first"}
        </button>
      </div>

      {/* RESULT MODAL */}

      {result && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[28px] p-6 sm:p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-4xl">
                🎯
              </div>

              <p className="text-xs uppercase tracking-widest text-green-400 font-black mt-6">
                Daily completed
              </p>

              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Great work!
              </h2>

              <div className="grid grid-cols-2 gap-3 mt-7">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-xs text-zinc-500 uppercase">
                    Result
                  </p>

                  <p className="text-2xl font-black text-green-400 mt-1">
                    {result.correct
                      ? "Correct"
                      : "Incorrect"}
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-xs text-zinc-500 uppercase">
                    Earned
                  </p>

                  <p className="text-2xl font-black text-white mt-1">
                    +{result.points} GP
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase">
                  Cycle
                </p>

                <p className="text-white font-black mt-1">
                  🌱 Genesis Cycle ·
                  Day{" "}
                  {result.cycleDay}
                </p>
              </div>

              {result.rankUp && (
                <div className="mt-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-yellow-400 font-black">
                    🎉 Rank Up!
                  </p>

                  <p className="text-sm text-zinc-400 mt-1">
                    {
                      result.newRank
                    }
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={
                  openResult
                }
                className="
                  mt-6
                  w-full
                  py-4
                  rounded-xl
                  bg-green-600
                  hover:bg-green-500
                  text-white
                  font-black
                  transition
                "
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RANK UP */}

      {rankData && (
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
          }}
        />
      )}
    </div>
  );
}
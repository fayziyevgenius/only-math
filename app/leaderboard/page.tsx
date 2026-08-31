"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Crown,
  RefreshCw,
  Globe,
  Zap,
} from "lucide-react";

type GlobalUser = {
  rank: number;
  username: string;
  name: string;
  surname: string;
  geniusPoints: number;
  title: string;
  avatar: string;
};

type SprintUser = {
  username: string;
  name: string;
  surname: string;
  score: number;
  correct: number;
  wrong: number;
  bestCombo: number;
  avatar: string;
};

type Tab = "global" | "sprint";

const avatarImages: Record<string, string> = {
  "only-math": "/logo.png",

  "genesis-cycle":
    "/avatars/genesis-cycle.png",

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

function getAvatarImage(avatar?: string): string {
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

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("global");

  const [globalUsers, setGlobalUsers] =
    useState<GlobalUser[]>([]);

  const [sprintUsers, setSprintUsers] =
    useState<SprintUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadLeaderboards(
    refresh = false
  ) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [globalResponse, sprintResponse] =
        await Promise.all([
          fetch("/api/leaderboard", {
            method: "GET",
            cache: "no-store",
          }),

          fetch(
            "/api/math-spirit/leaderboard",
            {
              method: "GET",
              cache: "no-store",
            }
          ),
        ]);

      const globalData =
        await globalResponse.json();

      const sprintData =
        await sprintResponse.json();

      if (!globalResponse.ok) {
        throw new Error(
          globalData.error ||
            "Failed to load global leaderboard."
        );
      }

      if (!sprintResponse.ok) {
        throw new Error(
          sprintData.error ||
            "Failed to load sprint leaderboard."
        );
      }

      if (!Array.isArray(globalData)) {
        throw new Error(
          "Invalid global leaderboard data."
        );
      }

      if (!Array.isArray(sprintData)) {
        throw new Error(
          "Invalid sprint leaderboard data."
        );
      }

      setGlobalUsers(globalData);
      setSprintUsers(sprintData);
    } catch (error) {
      console.error(
        "Leaderboard error:",
        error
      );

      setError(
        "Leaderboardni yuklashda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadLeaderboards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-zinc-400">
            Loading leaderboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="border border-red-900 bg-red-950/20 rounded-3xl p-10 text-center">
            <h1 className="text-3xl font-bold mb-3">
              Leaderboard Error
            </h1>

            <p className="text-zinc-400 mb-6">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadLeaderboards(true)
              }
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const users =
    activeTab === "global"
      ? globalUsers
      : sprintUsers;

  const first = users[0];
  const second = users[1];
  const third = users[2];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">
          <div>
            <div className="flex items-center gap-3">
              {activeTab === "global" ? (
                <Trophy
                  size={38}
                  className="text-yellow-400"
                />
              ) : (
                <Zap
                  size={38}
                  className="text-yellow-400"
                />
              )}

              <h1 className="text-4xl md:text-5xl font-black">
                Leaderboard
              </h1>
            </div>

            <p className="text-zinc-400 mt-3">
              {activeTab === "global"
                ? "The strongest mathematicians on Only Math."
                : "Math Sprint's fastest players."}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadLeaderboards(true)
            }
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-green-500 px-5 py-3 rounded-xl font-bold transition disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* TABS */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              type="button"
              onClick={() =>
                setActiveTab("global")
              }
              className={`
                shrink-0
                flex items-center gap-2
                px-5 py-3
                rounded-xl
                font-bold
                border
                transition
                ${
                  activeTab === "global"
                    ? "bg-green-600 border-green-500 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                }
              `}
            >
              <Globe size={18} />
              Global
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("sprint")
              }
              className={`
                shrink-0
                flex items-center gap-2
                px-5 py-3
                rounded-xl
                font-bold
                border
                transition
                ${
                  activeTab === "sprint"
                    ? "bg-green-600 border-green-500 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                }
              `}
            >
              <Zap size={18} />
              Math Sprint
            </button>
          </div>
        </div>

        {/* EMPTY */}
        {users.length === 0 ? (
          <div className="border border-zinc-800 rounded-3xl p-12 text-center">
            {activeTab === "global" ? (
              <Trophy
                size={60}
                className="mx-auto text-zinc-700 mb-5"
              />
            ) : (
              <Zap
                size={60}
                className="mx-auto text-zinc-700 mb-5"
              />
            )}

            <h2 className="text-3xl font-bold mb-3">
              {activeTab === "global"
                ? "No rankings yet"
                : "No Sprint rankings yet"}
            </h2>

            <p className="text-zinc-500">
              {activeTab === "global"
                ? "Start solving problems and earn Genius Points."
                : "Play Math Sprint and become the first champion."}
            </p>
          </div>
        ) : (
          <>
            {/* TOP 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

              {/* SECOND */}
              {second && (
                <div className="order-2 md:order-1 bg-zinc-950 border border-zinc-700 rounded-3xl p-7 text-center">
                  <div className="text-4xl mb-4">
                    🥈
                  </div>

                  <img
                    src={getAvatarImage(
                      second.avatar
                    )}
                    alt={second.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-zinc-600 mx-auto mb-4"
                    onError={(event) => {
                      event.currentTarget.src =
                        "/logo.png";
                    }}
                  />

                  <h2 className="text-xl font-bold">
                    {second.name}{" "}
                    {second.surname}
                  </h2>

                  <p className="text-zinc-500 mt-1">
                    @{second.username}
                  </p>

                  {activeTab === "global" ? (
                    <>
                      <p className="text-zinc-400 text-sm mt-4">
                        {(second as GlobalUser).title}
                      </p>

                      <p className="text-3xl font-black text-zinc-300 mt-2">
                        {(second as GlobalUser).geniusPoints}

                        <span className="text-sm text-zinc-500 ml-2">
                          GP
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-black text-zinc-300 mt-5">
                        {(second as SprintUser).score}
                      </p>

                      <p className="text-zinc-500 text-sm">
                        Sprint Score
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* FIRST */}
              {first && (
                <div className="order-1 md:order-2 md:-translate-y-5 bg-gradient-to-b from-yellow-500/10 to-zinc-950 border border-yellow-500/40 rounded-3xl p-7 text-center">
                  <Crown
                    size={40}
                    className="text-yellow-400 mx-auto mb-2"
                  />

                  <div className="text-4xl mb-4">
                    🥇
                  </div>

                  <img
                    src={getAvatarImage(
                      first.avatar
                    )}
                    alt={first.username}
                    className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 mx-auto mb-4"
                    onError={(event) => {
                      event.currentTarget.src =
                        "/logo.png";
                    }}
                  />

                  <h2 className="text-2xl font-black">
                    {first.name}{" "}
                    {first.surname}
                  </h2>

                  <p className="text-zinc-400 mt-1">
                    @{first.username}
                  </p>

                  {activeTab === "global" ? (
                    <>
                      <p className="text-yellow-400 text-sm mt-4 font-bold">
                        {(first as GlobalUser).title}
                      </p>

                      <p className="text-4xl font-black text-yellow-400 mt-2">
                        {(first as GlobalUser).geniusPoints}

                        <span className="text-sm text-zinc-500 ml-2">
                          GP
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-black text-yellow-400 mt-5">
                        {(first as SprintUser).score}
                      </p>

                      <p className="text-zinc-500 text-sm">
                        Sprint Score
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* THIRD */}
              {third && (
                <div className="order-3 bg-zinc-950 border border-zinc-700 rounded-3xl p-7 text-center">
                  <div className="text-4xl mb-4">
                    🥉
                  </div>

                  <img
                    src={getAvatarImage(
                      third.avatar
                    )}
                    alt={third.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-700 mx-auto mb-4"
                    onError={(event) => {
                      event.currentTarget.src =
                        "/logo.png";
                    }}
                  />

                  <h2 className="text-xl font-bold">
                    {third.name}{" "}
                    {third.surname}
                  </h2>

                  <p className="text-zinc-500 mt-1">
                    @{third.username}
                  </p>

                  {activeTab === "global" ? (
                    <>
                      <p className="text-orange-400 text-sm mt-4">
                        {(third as GlobalUser).title}
                      </p>

                      <p className="text-3xl font-black text-orange-400 mt-2">
                        {(third as GlobalUser).geniusPoints}

                        <span className="text-sm text-zinc-500 ml-2">
                          GP
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-black text-orange-400 mt-5">
                        {(third as SprintUser).score}
                      </p>

                      <p className="text-zinc-500 text-sm">
                        Sprint Score
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ALL RANKINGS */}
            <div className="border border-zinc-800 rounded-3xl overflow-hidden">

              <div className="bg-zinc-950 px-5 md:px-7 py-5 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  {activeTab === "global" ? (
                    <Trophy
                      size={25}
                      className="text-yellow-400"
                    />
                  ) : (
                    <Zap
                      size={25}
                      className="text-yellow-400"
                    />
                  )}

                  <div>
                    <h2 className="text-2xl font-bold">
                      {activeTab === "global"
                        ? "All Rankings"
                        : "Sprint Rankings"}
                    </h2>

                    <p className="text-zinc-500 mt-1">
                      {users.length} players
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-zinc-800">
                {users.map(
                  (player, index) => {
                    const rank =
                      index + 1;

                    const globalPlayer =
                      activeTab === "global"
                        ? (player as GlobalUser)
                        : null;

                    const sprintPlayer =
                      activeTab === "sprint"
                        ? (player as SprintUser)
                        : null;

                    return (
                      <div
                        key={`${player.username}-${index}`}
                        className="px-4 md:px-7 py-5 flex items-center gap-3 md:gap-4 hover:bg-zinc-950 transition"
                      >
                        {/* RANK */}
                        <div className="w-10 md:w-12 shrink-0 text-center">
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
                            <span className="text-zinc-500 font-bold">
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
                          className="w-11 h-11 md:w-14 md:h-14 rounded-full object-cover border border-zinc-700 shrink-0"
                          onError={(event) => {
                            event.currentTarget.src =
                              "/logo.png";
                          }}
                        />

                        {/* USER */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">
                            {player.name}{" "}
                            {player.surname}
                          </h3>

                          <p className="text-zinc-500 text-sm truncate">
                            @{player.username}
                          </p>

                          {globalPlayer && (
                            <p className="text-xs text-zinc-600 mt-1 truncate">
                              {globalPlayer.title}
                            </p>
                          )}

                          {sprintPlayer && (
                            <p className="text-xs text-zinc-600 mt-1 md:hidden">
                              Correct:{" "}
                              {sprintPlayer.correct}
                              {" • "}
                              🔥{" "}
                              {sprintPlayer.bestCombo}
                            </p>
                          )}
                        </div>

                        {/* SPRINT STATS */}
                        {sprintPlayer && (
                          <div className="hidden md:flex gap-8 text-center">
                            <div>
                              <p className="text-xs text-zinc-600">
                                Correct
                              </p>

                              <p className="font-bold text-green-400">
                                {
                                  sprintPlayer.correct
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-zinc-600">
                                Combo
                              </p>

                              <p className="font-bold text-orange-400">
                                🔥{" "}
                                {
                                  sprintPlayer.bestCombo
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {/* SCORE */}
                        <div className="text-right shrink-0">
                          <p className="text-xs text-zinc-600">
                            {activeTab === "global"
                              ? "Genius Points"
                              : "Score"}
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
                                  : activeTab ===
                                    "global"
                                  ? "text-green-400"
                                  : "text-white"
                              }
                            `}
                          >
                            {activeTab === "global"
                              ? globalPlayer?.geniusPoints
                              : sprintPlayer?.score}
                          </p>

                          <p className="text-xs text-zinc-600">
                            {activeTab === "global"
                              ? "GP"
                              : "PTS"}
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
      </div>
    </div>
  );
}
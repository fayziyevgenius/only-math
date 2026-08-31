"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Crown,
  RefreshCw,
} from "lucide-react";

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

const avatarImages: Record<
  string,
  string
> = {
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

export default function SprintLeaderboardPage() {
  const [users, setUsers] =
    useState<SprintUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadLeaderboard(
    refresh = false
  ) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        "/api/math-spirit/leaderboard",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load leaderboard."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid leaderboard data."
        );
      }

      setUsers(data);
    } catch (error) {
      console.error(
        "Sprint leaderboard error:",
        error
      );

      setError(
        "Sprint leaderboardni yuklashda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-zinc-400">
            Loading Sprint leaderboard...
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
              Sprint Leaderboard Error
            </h1>

            <p className="text-zinc-400 mb-6">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadLeaderboard(true)
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

  const first = users[0];
  const second = users[1];
  const third = users[2];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <div className="flex items-center gap-3">

              <Trophy
                size={38}
                className="text-yellow-400"
              />

              <h1 className="text-4xl md:text-5xl font-black">
                Sprint Leaderboard
              </h1>

            </div>

            <p className="text-zinc-400 mt-3">
              Math Sprint's fastest players.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadLeaderboard(true)
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

        {/* EMPTY */}

        {users.length === 0 ? (
          <div className="border border-zinc-800 rounded-3xl p-12 text-center">

            <Trophy
              size={60}
              className="mx-auto text-zinc-700 mb-5"
            />

            <h2 className="text-3xl font-bold mb-3">
              No Sprint rankings yet
            </h2>

            <p className="text-zinc-500">
              Play Math Sprint and become
              the first champion.
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
                    alt={
                      second.username
                    }
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

                  <p className="text-3xl font-black text-zinc-300 mt-5">
                    {second.score}
                  </p>

                  <p className="text-zinc-500 text-sm">
                    Sprint Score
                  </p>

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
                    alt={
                      first.username
                    }
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

                  <p className="text-4xl font-black text-yellow-400 mt-5">
                    {first.score}
                  </p>

                  <p className="text-zinc-500 text-sm">
                    Sprint Score
                  </p>

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
                    alt={
                      third.username
                    }
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

                  <p className="text-3xl font-black text-orange-400 mt-5">
                    {third.score}
                  </p>

                  <p className="text-zinc-500 text-sm">
                    Sprint Score
                  </p>

                </div>
              )}

            </div>

            {/* ALL */}

            <div className="border border-zinc-800 rounded-3xl overflow-hidden">

              <div className="bg-zinc-950 px-5 md:px-7 py-5 border-b border-zinc-800">

                <h2 className="text-2xl font-bold">
                  ⚡ Sprint Rankings
                </h2>

                <p className="text-zinc-500 mt-1">
                  {users.length} players
                </p>

              </div>

              <div className="divide-y divide-zinc-800">

                {users.map(
                  (player, index) => {

                    const rank =
                      index + 1;

                    return (
                      <div
                        key={`${player.username}-${index}`}
                        className="px-4 md:px-7 py-5 flex items-center gap-4 hover:bg-zinc-950 transition"
                      >

                        {/* RANK */}

                        <div className="w-12 shrink-0 text-center">

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
                          alt={
                            player.username
                          }
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-zinc-700 shrink-0"
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

                        </div>

                        {/* STATS */}

                        <div className="hidden md:flex gap-8 text-center">

                          <div>
                            <p className="text-xs text-zinc-600">
                              Correct
                            </p>

                            <p className="font-bold text-green-400">
                              {
                                player.correct
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
                                player.bestCombo
                              }
                            </p>
                          </div>

                        </div>

                        {/* SCORE */}

                        <div className="text-right shrink-0">

                          <p className="text-xs text-zinc-600">
                            Score
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
                                  : "text-white"
                              }
                            `}
                          >
                            {
                              player.score
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

      </div>
    </div>
  );
}
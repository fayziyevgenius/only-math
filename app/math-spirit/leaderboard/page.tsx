"use client";

import { useEffect, useMemo, useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";

type Player = {
  _id: string;
  username: string;
  score: number;
  correct: number;
  wrong: number;
  bestCombo: number;
};

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("currentUser") || "{}")
      : {};

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch("/api/math-spirit/leaderboard");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  const topThree = useMemo(() => players.slice(0, 3), [players]);
  const others = useMemo(() => players.slice(3), [players]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl font-bold animate-pulse">
          Loading Leaderboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-14">

      <div className="text-center">

        <div className="inline-flex items-center gap-3 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-6 py-2">

          <Trophy className="text-yellow-400" />

          <span className="font-bold text-yellow-300">
            GLOBAL LEADERBOARD
          </span>

        </div>

        <h1 className="text-6xl font-black mt-8">
          Math Spirit
        </h1>

        <p className="text-zinc-400 mt-4 text-xl">
          Top players around the world
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">

        {topThree.map((player, index) => (

          <div
            key={player._id}
            className={`
            rounded-3xl
            border
            p-8
            text-center
            transition
            hover:scale-105

            ${
              index === 0
                ? "border-yellow-500 bg-yellow-500/10"
                : index === 1
                ? "border-zinc-400 bg-zinc-400/10"
                : "border-orange-500 bg-orange-500/10"
            }
            `}
          >

            <div className="flex justify-center">

              {index === 0 && (
                <Crown
                  size={60}
                  className="text-yellow-400"
                />
              )}

              {index === 1 && (
                <Medal
                  size={60}
                  className="text-zinc-300"
                />
              )}

              {index === 2 && (
                <Medal
                  size={60}
                  className="text-orange-400"
                />
              )}

            </div>

            <p className="mt-6 text-zinc-400">
              #{index + 1}
            </p>

            <h2 className="text-4xl font-black mt-2 break-all">
              {player.username}
            </h2>

            <p className="text-6xl font-black text-green-400 mt-8">
              {player.score}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="rounded-2xl bg-black/30 p-4">

                <p className="text-zinc-500">
                  Correct
                </p>

                <p className="text-3xl font-bold text-green-400">
                  {player.correct}
                </p>

              </div>

              <div className="rounded-2xl bg-black/30 p-4">

                <p className="text-zinc-500">
                  Combo
                </p>

                <p className="text-3xl font-bold text-yellow-400">
                  {player.bestCombo}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>
            <div className="mt-16 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">

        <table className="w-full">

          <thead className="bg-zinc-950">

            <tr>

              <th className="py-5">Rank</th>

              <th>Username</th>

              <th>Score</th>

              <th>Correct</th>

              <th>Wrong</th>

              <th>Best Combo</th>

            </tr>

          </thead>

          <tbody>

            {others.map((player, index) => {

              const isMe =
                player.username === currentUser.username;

              return (

                <tr
                  key={player._id}
                  className={`
                    border-t border-zinc-800
                    transition

                    ${
                      isMe
                        ? "bg-green-500/10"
                        : "hover:bg-zinc-800/40"
                    }
                  `}
                >

                  <td className="py-5 text-center font-bold">
                    #{index + 4}
                  </td>

                  <td className="text-center font-semibold">

                    {player.username}

                    {isMe && (
                      <span className="ml-3 rounded-full bg-green-600 px-3 py-1 text-xs">
                        YOU
                      </span>
                    )}

                  </td>

                  <td className="text-center text-green-400 font-bold">
                    {player.score}
                  </td>

                  <td className="text-center">
                    {player.correct}
                  </td>

                  <td className="text-center text-red-400">
                    {player.wrong}
                  </td>

                  <td className="text-center text-yellow-400">
                    {player.bestCombo}
                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

      <div className="mt-16 text-center">

        <button
          onClick={() => location.reload()}
          className="rounded-2xl bg-green-600 hover:bg-green-700 px-10 py-4 text-2xl font-bold transition"
        >
          Refresh Leaderboard
        </button>

      </div>

    </div>
  );
}
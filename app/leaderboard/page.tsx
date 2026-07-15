"use client";

import { useEffect, useState } from "react";

type User = {
  username: string;
  geniusPoints: number;
  streak: number;
  title: string;
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);

useEffect(() => {
  const user = localStorage.getItem("currentUser");

  if (user) {
    setCurrentUser(JSON.parse(user));
  }
}, []);

  useEffect(() => {
    async function loadLeaderboard() {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-5xl font-bold text-white mb-3">
        🏆 Leaderboard
      </h1>

      <p className="text-gray-400 mb-12">
        Top 100 users ranked by Genius Points.
      </p>

      {/* ---------- PODIUM ---------- */}

      <div className="flex justify-center items-end gap-8 mb-16">

        {/* SECOND */}
        {users[1] && (
          <div className="w-64 h-72 bg-zinc-900 border border-zinc-700 rounded-3xl flex flex-col items-center justify-center shadow-lg">

            <div className="text-7xl">🥈</div>

            <h2 className="text-2xl font-bold mt-4">
              {users[1].username}
            </h2>

            <p className="text-gray-400 mt-1">
              {users[1].title}
            </p>

            <p className="text-green-400 text-xl font-bold mt-4">
              ⭐ {users[1].geniusPoints}
            </p>

            <p className="text-gray-500 mt-1">
              🔥 {users[1].streak} Days
            </p>

          </div>
        )}

        {/* FIRST */}
        {users[0] && (
          <div className="w-72 h-96 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-3xl flex flex-col items-center justify-center shadow-2xl">

            <div className="text-8xl">🥇</div>

            <h2 className="text-3xl font-bold text-black mt-4">
              {users[0].username}
            </h2>

            <p className="text-black mt-1">
              {users[0].title}
            </p>

            <p className="text-3xl font-bold text-black mt-5">
              ⭐ {users[0].geniusPoints}
            </p>

            <p className="text-black mt-1">
              🔥 {users[0].streak} Days
            </p>

          </div>
        )}

        {/* THIRD */}
        {users[2] && (
          <div className="w-64 h-60 bg-zinc-900 border border-zinc-700 rounded-3xl flex flex-col items-center justify-center shadow-lg">

            <div className="text-7xl">🥉</div>

            <h2 className="text-2xl font-bold mt-4">
              {users[2].username}
            </h2>

            <p className="text-gray-400 mt-1">
              {users[2].title}
            </p>

            <p className="text-green-400 text-xl font-bold mt-4">
              ⭐ {users[2].geniusPoints}
            </p>

            <p className="text-gray-500 mt-1">
              🔥 {users[2].streak} Days
            </p>

          </div>
        )}

      </div>

      {/* ---------- OTHER USERS ---------- */}

      <div className="space-y-4">

        {users.slice(3).map((user, index) => (

          <div
            key={user.username}
            className={`rounded-2xl p-6 flex items-center justify-between border transition ${
              currentUser?.username === user.username
                ? "bg-green-950 border-green-500"
                : "bg-zinc-900 border-zinc-800"
            }`}
          >

            <div className="flex items-center gap-6">

              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-xl font-bold">
                {index + 4}
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {user.username}
                </h2>

                <p className="text-gray-400">
                  {user.title}
                </p>

              </div>

            </div>

            <div className="text-right">

              <h2 className="text-2xl font-bold text-green-400">
                ⭐ {user.geniusPoints}
              </h2>

              <p className="text-gray-400">
                🔥 {user.streak} Days
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
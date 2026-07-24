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

  geniusPoints: number;
  streak: number;
  title: string;

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
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  async function loadUser() {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) return;

    const localUser = JSON.parse(currentUser);

    const res = await fetch("/api/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localUser.username,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data)
      );
    }
  }

  loadUser();
}, []);

  if (!user) {
    
    return (
      
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
      
    );
  }
  const nationalAccuracy =
  user.stats.national.attempts === 0
    ? 0
    : Math.round(
        (user.stats.national.correct /
          user.stats.national.attempts) *
          100
      );

const satAccuracy =
  user.stats.sat.attempts === 0
    ? 0
    : Math.round(
        (user.stats.sat.correct /
          user.stats.sat.attempts) *
          100
      );

const olympiadAccuracy =
  user.stats.olympiad.attempts === 0
    ? 0
    : Math.round(
        (user.stats.olympiad.correct /
          user.stats.olympiad.attempts) *
          100
      );

const dailyAccuracy =
  user.stats.daily.attempts === 0
    ? 0
    : Math.round(
        (user.stats.daily.correct /
          user.stats.daily.attempts) *
          100
      );

const averageSprintScore =
  user.stats.mathSpirit.games === 0
    ? 0
    : Math.round(
        user.stats.mathSpirit.totalScore /
          user.stats.mathSpirit.games
      );

  return (
    
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto">

        <div className="border border-gray-700 rounded-3xl p-6 md:p-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">

            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-800 flex items-center justify-center text-5xl">
              👤
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold">
                {user.name} {user.surname}
              </h1>
              <p className="text-yellow-400 text-xl mt-2">
  {getTitle(user.geniusPoints)}
</p>
              <p className="text-gray-400 mt-2 text-lg break-all">
                @{user.username}
              </p>
            </div>

          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-xl md:text-2xl break-words">
                {user.name}
              </p>
              
            </div>

            <div>
              <p className="text-gray-400">Surname</p>
              <p className="text-xl md:text-2xl break-words">
                {user.surname}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-xl md:text-2xl break-all">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Username</p>
              <p className="text-xl md:text-2xl break-all">
                @{user.username}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Birthday</p>
              <p className="text-xl md:text-2xl break-words">
                {user.birthday}
              </p>
            </div>

          </div>

          <Link href="/edit-profile">
  <button className="mt-12 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
    Edit Profile
  </button>
</Link>
<div className="mt-14">
  <h2 className="text-4xl font-bold mb-8">
    📊 Learning Statistics
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    {/* National */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        🇺🇿 National Certificate
      </h3>

      <div className="flex justify-between mb-2">
        <span>Attempts</span>
        <span>{user.stats.national.attempts}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Correct</span>
        <span className="text-green-400">
          {user.stats.national.correct}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Accuracy</span>
        <span className="text-yellow-400">
          {nationalAccuracy}%
        </span>
      </div>
    </div>

    {/* SAT */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        🎓 SAT Math
      </h3>

      <div className="flex justify-between mb-2">
        <span>Attempts</span>
        <span>{user.stats.sat.attempts}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Correct</span>
        <span className="text-green-400">
          {user.stats.sat.correct}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Accuracy</span>
        <span className="text-yellow-400">
          {satAccuracy}%
        </span>
      </div>
    </div>

    {/* Olympiad */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        🏆 Olympiad
      </h3>

      <div className="flex justify-between mb-2">
        <span>Attempts</span>
        <span>{user.stats.olympiad.attempts}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Correct</span>
        <span className="text-green-400">
          {user.stats.olympiad.correct}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Accuracy</span>
        <span className="text-yellow-400">
          {olympiadAccuracy}%
        </span>
      </div>
    </div>

    {/* Daily */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        📅 Daily Problem
      </h3>

      <div className="flex justify-between mb-2">
        <span>Attempts</span>
        <span>{user.stats.daily.attempts}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Correct</span>
        <span className="text-green-400">
          {user.stats.daily.correct}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Accuracy</span>
        <span className="text-yellow-400">
          {dailyAccuracy}%
        </span>
      </div>
    </div>

    {/* Math Sprint */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:col-span-2">
      <h3 className="text-2xl font-bold mb-5">
        ⚡ Math Sprint
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

        <div>
          <p className="text-zinc-400">Games</p>
          <h2 className="text-3xl font-bold">
            {user.stats.mathSpirit.games}
          </h2>
        </div>

        <div>
          <p className="text-zinc-400">Highest Score</p>
          <h2 className="text-3xl font-bold text-green-400">
            {user.stats.mathSpirit.highestScore}
          </h2>
        </div>

        <div>
          <p className="text-zinc-400">Average Score</p>
          <h2 className="text-3xl font-bold text-blue-400">
            {averageSprintScore}
          </h2>
        </div>

        <div>
          <p className="text-zinc-400">Best Combo</p>
          <h2 className="text-3xl font-bold text-orange-400">
            🔥 {user.stats.mathSpirit.bestCombo}
          </h2>
        </div>

      </div>
    </div>

  </div>
</div>

        </div>

      </div>
    </div>
  );
}
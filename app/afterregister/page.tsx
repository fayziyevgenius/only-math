"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCards from "@/components/dashboard/StatsCards";

type User = {
  name: string;
  geniusPoints: number;
  streak: number;
  title: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User>({
    name: "User",
    geniusPoints: 0,
    streak: 0,
    title: "🌱 Beginner",
  });

  useEffect(() => {
    async function loadUser() {
      const currentUser = localStorage.getItem("currentUser");

      if (!currentUser) return;

      try {
        const parsed = JSON.parse(currentUser);

        const res = await fetch("/api/dashboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: parsed.username,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    }

    loadUser();
  }, []);

  return (
    <div className="space-y-8">
      <WelcomeBanner name={user.name} />

      <StatsCards
        geniusPoints={user.geniusPoints}
        streak={user.streak}
        title={user.title}
      />

      {/* GENESIS CYCLE */}
      <Link href="/genesis" className="block group">
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950 via-zinc-900 to-black p-6 sm:p-8 transition-all duration-300 hover:border-purple-400/60 hover:scale-[1.01]">

          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🌌</span>

                <div>
                  <p className="text-purple-400 text-sm font-bold uppercase tracking-widest">
                    Current Cycle
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Genesis Cycle
                  </h2>
                </div>
              </div>

              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-6">
                A new cycle of challenges, training and competitions is waiting
                for you. Enter Genesis and start earning Genius Points.
              </p>
            </div>

            <div className="shrink-0">
              <div className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-center transition">
                Enter Genesis →
              </div>
            </div>

          </div>
        </div>
      </Link>
    </div>
  );
}
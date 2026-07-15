"use client";

import { useEffect, useState } from "react";
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
    </div>
  );
}
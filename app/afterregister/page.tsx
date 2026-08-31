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

type CycleTheme = "genesis" | "independence";

type Cycle = {
  name: string;
  number: number;
  start: string;
  end: string;
  theme: CycleTheme;
  icon: string;
  description: string;
  button: string;
  href: string;
};

const CYCLES: Cycle[] = [
  {
    name: "Genesis Cycle",
    number: 1,
    start: "2026-08-17",
    end: "2026-08-30",
    theme: "genesis",
    icon: "🌌",
    description:
      "A new cycle of challenges, training and competitions is waiting for you. Enter Genesis and start earning Genius Points.",
    button: "Enter Genesis →",
    href: "/genesis",
  },
  {
    name: "Independence Cycle",
    number: 2,
    start: "2026-08-31",
    end: "2026-09-13",
    theme: "independence",
    icon: "🇺🇿",
    description:
      "Celebrate Uzbekistan's Independence with a new cycle of challenges, training and competitions. Earn Genius Points and become a Math Genius.",
    button: "Enter Independence →",
    href: "/independence",
  },
];

function getDateOnly(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function getActiveCycle(date: Date): Cycle {
  const current = getDateOnly(date);

  for (const cycle of CYCLES) {
    const start = new Date(`${cycle.start}T00:00:00`);
    const end = new Date(`${cycle.end}T23:59:59`);

    if (current >= start && current <= end) {
      return cycle;
    }
  }

  const firstStart = new Date(
    `${CYCLES[0].start}T00:00:00`
  );

  if (current < firstStart) {
    return CYCLES[0];
  }

  return CYCLES[CYCLES.length - 1];
}

function formatCycleDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User>({
    name: "User",
    geniusPoints: 0,
    streak: 0,
    title: "🌱 Beginner",
  });

  const [currentCycle, setCurrentCycle] =
    useState<Cycle | null>(null);

  useEffect(() => {
    const updateCycle = () => {
      setCurrentCycle(getActiveCycle(new Date()));
    };

    updateCycle();

    const timer = setInterval(
      updateCycle,
      60 * 1000
    );

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    async function loadUser() {
      const currentUser =
        localStorage.getItem("currentUser");

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
        console.error(
          "Dashboard error:",
          error
        );
      }
    }

    loadUser();
  }, []);

  if (!currentCycle) {
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

  const isIndependence =
    currentCycle.theme === "independence";

  return (
    <div className="space-y-8">
      <WelcomeBanner name={user.name} />

      <StatsCards
        geniusPoints={user.geniusPoints}
        streak={user.streak}
        title={user.title}
      />

      <Link
        href={currentCycle.href}
        className="block group"
      >
        <div
          className={`
            relative
            overflow-hidden
            rounded-3xl
            border
            p-6
            sm:p-8
            transition-all
            duration-300
            hover:scale-[1.01]
            ${
              isIndependence
                ? `
                  border-blue-500/30
                  bg-gradient-to-br
                  from-blue-950
                  via-zinc-900
                  to-black
                  hover:border-blue-400/60
                `
                : `
                  border-purple-500/30
                  bg-gradient-to-br
                  from-purple-950
                  via-zinc-900
                  to-black
                  hover:border-purple-400/60
                `
            }
          `}
        >
          <div
            className={`
              absolute
              -top-24
              -right-24
              h-56
              w-56
              rounded-full
              blur-3xl
              ${
                isIndependence
                  ? "bg-blue-600/20"
                  : "bg-purple-600/20"
              }
            `}
          />

          <div
            className={`
              absolute
              -bottom-24
              -left-24
              h-56
              w-56
              rounded-full
              blur-3xl
              ${
                isIndependence
                  ? "bg-green-600/10"
                  : "bg-blue-600/10"
              }
            `}
          />

          {isIndependence && (
            <>
              <div className="absolute right-20 top-8 text-5xl opacity-10 blur-[1px]">
                🇺🇿
              </div>

              <div className="absolute bottom-5 right-1/3 text-4xl opacity-10">
                🇺🇿
              </div>
            </>
          )}

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="text-4xl">
                  {currentCycle.icon}
                </span>

                <div>
                  <p
                    className={`
                      text-sm
                      font-bold
                      uppercase
                      tracking-widest
                      ${
                        isIndependence
                          ? "text-blue-400"
                          : "text-purple-400"
                      }
                    `}
                  >
                    Current Cycle
                  </p>

                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    {currentCycle.name}
                  </h2>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                {currentCycle.description}
              </p>

              <p className="mt-3 text-xs font-medium text-zinc-600">
                Cycle {currentCycle.number} •{" "}
                {formatCycleDate(currentCycle.start)} —{" "}
                {formatCycleDate(currentCycle.end)}
              </p>
            </div>

            <div className="shrink-0">
              <div
                className={`
                  rounded-full
                  px-6
                  py-3
                  text-center
                  font-bold
                  text-white
                  transition
                  ${
                    isIndependence
                      ? `
                        bg-blue-600
                        hover:bg-blue-500
                        shadow-[0_0_30px_rgba(37,99,235,0.25)]
                      `
                      : `
                        bg-purple-600
                        hover:bg-purple-500
                        shadow-[0_0_30px_rgba(147,51,234,0.25)]
                      `
                  }
                `}
              >
                {currentCycle.button}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
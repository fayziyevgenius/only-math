"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  User,
  FileText,
  Calculator,
  Trophy,
  CalendarDays,
  LogOut,
  Zap,
  Globe,
  Share2,
  Medal,
  BookOpen,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

/* =========================================================
   CYCLES
========================================================= */

type CycleTheme = "genesis" | "independence";

type Cycle = {
  name: string;
  number: number;
  start: string;
  end: string;
  theme: CycleTheme;
};

const CYCLES: Cycle[] = [
  {
    name: "Genesis Cycle",
    number: 1,
    start: "2026-08-17",
    end: "2026-08-30",
    theme: "genesis",
  },
  {
    name: "Independence Cycle",
    number: 2,
    start: "2026-08-31",
    end: "2026-09-13",
    theme: "independence",
  },
];

/* =========================================================
   CYCLE HELPERS
========================================================= */

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

/* =========================================================
   GENESIS PARTICLES
========================================================= */

const genesisSymbols = [
  {
    left: "5%",
    top: "16%",
    symbol: "π",
    size: "text-6xl md:text-8xl",
    delay: "0s",
  },
  {
    left: "14%",
    top: "72%",
    symbol: "∑",
    size: "text-5xl md:text-7xl",
    delay: "-3s",
  },
  {
    left: "26%",
    top: "22%",
    symbol: "∞",
    size: "text-7xl md:text-9xl",
    delay: "-6s",
  },
  {
    left: "39%",
    top: "78%",
    symbol: "√",
    size: "text-6xl md:text-8xl",
    delay: "-2s",
  },
  {
    left: "52%",
    top: "15%",
    symbol: "∫",
    size: "text-5xl md:text-7xl",
    delay: "-8s",
  },
  {
    left: "64%",
    top: "69%",
    symbol: "π",
    size: "text-7xl md:text-9xl",
    delay: "-5s",
  },
  {
    left: "76%",
    top: "23%",
    symbol: "Σ",
    size: "text-6xl md:text-8xl",
    delay: "-10s",
  },
  {
    left: "88%",
    top: "73%",
    symbol: "∞",
    size: "text-5xl md:text-7xl",
    delay: "-4s",
  },
];

/* =========================================================
   INDEPENDENCE FLAGS
========================================================= */

const independenceFlags = [
  ["3%", "12%", "text-4xl md:text-6xl", "18s", "-3s", "-10deg"],
  ["12%", "68%", "text-5xl md:text-7xl", "24s", "-12s", "12deg"],
  ["20%", "27%", "text-3xl md:text-5xl", "21s", "-8s", "-8deg"],
  ["30%", "78%", "text-6xl md:text-8xl", "27s", "-17s", "9deg"],
  ["39%", "13%", "text-4xl md:text-6xl", "20s", "-5s", "-12deg"],
  ["48%", "60%", "text-3xl md:text-5xl", "23s", "-14s", "10deg"],
  ["56%", "24%", "text-6xl md:text-8xl", "26s", "-20s", "-7deg"],
  ["66%", "76%", "text-4xl md:text-6xl", "22s", "-9s", "14deg"],
  ["74%", "17%", "text-5xl md:text-7xl", "25s", "-16s", "-11deg"],
  ["83%", "52%", "text-3xl md:text-5xl", "19s", "-6s", "8deg"],
  ["92%", "27%", "text-6xl md:text-8xl", "28s", "-22s", "-13deg"],
  ["96%", "78%", "text-4xl md:text-6xl", "21s", "-11s", "11deg"],
];

/* =========================================================
   GENESIS BACKGROUND
========================================================= */

function GenesisBackground() {
  return (
    <div className="cycle-background genesis-background">
      {/* Base */}

      <div className="absolute inset-0 bg-[#020604]" />

      {/* Ambient glows */}

      <div className="genesis-glow genesis-glow-one" />

      <div className="genesis-glow genesis-glow-two" />

      <div className="genesis-glow genesis-glow-three" />

      {/* Grid */}

      <div className="genesis-grid" />

      {/* Big word */}

      <div className="genesis-title">
        GENESIS
      </div>

      <div className="genesis-subtitle">
        THE BEGINNING OF SOMETHING GREAT
      </div>

      {/* Orbits */}

      <div className="genesis-orbit genesis-orbit-one" />

      <div className="genesis-orbit genesis-orbit-two" />

      <div className="genesis-orbit genesis-orbit-three" />

      {/* Symbols */}

      {genesisSymbols.map((particle, index) => (
        <div
          key={`genesis-symbol-${index}`}
          className={`genesis-symbol ${particle.size}`}
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
          }}
        >
          {particle.symbol}
        </div>
      ))}

      {/* Stars */}

      <div className="genesis-star genesis-star-one">
        ✦
      </div>

      <div className="genesis-star genesis-star-two">
        ✦
      </div>

      <div className="genesis-star genesis-star-three">
        ✦
      </div>

      <div className="genesis-star genesis-star-four">
        ✦
      </div>

      <div className="genesis-star genesis-star-five">
        ✦
      </div>

      {/* Floating dots */}

      <div className="genesis-dot genesis-dot-one" />
      <div className="genesis-dot genesis-dot-two" />
      <div className="genesis-dot genesis-dot-three" />
      <div className="genesis-dot genesis-dot-four" />
      <div className="genesis-dot genesis-dot-five" />

      {/* Center energy */}

      <div className="genesis-energy">
        <div className="genesis-energy-ring" />
        <div className="genesis-energy-core" />
      </div>
    </div>
  );
}

/* =========================================================
   INDEPENDENCE BACKGROUND
========================================================= */

function IndependenceBackground() {
  return (
    <div className="cycle-background independence-background">
      {/* Base */}

      <div className="absolute inset-0 bg-[#020609]" />

      {/* Blue atmospheric glow */}

      <div className="independence-glow independence-glow-blue" />

      {/* Green atmospheric glow */}

      <div className="independence-glow independence-glow-green" />

      {/* Red atmospheric glow */}

      <div className="independence-glow independence-glow-red" />

      {/* Grid */}

      <div className="independence-grid" />

      {/* Flag light */}

      <div className="independence-light-line independence-light-blue" />

      <div className="independence-light-line independence-light-white" />

      <div className="independence-light-line independence-light-green" />

      {/* Big title */}

      <div className="independence-title">
        INDEPENDENCE
      </div>

      <div className="independence-subtitle">
        O'ZBEKISTON
      </div>

      {/* Flags */}

      {independenceFlags.map((flag, index) => (
        <div
          key={`independence-flag-${index}`}
          className="independence-flag"
          style={{
            left: flag[0],
            top: flag[1],
            animationDuration: flag[3],
            animationDelay: flag[4],
          }}
        >
          <div
            className={flag[2]}
            style={{
              transform: `rotate(${flag[5]})`,
            }}
          >
            🇺🇿
          </div>
        </div>
      ))}

      {/* Extra flags */}

      <div className="independence-extra independence-extra-one">
        🇺🇿
      </div>

      <div className="independence-extra independence-extra-two">
        🇺🇿
      </div>

      <div className="independence-extra independence-extra-three">
        🇺🇿
      </div>

      <div className="independence-extra independence-extra-four">
        🇺🇿
      </div>

      {/* Stars */}

      <div className="independence-star independence-star-one">
        ✦
      </div>

      <div className="independence-star independence-star-two">
        ✦
      </div>

      <div className="independence-star independence-star-three">
        ✦
      </div>

      <div className="independence-star independence-star-four">
        ✦
      </div>

      <div className="independence-star independence-star-five">
        ✦
      </div>

      {/* Crescent-style decorative circles */}

      <div className="independence-moon independence-moon-one" />

      <div className="independence-moon independence-moon-two" />
    </div>
  );
}

/* =========================================================
   CYCLE INDICATOR
========================================================= */

function CycleIndicator({
  cycle,
}: {
  cycle: Cycle;
}) {
  const independence =
    cycle.theme === "independence";

  return (
    <div
      className={`cycle-indicator ${
        independence
          ? "cycle-indicator-independence"
          : "cycle-indicator-genesis"
      }`}
    >
      <div
        className={`cycle-indicator-icon ${
          independence
            ? "cycle-icon-independence"
            : "cycle-icon-genesis"
        }`}
      >
        {independence ? "🇺🇿" : "✦"}
      </div>

      <div>
        <p
          className={`cycle-indicator-label ${
            independence
              ? "text-blue-300"
              : "text-green-300"
          }`}
        >
          CURRENT CYCLE
        </p>

        <p className="text-sm font-black text-white">
          {cycle.name}
        </p>

        <p className="text-[10px] text-zinc-400">
          {formatCycleDate(cycle.start)} —{" "}
          {formatCycleDate(cycle.end)}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN CLIENT LAYOUT
========================================================= */

export default function ClientLayout({
  children,
}: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [cycle, setCycle] =
    useState<Cycle>(CYCLES[0]);

  const [cycleReady, setCycleReady] =
    useState(false);

  /* =======================================================
     AUTH PAGES
  ======================================================= */

  const isAuthPage =
    pathname === "/" ||
    pathname === "/registration" ||
    pathname === "/forgot" ||
    pathname === "/verify" ||
    pathname === "/verifypassword" ||
    pathname === "/resetpassword";

  /* =======================================================
     CURRENT CYCLE
  ======================================================= */
  useEffect(() => {
  async function checkCycleReset() {
    try {
      const res = await fetch("/api/cycle-reset", {
        method: "POST",
        cache: "no-store",
      });

      const data = await res.json();

      if (data.reset) {
        console.log(
          "🇺🇿 Independence Cycle started:",
          data
        );

        // LocalStorage'dagi eski user ma'lumotlarini ham
        // yangilash uchun currentUser ni tozalaymiz.
        //
        // Keyingi sahifa /api/me orqali yangi
        // ma'lumotlarni oladi.

        const currentUser =
          localStorage.getItem("currentUser");

        if (currentUser) {
          try {
            const user = JSON.parse(currentUser);

            const resetUser = {
              ...user,

              geniusPoints: 0,
              title: "🌱 Beginner",
              streak: 0,

              dailySolved: false,

              currentCycle: 2,

              stats: {
                ...user.stats,

                national: {
                  attempts: 0,
                  correct: 0,
                },

                sat: {
                  attempts: 0,
                  correct: 0,
                },

                olympiad: {
                  attempts: 0,
                  correct: 0,
                },

                daily: {
                  attempts: 0,
                  correct: 0,
                },

                mathSpirit: {
                  games: 0,
                  highestScore: 0,
                  totalScore: 0,
                  bestCombo: 0,
                },
              },
            };

            localStorage.setItem(
              "currentUser",
              JSON.stringify(resetUser)
            );
          } catch (error) {
            console.error(
              "Local user reset error:",
              error
            );
          }
        }

        // Page'ni yangilaymiz.
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Cycle reset check error:",
        error
      );
    }
  }

  checkCycleReset();
}, []);
  useEffect(() => {
    const updateCycle = () => {
      setCycle(
        getActiveCycle(new Date())
      );

      setCycleReady(true);
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

  /* =======================================================
     AUTH CHECK
  ======================================================= */

  useEffect(() => {
    if (isAuthPage) {
      return;
    }

    const currentUser =
      localStorage.getItem(
        "currentUser"
      );

    if (!currentUser) {
      router.replace("/");
    }
  }, [isAuthPage, router]);

  /* =======================================================
     CLOSE MOBILE MENU ON NAVIGATION
  ======================================================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* =======================================================
     LOGOUT
  ======================================================= */

  function handleLogout() {
    localStorage.removeItem(
      "currentUser"
    );

    localStorage.removeItem(
      "onlyMathAvatar"
    );

    router.replace("/");
  }

  /* =======================================================
     LINK CLASS
  ======================================================= */

  function getLinkClass(href: string) {
    const isActive =
      pathname === href ||
      pathname.startsWith(`${href}/`);

    if (isActive) {
      return `
        group
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        bg-green-500/15
        border
        border-green-500/20
        text-green-300
        shadow-[0_0_25px_rgba(34,197,94,0.08)]
        transition-all
      `;
    }

    return `
      group
      flex
      items-center
      gap-3
      rounded-xl
      px-3
      py-2.5
      text-zinc-300
      border
      border-transparent
      hover:bg-zinc-900/80
      hover:border-zinc-800
      hover:text-green-400
      transition-all
    `;
  }

  /* =======================================================
     AUTH PAGE
  ======================================================= */

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-black text-white">
        {children}
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-white">
      {/* BACKGROUND */}

      {cycleReady &&
        cycle.theme === "genesis" && (
          <GenesisBackground />
        )}

      {cycleReady &&
        cycle.theme === "independence" && (
          <IndependenceBackground />
        )}

      {/* CYCLE INDICATOR */}

      {cycleReady && (
        <CycleIndicator cycle={cycle} />
      )}

      {/* APP */}

      <div className="relative z-10 flex min-h-screen">
        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          aria-label="Open menu"
          onClick={() =>
            setMenuOpen(true)
          }
          className="
            fixed
            top-4
            left-4
            z-[90]
            md:hidden
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-zinc-700
            bg-black/70
            text-zinc-200
            shadow-2xl
            backdrop-blur-xl
            transition
            hover:border-green-500/50
            hover:text-green-400
          "
        >
          <Menu size={22} />
        </button>

        {/* MOBILE OVERLAY */}

        {menuOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMenuOpen(false)
            }
            className="
              fixed
              inset-0
              z-[75]
              bg-black/70
              backdrop-blur-sm
              md:hidden
            "
          />
        )}

        {/* SIDEBAR */}

        <aside
          className={`
            fixed
            top-0
            left-0
            z-[80]
            flex
            h-screen
            w-72
            flex-col
            overflow-y-auto
            border-r
            border-zinc-800/70
            bg-black/75
            p-5
            shadow-2xl
            backdrop-blur-2xl
            transition-transform
            duration-300
            md:translate-x-0
            ${
              menuOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* MOBILE CLOSE */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMenuOpen(false)
            }
            className="
              mb-4
              ml-auto
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-zinc-500
              transition
              hover:bg-zinc-900
              hover:text-white
              md:hidden
            "
          >
            <X size={21} />
          </button>

          {/* LOGO */}

          <Link
            href="/afterregister"
            onClick={() =>
              setMenuOpen(false)
            }
            className="
              group
              mb-7
              flex
              items-center
              gap-3
              rounded-2xl
              p-2
              transition
              hover:bg-zinc-900/70
            "
          >
            <div
              className="
                relative
                shrink-0
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-green-500/30
                  blur-xl
                  transition
                  group-hover:bg-green-400/50
                "
              />

              <img
                src="/logo.png"
                alt="Only Math Logo"
                className="
                  relative
                  h-16
                  w-16
                  rounded-full
                  border-2
                  border-green-500/70
                  bg-black
                  p-1
                "
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-green-400">
                Only Math
              </h1>

              <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                Learn. Solve. Become.
              </p>
            </div>
          </Link>

          {/* CURRENT CYCLE */}

          {cycleReady && (
            <div
              className={`
                mb-6
                overflow-hidden
                rounded-2xl
                border
                p-4
                ${
                  cycle.theme ===
                  "independence"
                    ? "border-blue-500/20 bg-blue-500/[0.06]"
                    : "border-green-500/20 bg-green-500/[0.06]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${
                      cycle.theme ===
                      "independence"
                        ? "bg-blue-500/10"
                        : "bg-green-500/10"
                    }
                  `}
                >
                  {cycle.theme ===
                  "independence"
                    ? "🇺🇿"
                    : "✦"}
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Current Cycle
                  </p>

                  <p
                    className={`
                      truncate
                      text-sm
                      font-black
                      ${
                        cycle.theme ===
                        "independence"
                          ? "text-blue-400"
                          : "text-green-400"
                      }
                    `}
                  >
                    {cycle.name}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-600">
                <span>
                  Cycle {cycle.number}
                </span>

                <span>
                  {formatCycleDate(
                    cycle.start
                  )}{" "}
                  —{" "}
                  {formatCycleDate(
                    cycle.end
                  )}
                </span>
              </div>
            </div>
          )}

          {/* NAVIGATION */}

          <nav className="flex flex-col gap-1.5">
            <Link
              href="/account"
              className={getLinkClass(
                "/account"
              )}
            >
              <User
                size={19}
                className="shrink-0"
              />
              <span>My Account</span>
            </Link>

            <Link
              href="/certificate"
              className={getLinkClass(
                "/certificate"
              )}
            >
              <FileText
                size={19}
                className="shrink-0"
              />
              <span>Certificate</span>
            </Link>

            <Link
              href="/sat"
              className={getLinkClass(
                "/sat"
              )}
            >
              <Calculator
                size={19}
                className="shrink-0"
              />
              <span>SAT</span>
            </Link>

            <Link
              href="/olympiad"
              className={getLinkClass(
                "/olympiad"
              )}
            >
              <Trophy
                size={19}
                className="shrink-0"
              />
              <span>Olympiad</span>
            </Link>

            <Link
              href="/daily"
              className={getLinkClass(
                "/daily"
              )}
            >
              <CalendarDays
                size={19}
                className="shrink-0"
              />
              <span>Daily Problem</span>
            </Link>

            <Link
              href="/training"
              className={getLinkClass(
                "/training"
              )}
            >
              <BookOpen
                size={19}
                className="shrink-0"
              />
              <span>Training</span>

              <span className="ml-auto rounded-full bg-green-500/10 px-2 py-0.5 text-[8px] font-black uppercase text-green-400">
                New
              </span>
            </Link>

            <Link
              href="/achievements"
              className={getLinkClass(
                "/achievements"
              )}
            >
              <Medal
                size={19}
                className="shrink-0"
              />
              <span>Achievements</span>
            </Link>

            <Link
              href="/leaderboard"
              className={getLinkClass(
                "/leaderboard"
              )}
            >
              <Globe
                size={19}
                className="shrink-0"
              />
              <span>Global Leaderboard</span>
            </Link>

            <Link
              href="/math-spirit"
              className={getLinkClass(
                "/math-spirit"
              )}
            >
              <Zap
                size={19}
                className="shrink-0"
              />
              <span>Math Sprint</span>
            </Link>

            <Link
              href="/social"
              className={getLinkClass(
                "/social"
              )}
            >
              <Share2
                size={19}
                className="shrink-0"
              />
              <span>Social Media</span>
            </Link>

            <Link
              href="/contests"
              className={getLinkClass(
                "/contests"
              )}
            >
              <Trophy
                size={19}
                className="shrink-0"
              />

              <span>Contests</span>

              <span
                className="
                  ml-auto
                  rounded-full
                  border
                  border-yellow-500/20
                  bg-yellow-500/10
                  px-2
                  py-0.5
                  text-[8px]
                  font-black
                  uppercase
                  text-yellow-400
                "
              >
                Soon
              </span>
            </Link>
          </nav>

          {/* SIDEBAR FOOTER */}

          <div className="mt-auto pt-6">
            <div className="mb-4 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

            <div className="mb-4 flex items-center gap-2 px-2 text-[9px] uppercase tracking-[0.2em] text-zinc-700">
              <Sparkles size={12} />
              <span>Only Math Universe</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-transparent
                px-3
                py-2.5
                text-red-400
                transition
                hover:border-red-500/10
                hover:bg-red-500/5
                hover:text-red-300
              "
            >
              <LogOut size={19} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}

        <main
          className="
            relative
            z-10
            flex-1
            md:ml-72
          "
        >
          <div
            className="
              min-h-screen
              p-4
              pt-20
              md:p-10
              md:pt-10
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
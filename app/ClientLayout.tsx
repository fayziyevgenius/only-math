"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  User,
  FileText,
  Calculator,
  Trophy,
  CalendarDays,
  Medal,
  LogOut,
  Home,
  Zap,
  Globe,
} from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage =
    pathname === "/" ||
    pathname === "/registration" ||
    pathname === "/forgot" ||
    pathname === "/verify" ||
    pathname === "/verifypassword" ||
    pathname === "/resetpassword";
  useEffect(() => {
  if (isAuthPage) return;

  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    router.replace("/");
  }
}, [isAuthPage, router]);

const handleLogout = () => {
  localStorage.removeItem("currentUser");
  router.replace("/");
};

  return (
    <div className="bg-black text-white min-h-screen flex">
      {!isAuthPage && (
        <>
          <button
            onClick={() => setMenuOpen(true)}
            className="fixed top-4 left-4 z-50 md:hidden bg-zinc-900 border border-zinc-700 rounded-xl p-3"
          >
            ☰
          </button>

          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
          )}

          <aside
            className={`
              fixed top-0 left-0 z-50
              h-screen w-72 bg-black border-r border-zinc-700
              p-6 flex flex-col
              transform transition-transform duration-300
              ${menuOpen ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0 md:static md:flex
            `}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="md:hidden text-3xl self-end mb-4"
            >
              ✕
            </button>

            <Link
              href="/afterregister"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 mb-10"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="w-20 h-20 rounded-full border-2 border-green-500 p-1"
              />

              <h1 className="text-3xl font-bold text-green-400">
                Only Math
              </h1>
            </Link>

            <nav className="flex flex-col gap-5 text-lg">
              <Link
  href="/account"
  onClick={() => setMenuOpen(false)}
  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
    pathname === "/account"
      ? "bg-green-600 text-white"
      : "hover:bg-zinc-800 hover:text-green-400"
  }`}
>
  <User size={20} />
  My Account
</Link>

              <Link
  href="/certificate"
  onClick={() => setMenuOpen(false)}
  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
    pathname === "/certificate"
      ? "bg-green-600 text-white"
      : "hover:bg-zinc-800 hover:text-green-400"
  }`}
>
  <FileText size={20} />
  Certificate
</Link>

              <Link
  href="/sat"
  onClick={() => setMenuOpen(false)}
  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
    pathname === "/sat"
      ? "bg-green-600 text-white"
      : "hover:bg-zinc-800 hover:text-green-400"
  }`}
>
  <Calculator size={20} />
  SAT
</Link>

              <Link
  href="/olympiad"
  onClick={() => setMenuOpen(false)}
  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
    pathname === "/olympiad"
      ? "bg-green-600 text-white"
      : "hover:bg-zinc-800 hover:text-green-400"
  }`}
>
  <Trophy size={20} />
  Olympiad
</Link>

              <Link
  href="/daily"
  onClick={() => setMenuOpen(false)}
  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
    pathname === "/daily"
      ? "bg-green-600 text-white"
      : "hover:bg-zinc-800 hover:text-green-400"
  }`}
>
  <CalendarDays size={20} />
  Daily Problem
</Link>

<Link
  href="/leaderboard"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 hover:text-green-400 transition"
>
  <Globe size={20} />
  <span>Global Leaderboard</span>
</Link>

<Link
  href="/math-spirit"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 hover:text-green-400 transition"
>
  <Zap size={20} />
  <span>Math Sprint</span>
</Link>

<Link
  href="/math-spirit/leaderboard"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 hover:text-green-400 transition"
>
  <Trophy size={20} />
  <span>Sprint Leaderboard</span>
</Link>

            </nav>
            <div className="mt-auto pt-8 border-t border-zinc-700">
  <button
  onClick={handleLogout}
  className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-red-400 hover:bg-zinc-800 hover:text-red-500 transition"
>
    
  <LogOut size={20} />
  Sign Out
</button>
</div>
          </aside>
        </>
      )}

      <main
        className={`
          flex-1
          ${!isAuthPage ? "md:ml-72 p-5 md:p-10" : ""}
        `}
      >
        {children}
      </main>
    </div>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage =
    pathname === "/" ||
    pathname === "/registration" ||
    pathname === "/forgot" ||
    pathname === "/verify" ||
    pathname === "/verifypassword" ||
    pathname === "/resetpassword";

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
                className="hover:text-green-400"
              >
                👤 My Account
              </Link>

              <Link
                href="/certificate"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-400"
              >
                📜 Certificate
              </Link>

              <Link
                href="/sat"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-400"
              >
                📝 SAT
              </Link>

              <Link
                href="/olympiad"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-400"
              >
                🏆 Olympiad
              </Link>

              <Link
                href="/daily"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-400"
              >
                📅 Daily Problem
              </Link>

              <Link
                href="/leaderboard"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-400"
              >
                🥇 Leaderboard
              </Link>
            </nav>
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
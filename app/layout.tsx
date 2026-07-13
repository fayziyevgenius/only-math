"use client"; // Hooklar ishlashi uchun zarur

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
  pathname === "/" ||
  pathname === "/registration" ||
  pathname === "/forgot" ||
  pathname === "/verify";

  return (
    <html lang="en">
      <body className="bg-black text-white flex min-h-screen">
        {!isAuthPage && (
          <div className="w-72 p-6 border-r border-gray-700 flex flex-col shrink-0">
            <Link href="/afterregister" className="flex items-center gap-4 mb-12 group">
              <img 
                src="/logo.png" 
                className="w-20 h-20 rounded-full border-2 border-green-500 p-1 object-cover transition group-hover:scale-110"
                alt="Logo"
              />
              <h1 className="text-3xl font-serif font-bold group-hover:text-green-400">
                Only Math
              </h1>
            </Link>

            <ul className="space-y-6 flex-1">
              <li><Link href="/account" className="hover:text-green-400 transition">My account</Link></li>
              <li><Link href="/certificate" className="hover:text-green-400 transition">Certificate</Link></li>
              <li><Link href="/sat" className="hover:text-green-400 transition">SAT</Link></li>
              <li><Link href="/olympiad" className="hover:text-green-400 transition">Olympiad</Link></li>
              <li><Link href="/daily" className="hover:text-green-400 transition">Daily problem</Link></li>
              <li><Link href="/leaderboard" className="hover:text-green-400 transition">Leaderboard</Link></li>
            </ul>
          </div>
        )}

        {/* Page content */}
        <div className={`flex-1 ${isAuthPage ? 'flex items-center justify-center' : 'p-12'}`}>
          {children}
        </div>

      </body>
    </html>
  );
}
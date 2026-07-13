"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
     
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* top left dots */}
      <div className="absolute top-4 left-6 z-10 flex gap-3">
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
      </div>

      <div className="relative z-10 flex items-start justify-center min-h-screen px-6 pt-10">
        <div className="w-full max-w-[520px] flex flex-col items-center">
          {/* logo + title */}
          <div className="flex items-center gap-4 mb-10">
            <img
              src="/logo.png"
              alt="Only Math logo"
              className="w-24 h-24 rounded-full object-cover border border-white/70"
            />
            <h1 className="text-4xl font-bold">Create an account</h1>
          </div>

          <form className="w-full max-w-[430px] space-y-4">
            {/* Name */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-2xl font-semibold">Name:</label>
              <input
                type="text"
                className="h-12 w-full rounded-md border-2 border-white bg-black px-3 text-xl outline-none"
              />
            </div>

            {/* Surname */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-2xl font-semibold">Surname:</label>
              <input
                type="text"
                className="h-12 w-full rounded-md border-2 border-white bg-black px-3 text-xl outline-none"
              />
            </div>

            {/* Date of birth */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-2xl font-semibold">Date of birth:</label>
              <div className="flex gap-2">
                <select className="h-12 rounded-md border-2 border-white bg-black px-3 text-xl outline-none">
                  <option>Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1}>{i + 1}</option>
                  ))}
                </select>

                <select className="h-12 rounded-md border-2 border-white bg-black px-3 text-xl outline-none">
                  <option>Month</option>
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((month) => (
                    <option key={month}>{month}</option>
                  ))}
                </select>

                <select className="h-12 rounded-md border-2 border-white bg-black px-3 text-xl outline-none">
                  <option>Year</option>
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={2026 - i}>{2026 - i}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-2xl font-semibold">Email:</label>
              <input
                type="email"
                className="h-12 w-full rounded-md border-2 border-white bg-black px-3 text-xl outline-none"
              />
            </div>

            {/* Username */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-2xl font-semibold">Username:</label>
              <input
                type="text"
                className="h-12 w-full rounded-md border-2 border-white bg-black px-3 text-xl outline-none"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-2xl font-semibold">Password:</label>
              <input
                type="password"
                className="h-12 w-full rounded-md border-2 border-white bg-black px-3 text-xl outline-none"
              />
            </div>

            {/* Retype */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-2xl font-semibold">Retype:</label>
              <input
                type="password"
                className="h-12 w-full rounded-md border-2 border-white bg-black px-3 text-xl outline-none"
              />
            </div>

            <div className="flex justify-center pt-5">
              <button
                type="submit"
                className="min-w-[180px] rounded-full bg-white px-10 py-3 text-2xl font-medium text-black transition hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-blue-400 text-lg hover:underline"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
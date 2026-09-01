"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Cycle = {
  name: string;
  number: number;
  theme: "genesis" | "independence";
  start: string;
  end: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [cycle, setCycle] = useState<Cycle | null>(null);

  const [cycleStart, setCycleStart] = useState("");
  const [cycleEnd, setCycleEnd] = useState("");

  const [savingCycle, setSavingCycle] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");

    if (adminSession) {
      try {
        const parsed = JSON.parse(adminSession);

        if (parsed?.isAdmin === true) {
          setLoggedIn(true);
          loadCycle();
        }
      } catch {
        localStorage.removeItem("adminSession");
      }
    }
  }, []);

  async function loadCycle() {
    try {
      const res = await fetch("/api/admin/cycle", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        return;
      }

      setCycle(data.cycle);
      setCycleStart(data.cycle.start);
      setCycleEnd(data.cycle.end);
    } catch (error) {
      console.error("Load cycle error:", error);
    }
  }

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError("Username va passwordni kiriting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Admin login failed.");
        return;
      }

      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          username: data.admin.username,
          isAdmin: true,
        })
      );

      setLoggedIn(true);

      await loadCycle();
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("adminSession");
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setCycle(null);
  }

  async function saveCycle() {
    if (!cycle) return;

    if (!cycleStart || !cycleEnd) {
      setError("Cycle start va end sanalarini kiriting.");
      return;
    }

    if (cycleStart > cycleEnd) {
      setError("Start date end date'dan keyin bo‘lishi mumkin emas.");
      return;
    }

    setSavingCycle(true);
    setError("");
    setSuccess("");

    try {
      const adminSession = localStorage.getItem("adminSession");

      if (!adminSession) {
        setError("Admin session topilmadi.");
        return;
      }

      const admin = JSON.parse(adminSession);

      const res = await fetch("/api/admin/cycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: admin.username,
          start: cycleStart,
          end: cycleEnd,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Cycle saqlanmadi.");
        return;
      }

      setCycle(data.cycle);
      setSuccess(
        "Cycle sanalari saqlandi. Userlarning leaderboard va GP ma'lumotlari o'zgarmadi."
      );
    } catch (error) {
      console.error("Save cycle error:", error);
      setError("Server error.");
    } finally {
      setSavingCycle(false);
    }
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="text-6xl mb-5">🔐</div>

            <h1 className="text-4xl font-bold">
              Admin Panel
            </h1>

            <p className="text-zinc-500 mt-3">
              Only Math Administration
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-lg font-bold mb-2">
                Admin username
              </label>

              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleLogin();
                  }
                }}
                className="w-full h-14 rounded-xl border-2 border-zinc-700 bg-zinc-950 px-4 text-lg outline-none focus:border-purple-500"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-2">
                Admin password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleLogin();
                  }
                }}
                className="w-full h-14 rounded-xl border-2 border-zinc-700 bg-zinc-950 px-4 text-lg outline-none focus:border-purple-500"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-14 rounded-xl bg-white text-black text-lg font-bold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Checking..." : "Admin Sign in"}
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full text-zinc-500 hover:text-white transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-purple-400 font-bold">
              ONLY MATH
            </p>

            <h1 className="text-4xl font-bold mt-1">
              Admin Panel
            </h1>

            <p className="text-zinc-500 mt-2">
              Administration dashboard
            </p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-900 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Current Cycle
                </h2>

                <p className="text-zinc-500 mt-1">
                  Cycle sanasini boshqarish
                </p>
              </div>

              <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 font-bold">
                {cycle?.name || "Loading..."}
              </span>
            </div>

            {cycle && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-zinc-500 mb-2">
                    Cycle
                  </label>

                  <div className="h-12 rounded-xl bg-zinc-900 border border-zinc-800 px-4 flex items-center font-bold">
                    {cycle.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-500 mb-2">
                    Start date
                  </label>

                  <input
                    type="date"
                    value={cycleStart}
                    onChange={(e) =>
                      setCycleStart(e.target.value)
                    }
                    className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 px-4 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-500 mb-2">
                    End date
                  </label>

                  <input
                    type="date"
                    value={cycleEnd}
                    onChange={(e) =>
                      setCycleEnd(e.target.value)
                    }
                    className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 px-4 outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={saveCycle}
                  disabled={savingCycle}
                  className="w-full h-13 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold transition disabled:opacity-50"
                >
                  {savingCycle
                    ? "Saving..."
                    : "Save Cycle Dates"}
                </button>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
                    {success}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold mb-4">
              Leaderboard Protection
            </h2>

            <div className="space-y-3 text-zinc-400">
              <p>
                ✅ Admin leaderboardga qo‘shilmaydi.
              </p>

              <p>
                ✅ Admin Genius Points olmaydi.
              </p>

              <p>
                ✅ Cycle sanasini o‘zgartirish userlarning GP'larini reset qilmaydi.
              </p>

              <p>
                ✅ Oldingi cycle statistikasi saqlanib qoladi.
              </p>

              <p>
                ✅ Admin faqat savollarni tekshirish uchun ishlatiladi.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
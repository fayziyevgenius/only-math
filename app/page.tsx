"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      router.replace("/afterregister");
    }
  }, [router]);

  async function handleLogin() {
    if (!username.trim() || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
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
        alert(data.error || "Invalid username or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      router.replace("/afterregister");
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* ================================
          BACKGROUND GLOW
      ================================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main purple glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[650px]
            w-[650px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-purple-600/10
            blur-[130px]
          "
        />

        {/* Top left glow */}
        <div
          className="
            absolute
            left-[10%]
            top-[15%]
            h-[250px]
            w-[250px]
            rounded-full
            bg-indigo-500/10
            blur-[100px]
          "
        />

        {/* Bottom right glow */}
        <div
          className="
            absolute
            bottom-[5%]
            right-[5%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-violet-500/10
            blur-[110px]
          "
        />
      </div>

      {/* ================================
          BACKGROUND DOTS
      ================================= */}

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* ================================
          FLOATING STARS
      ================================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="
            absolute
            left-[8%]
            top-[18%]
            text-purple-400/40
            text-2xl
            animate-pulse
          "
        >
          ✦
        </div>

        <div
          className="
            absolute
            left-[18%]
            top-[72%]
            text-purple-400/30
            text-xl
            animate-pulse
          "
        >
          ✧
        </div>

        <div
          className="
            absolute
            right-[10%]
            top-[16%]
            text-purple-400/40
            text-2xl
            animate-pulse
          "
        >
          ✦
        </div>

        <div
          className="
            absolute
            right-[18%]
            top-[70%]
            text-purple-400/30
            text-2xl
            animate-pulse
          "
        >
          ◇
        </div>

        <div
          className="
            absolute
            left-[30%]
            top-[12%]
            text-purple-400/30
            text-lg
            animate-pulse
          "
        >
          ✧
        </div>

        <div
          className="
            absolute
            right-[32%]
            bottom-[12%]
            text-purple-400/40
            text-xl
            animate-pulse
          "
        >
          ✦
        </div>

        <div
          className="
            absolute
            left-[5%]
            bottom-[20%]
            text-purple-400/30
            text-lg
            animate-pulse
          "
        >
          ◇
        </div>

        <div
          className="
            absolute
            right-[5%]
            bottom-[30%]
            text-purple-400/30
            text-lg
            animate-pulse
          "
        >
          ✧
        </div>
      </div>

      {/* ================================
          ORBITS
      ================================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-purple-500/10
          "
        >
          <div
            className="
              absolute
              left-1/2
              top-0
              h-2
              w-2
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-purple-400/60
              shadow-[0_0_20px_rgba(168,85,247,0.7)]
            "
          />
        </div>

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[760px]
            w-[760px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-purple-500/5
          "
        >
          <div
            className="
              absolute
              left-1/2
              bottom-0
              h-2
              w-2
              -translate-x-1/2
              translate-y-1/2
              rounded-full
              bg-purple-400/40
              shadow-[0_0_20px_rgba(168,85,247,0.5)]
            "
          />
        </div>
      </div>

      {/* ================================
          LOGIN CONTENT
      ================================= */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] flex flex-col items-center">

          {/* Logo */}
          <div className="relative mb-2">
            <div
              className="
                absolute
                inset-[-15px]
                rounded-full
                bg-purple-500/10
                blur-2xl
              "
            />

            <img
              src="/logo.png"
              alt="Only Math"
              className="
                relative
                w-36
                h-36
                md:w-52
                md:h-52
                rounded-full
                object-cover
              "
            />
          </div>

          {/* Title */}
          <h1
            className="
              mt-2
              mb-8
              text-4xl
              md:text-6xl
              font-bold
              text-center
            "
          >
            Sign in
          </h1>

          {/* Username */}
          <div className="w-full mb-8">
            <label
              htmlFor="username"
              className="text-xl md:text-3xl font-bold"
            >
              Email or Username:
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="
                w-full
                h-14
                md:h-16
                mt-3
                rounded-xl
                border-2
                border-white
                bg-black
                px-5
                text-lg
                md:text-2xl
                text-white
                outline-none
                focus:border-purple-400
                transition
              "
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="text-xl md:text-3xl font-bold"
            >
              Password:
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleLogin();
                }
              }}
              autoComplete="current-password"
              className="
                w-full
                h-14
                md:h-16
                mt-3
                rounded-xl
                border-2
                border-white
                bg-black
                px-5
                text-lg
                md:text-2xl
                text-white
                outline-none
                focus:border-purple-400
                transition
              "
            />
          </div>

          {/* Sign in button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="
              mt-8
              w-full
              h-16
              rounded-full
              bg-white
              text-black
              text-2xl
              font-bold
              hover:scale-[1.03]
              active:scale-[0.98]
              transition
              disabled:opacity-60
              disabled:hover:scale-100
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Forgot password */}
          <Link
            href="/forgot"
            className="
              mt-8
              text-blue-500
              text-xl
              md:text-2xl
              hover:underline
            "
          >
            Forgot your password?
          </Link>

          {/* Registration */}
          <Link
            href="/registration"
            className="
              mt-5
              text-blue-500
              text-xl
              md:text-2xl
              hover:underline
            "
          >
            Don't have an account yet?
          </Link>
        </div>
      </div>
    </main>
  );
}
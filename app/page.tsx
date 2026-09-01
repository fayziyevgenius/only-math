"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
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
        return;
      }

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

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

      {/* BACKGROUND GLOW */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

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

      {/* DOTS */}

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* STARS */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute left-[8%] top-[18%] text-purple-400/40 text-2xl animate-pulse">
          ✦
        </div>

        <div className="absolute left-[18%] top-[72%] text-purple-400/30 text-xl animate-pulse">
          ✧
        </div>

        <div className="absolute right-[10%] top-[16%] text-purple-400/40 text-2xl animate-pulse">
          ✦
        </div>

        <div className="absolute right-[18%] top-[70%] text-purple-400/30 text-2xl animate-pulse">
          ◇
        </div>

        <div className="absolute left-[30%] top-[12%] text-purple-400/30 text-lg animate-pulse">
          ✧
        </div>

        <div className="absolute right-[32%] bottom-[12%] text-purple-400/40 text-xl animate-pulse">
          ✦
        </div>

        <div className="absolute left-[5%] bottom-[20%] text-purple-400/30 text-lg animate-pulse">
          ◇
        </div>

        <div className="absolute right-[5%] bottom-[30%] text-purple-400/30 text-lg animate-pulse">
          ✧
        </div>

      </div>

      {/* ORBITS */}

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

      {/* LOGIN */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">

        <div className="w-full max-w-[420px] flex flex-col items-center">

          {/* LOGO */}

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

          {/* TITLE */}

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

          {/* USERNAME / EMAIL */}

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
              onChange={(e) =>
                setUsername(e.target.value)
              }
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

          {/* PASSWORD */}

<div className="w-full">

  <label
    htmlFor="password"
    className="text-xl md:text-3xl font-bold"
  >
    Password:
  </label>

  <div className="relative mt-3">

    <input
      id="password"
      type={showPassword ? "text" : "password"}
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
        rounded-xl
        border-2
        border-white
        bg-black
        px-5
        pr-16
        text-lg
        md:text-2xl
        text-white
        outline-none
        focus:border-purple-400
        transition
      "
    />

    {/* EYE BUTTON */}

    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        w-10
        h-10
        flex
        items-center
        justify-center
        rounded-lg
        text-white
        hover:bg-white/10
        hover:text-purple-400
        transition
        cursor-pointer
      "
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        /* EYE OFF */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.6 10.6a2 2 0 002.8 2.8"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.9 4.2A10.8 10.8 0 0112 4c5 0 8.7 4.2 10 8-0.5 1.5-1.4 3-2.6 4.2"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.6 6.6C4.8 7.8 3.6 9.5 2 12c1.3 3.8 5 8 10 8 1.3 0 2.5-.3 3.6-.8"
          />
        </svg>
      ) : (
        /* EYE */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
          />

          <circle
            cx="12"
            cy="12"
            r="3"
          />
        </svg>
      )}
    </button>

  </div>

</div>

          {/* SIGN IN */}

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
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>

          {/* FORGOT PASSWORD */}

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

          {/* REGISTER */}

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
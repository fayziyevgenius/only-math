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
    if (!username || !password) {
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
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        setLoading(false);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      router.replace("/afterregister");
    } catch (error) {
      console.error(error);
      alert("Server error.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* =====================================================
          GENESIS BACKGROUND
      ====================================================== */}

      {/* Main radial glow */}
      <div className="absolute inset-0 pointer-events-none">
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

      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* =====================================================
          GENESIS FLOATING PARTICLES
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="genesis-star star-1">✦</div>
        <div className="genesis-star star-2">✧</div>
        <div className="genesis-star star-3">✦</div>
        <div className="genesis-star star-4">◇</div>
        <div className="genesis-star star-5">✧</div>
        <div className="genesis-star star-6">✦</div>
        <div className="genesis-star star-7">◇</div>
        <div className="genesis-star star-8">✧</div>

        {/* Orbit */}
        <div className="genesis-orbit orbit-1">
          <div className="orbit-point" />
        </div>

        <div className="genesis-orbit orbit-2">
          <div className="orbit-point" />
        </div>
      </div>

      {/* =====================================================
          LOGIN
      ====================================================== */}

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
          <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-8">
            Sign in
          </h1>

          {/* Username */}
          <div className="w-full mb-8">
            <label className="text-xl md:text-3xl font-bold">
              Email or Username:
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                outline-none
                focus:border-purple-400
                transition
              "
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <label className="text-xl md:text-3xl font-bold">
              Password:
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
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
                outline-none
                focus:border-purple-400
                transition
              "
            />
          </div>

          {/* Sign in */}
          <button
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
            "
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Links */}
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

      {/* =====================================================
          GENESIS ANIMATION CSS
      ====================================================== */}

      <style jsx>{`
        .genesis-star {
          position: absolute;
          color: rgba(168, 85, 247, 0.45);
          font-size: 24px;
          animation: genesisFloat 7s ease-in-out infinite;
        }

        .star-1 {
          left: 8%;
          top: 18%;
          animation-delay: 0s;
        }

        .star-2 {
          left: 18%;
          top: 72%;
          animation-delay: 1.2s;
        }

        .star-3 {
          right: 10%;
          top: 16%;
          animation-delay: 2s;
        }

        .star-4 {
          right: 18%;
          top: 70%;
          animation-delay: 3s;
        }

        .star-5 {
          left: 30%;
          top: 12%;
          font-size: 18px;
          animation-delay: 2.5s;
        }

        .star-6 {
          right: 32%;
          bottom: 12%;
          font-size: 20px;
          animation-delay: 4s;
        }

        .star-7 {
          left: 5%;
          bottom: 20%;
          font-size: 18px;
          animation-delay: 3.5s;
        }

        .star-8 {
          right: 5%;
          bottom: 30%;
          font-size: 18px;
          animation-delay: 1.8s;
        }

        .genesis-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(168, 85, 247, 0.08);
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          animation: orbitRotate 18s linear infinite;
        }

        .orbit-1 {
          width: 520px;
          height: 520px;
        }

        .orbit-2 {
          width: 760px;
          height: 760px;
          animation-duration: 28s;
          animation-direction: reverse;
        }

        .orbit-point {
          position: absolute;
          top: -4px;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.7);
        }

        @keyframes genesisFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.25;
          }

          50% {
            transform: translateY(-25px) rotate(180deg);
            opacity: 0.7;
          }
        }

        @keyframes orbitRotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .genesis-orbit {
            display: none;
          }

          .genesis-star {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}
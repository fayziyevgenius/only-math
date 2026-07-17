"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

    localStorage.setItem(
  "currentUser",
  JSON.stringify(data.user)
);

router.replace("/afterregister");
  } catch (error) {
    console.error(error);
    alert("Server error.");
  }

  setLoading(false);
}
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

     

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-[420px] flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Only Math"
            className="w-52 h-52 rounded-full"
          />

          <h1 className="text-6xl font-bold mt-2 mb-10">
            Sign in
          </h1>

          <div className="w-full mb-8">
            <label className="text-3xl font-bold">
              Email or Username:
            </label>

            <input
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  className="w-full h-16 mt-3 rounded-xl border-2 border-white bg-black px-5 text-2xl outline-none"
/>
          </div>

          <div className="w-full">
            <label className="text-3xl font-bold">
              Password:
            </label>

            <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full h-16 mt-3 rounded-xl border-2 border-white bg-black px-5 text-2xl outline-none"
/>
          </div>

          <button
  onClick={handleLogin}
  disabled={loading}
  className="mt-8 w-full h-16 rounded-full bg-white text-black text-2xl font-bold hover:scale-105 transition disabled:opacity-60"
>
  {loading ? "Signing in..." : "Sign in"}
</button>

          <Link
            href="/forgot"
            className="mt-8 text-blue-500 text-2xl hover:underline"
          >
            Forgot your password?
          </Link>

          <Link
            href="/registration"
            className="mt-5 text-blue-500 text-2xl hover:underline"
          >
            Don't have an account yet?
          </Link>
        </div>
      </div>
    </div>
  );
}
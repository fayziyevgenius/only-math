"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const router = useRouter();
  const validateEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
};
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.setItem("resetEmail", email);

    alert("Verification code sent successfully!");

    router.push("/verifypassword");

  } catch (error) {
    console.error(error);
    alert("Server Error.");
  }
};

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      
      <div className="relative z-10 flex items-center justify-center min-h-screen">

        <div className="w-[430px]">

          <div className="flex flex-col items-center mb-12">

            <img
              src="/logo.png"
              className="w-44 h-44 rounded-full"
            />

            <h1 className="text-5xl font-bold mt-6">
              Forgot Password
            </h1>

            <p className="text-gray-400 text-xl mt-4 text-center">
              Enter your email and we'll send you a 6-digit verification code.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <label className="text-2xl font-semibold">
              Email
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-3 w-full h-16 rounded-xl border-2 border-white bg-black px-5 text-xl outline-none"
            />

            
              <button
                className="mt-10 w-full h-16 rounded-full bg-white text-black text-2xl font-bold hover:scale-105 transition"
              >
              Continue
              </button>
       

          </form>

          <div className="text-center mt-8">

            <Link
              href="/"
              className="text-blue-500 text-xl hover:underline"
            >
              Back to Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
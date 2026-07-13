"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleVerify() {
    if (otp.length !== 6) {
      alert("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);

    const registerData = localStorage.getItem("registerData");

    if (!registerData) {
      alert("Registration data not found.");
      setLoading(false);
      return;
    }

    const user = JSON.parse(registerData);

    const res = await fetch("/api/verify-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        otp,
        user,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.removeItem("registerData");

    alert("Account created successfully!");

    router.push("/account");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-6">
      <div className="w-full max-w-md border border-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Verify Email
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Enter the verification code sent to your email.
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="123456"
          className="w-full p-3 rounded-lg bg-black border border-white outline-none text-center text-2xl tracking-[10px]"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError("");
    setConfirmError("");

    let hasError = false;

    if (password.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      hasError = true;
    }

    if (confirmPassword !== password) {
      setConfirmError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    // MongoDB update keyin shu yerga yoziladi

    alert("Password changed successfully!");

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white">

      {/* Background */}
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
              alt="Logo"
              className="w-40 h-40 rounded-full"
            />

            <h1 className="text-5xl font-bold mt-6">
              Reset Password
            </h1>

            <p className="text-gray-400 text-center text-xl mt-4">
              Enter your new password.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <label className="text-2xl font-semibold">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-16 mt-3 rounded-xl border-2 bg-black px-5 text-xl outline-none ${
                passwordError
                  ? "border-red-500"
                  : "border-white"
              }`}
            />

            {passwordError && (
              <p className="text-red-400 mt-2">
                {passwordError}
              </p>
            )}

            <div className="mt-8">

              <label className="text-2xl font-semibold">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className={`w-full h-16 mt-3 rounded-xl border-2 bg-black px-5 text-xl outline-none ${
                  confirmError
                    ? "border-red-500"
                    : "border-white"
                }`}
              />

              {confirmError && (
                <p className="text-red-400 mt-2">
                  {confirmError}
                </p>
              )}

            </div>

            <button
              type="submit"
              className="w-full h-16 rounded-full bg-white text-black text-2xl font-bold mt-12 hover:scale-105 transition"
            >
              Change Password
            </button>

          </form>

          <div className="text-center mt-8">

            <Link
              href="/"
              className="text-blue-400 text-xl hover:underline"
            >
              Back to Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
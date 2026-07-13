"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyPasswordPage() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");

    if (code.length !== 6) {
      alert("Please enter the 6-digit code.");
      return;
    }


    router.push("/resetpassword");
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

        <div className="w-[500px] flex flex-col items-center">

          <img
            src="/logo.png"
            className="w-40 h-40 rounded-full"
            alt="Logo"
          />

          <h1 className="text-5xl font-bold mt-6">
            Verify your email
          </h1>

          <p className="text-gray-400 text-xl text-center mt-5">
            Enter the 6-digit verification code sent to your email.
          </p>

          {/* OTP */}
          <div className="flex gap-4 mt-12">

            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                value={digit}
                maxLength={1}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="w-16 h-16 rounded-xl border-2 border-white bg-black text-center text-3xl outline-none focus:border-green-400"
              />
            ))}

          </div>
          <button
                onClick={handleVerify}
                className="mt-12 w-full h-16 rounded-full bg-white text-black text-2xl font-bold hover:scale-105 transition"
            >
                Confirm
          </button>
     
          <div className="mt-10 text-center">

            {timer > 0 ? (
              <p className="text-gray-400 text-lg">
                Resend code in{" "}
                <span className="text-white font-bold">
                  {timer}s
                </span>
              </p>
            ) : (
              <button
                onClick={() => {
                  setTimer(60);
                  alert("Verification code sent again.");
                }}
                className="text-blue-400 text-xl hover:underline"
              >
                Resend code
              </button>
            )}

          </div>

          <Link
            href="/forgot"
            className="mt-8 text-blue-400 text-xl hover:underline"
          >
            ← Back
          </Link>

        </div>

      </div>
    </div>
  );
}
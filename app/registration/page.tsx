"use client";




import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function RegisterPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [day, setDay] = useState("Day");
  const [month, setMonth] = useState("Month");
  const [year, setYear] = useState("Year");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    date: "",
    email: "",
    username: "",
    password: "",
    confirm: "",
  });
  
  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/send-otp", {
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

router.push("/verify");

    const newErrors = {
      name: "",
      surname: "",
      date: "",
      email: "",
      username: "",
      password: "",
      confirm: "",
    };

    if (!name.trim()) newErrors.name = "Name is required";
    if (!surname.trim()) newErrors.surname = "Surname is required";

    if (day === "Day" || month === "Month" || year === "Year") {
      newErrors.date = "Date of birth is required";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirm.trim()) {
      newErrors.confirm = "Please retype your password";
    } else if (password !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((value) => value !== "");
    if (hasError) return;

    try {
      setLoading(true);
      setOtpError("");
      setOtpSuccess("");

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Failed to send verification code");
        return;
      }

      localStorage.setItem(
        "registerData",
        JSON.stringify({
          name,
          surname,
          day,
          month,
          year,
          email,
          username,
          password,
     })
);

router.push("/verify");
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    setOtpError("");
    setOtpSuccess("");

    if (!otp.trim()) {
      setOtpError("Please enter the 6-digit code.");
      return;
    }

    if (otp !== serverOtp) {
      setOtpError("Wrong verification code.");
      return;
    }

    setOtpSuccess("Email verified successfully!");
    alert("Email verified successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-[600px]">
        <div className="flex flex-col items-center mb-12">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "150px", height: "150px" }}
            className="rounded-full object-cover"
          />
          <h1 className="text-4xl font-bold mt-6">Create an account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xl">Name:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full h-14 mt-2 px-4 rounded-lg bg-black border-2 outline-none ${
                errors.name ? "border-rose-500" : "border-white"
              }`}
            />
            {errors.name && (
              <p className="text-rose-400 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-xl">Surname:</label>
            <input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className={`w-full h-14 mt-2 px-4 rounded-lg bg-black border-2 outline-none ${
                errors.surname ? "border-rose-500" : "border-white"
              }`}
            />
            {errors.surname && (
              <p className="text-rose-400 mt-1">{errors.surname}</p>
            )}
          </div>

          <div>
            <label className="text-xl">Date of birth:</label>
            <div className="flex gap-3 mt-2">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className={`h-12 px-3 bg-black border-2 rounded-lg outline-none ${
                  errors.date ? "border-rose-500" : "border-white"
                }`}
              >
                <option>Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={`h-12 px-3 bg-black border-2 rounded-lg outline-none ${
                  errors.date ? "border-rose-500" : "border-white"
                }`}
              >
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
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`h-12 px-3 bg-black border-2 rounded-lg outline-none ${
                  errors.date ? "border-rose-500" : "border-white"
                }`}
              >
                <option>Year</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={2026 - i}>{2026 - i}</option>
                ))}
              </select>
            </div>
            {errors.date && (
              <p className="text-rose-400 mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="text-xl">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full h-14 mt-2 px-4 rounded-lg bg-black border-2 outline-none ${
                errors.email ? "border-rose-500" : "border-white"
              }`}
            />
            {errors.email && (
              <p className="text-rose-400 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-xl">Username:</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full h-14 mt-2 px-4 rounded-lg bg-black border-2 outline-none ${
                errors.username ? "border-rose-500" : "border-white"
              }`}
            />
            {errors.username && (
              <p className="text-rose-400 mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="text-xl">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-14 mt-2 px-4 rounded-lg bg-black border-2 outline-none ${
                errors.password ? "border-rose-500" : "border-white"
              }`}
            />
            {errors.password && (
              <p className="text-rose-400 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-xl">Retype:</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full h-14 mt-2 px-4 rounded-lg bg-black border-2 outline-none ${
                errors.confirm ? "border-rose-500" : "border-white"
              }`}
            />
            {errors.confirm && (
              <p className="text-rose-400 mt-1">{errors.confirm}</p>
            )}
          </div>

          {step === "form" && (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xl bg-white text-black rounded-full hover:scale-105 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          )}
        </form>

        {otpError && (
          <p className="text-rose-400 mt-4 text-center">{otpError}</p>
        )}

        {otpSuccess && (
          <p className="text-green-400 mt-4 text-center">{otpSuccess}</p>
        )}

        

        <Link href="/" className="block mt-6 text-center text-blue-400">
          Back
        </Link>
      </div>
    </div>
  );
}
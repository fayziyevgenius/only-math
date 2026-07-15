"use client";

import { useState } from "react";

export default function DailyPage() {
  const [answer1, setAnswer1] = useState("");
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit() {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      alert("Please sign in first.");
      return;
    }

    const user = JSON.parse(currentUser);

    if (!answer1 ) {
      alert("Please answer all questions.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  username: user.username,
  answer: answer1,
})
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        setLoading(false);
        return;
      }

      alert(
        `🎉 ${data.message}\n\nYou earned ${data.points} Genius Points!`
      );

      setAnswer1("");
    } catch (error) {
      console.error(error);
      alert("Server Error.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-bold text-white mb-3">
        Daily Question
      </h1>

      <p className="text-gray-400 mb-10">
        Solve the question below and earn Genius Points.
      </p>

      
      {/* Question 1 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Question 
          </h2>

          <span className="bg-green-600 px-4 py-2 rounded-full font-bold">
            +50 GP
          </span>
        </div>

        <img
          src="/daily/question1.png"
          alt="Question 1"
          className="rounded-xl border border-zinc-700 mb-6"
        />

        <input
          type="text"
          value={answer1}
          onChange={(e) => setAnswer1(e.target.value)}
          placeholder="Enter your answer..."
          className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-lg outline-none"
        />
      </div>

        



      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-10 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-bold text-xl disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Answers"}
      </button>
    </div>
  );
}
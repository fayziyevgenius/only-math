"use client";

import { Play, Timer, Trophy, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";


type Question = {
  question: string;
  answer: number;
};

function generateQuestion(): Question {
  const type = Math.floor(Math.random() * 4);
  
  if (type === 0) {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;

    return {
      question: `${a} + ${b}`,
      answer: a + b,
    };
  }

  if (type === 1) {
    let a = Math.floor(Math.random() * 50) + 20;
    let b = Math.floor(Math.random() * 20) + 1;

    if (b > a) {
      [a, b] = [b, a];
    }

    return {
      question: `${a} - ${b}`,
      answer: a - b,
    };
  }

  if (type === 2) {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;

    return {
      question: `${a} × ${b}`,
      answer: a * b,
    };
  }

  const b = Math.floor(Math.random() * 12) + 1;
  const answer = Math.floor(Math.random() * 12) + 1;
  const a = b * answer;

  return {
    question: `${a} ÷ ${b}`,
    answer,
  };
}
export default function MathSprintPage() {

async function saveScore() {

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
  );

  if (!currentUser.username) return;

  await fetch("/api/math-spirit/submit", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
  username: currentUser.username,
  score: finalScore,
  correct,
  wrong,
  bestCombo,
}),
  });

}
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState<Question>({
  question: "",
  answer: 0,
});

useEffect(() => {
  setQuestion(generateQuestion());
}, []);
const [input, setInput] = useState("");
const [score, setScore] = useState(0);
const [correct, setCorrect] = useState(0);
const [wrong, setWrong] = useState(0);
const [timeLeft, setTimeLeft] = useState(60);
const [gameOver, setGameOver] = useState(false);
const inputRef = useRef<HTMLInputElement>(null);
const [highScore, setHighScore] = useState(0);
const [flash, setFlash] = useState<"green" | "red" | null>(null);
const [showPlus, setShowPlus] = useState(false);
const [shake, setShake] = useState(false);
const [combo, setCombo] = useState(0);
const [bestCombo, setBestCombo] = useState(0);
const [showCombo, setShowCombo] = useState(false);
const finalScore = score + bestCombo;

const correctSound = useRef<HTMLAudioElement | null>(null);
const wrongSound = useRef<HTMLAudioElement | null>(null);
const comboSound = useRef<HTMLAudioElement | null>(null);
const startSound = useRef<HTMLAudioElement | null>(null);
const gameOverSound = useRef<HTMLAudioElement | null>(null);
const recordSound = useRef<HTMLAudioElement | null>(null);
useEffect(() => {
  correctSound.current = new Audio("/sounds/correct.mp3");
  wrongSound.current = new Audio("/sounds/wrong.mp3");
  comboSound.current = new Audio("/sounds/combo.mp3");
  startSound.current = new Audio("/sounds/start.mp3");
  gameOverSound.current = new Audio("/sounds/gameover.mp3");
  recordSound.current = new Audio("/sounds/newrecord.mp3");

  correctSound.current.volume = 0.5;
  wrongSound.current.volume = 0.5;
  comboSound.current.volume = 0.7;
  startSound.current.volume = 0.8;
  gameOverSound.current.volume = 0.8;
  recordSound.current.volume = 1;
}, []);

useEffect(() => {

  if (gameOver) {
    saveScore();
  }

}, [gameOver]);

useEffect(() => {
  if (!gameOver) return;

  const finalScore = score + bestCombo;

  if (finalScore > highScore) {
    setHighScore(finalScore);

    localStorage.setItem(
      "mathSprintHighScore",
      String(finalScore)
    );
  }
}, [gameOver]);

useEffect(() => {
  const saved = localStorage.getItem("mathSprintHighScore");

  if (saved) {
    setHighScore(Number(saved));
  }
}, []);

useEffect(() => {
  if (started && !gameOver) {
    inputRef.current?.focus();
  }
  
}, [question, started, gameOver]);
  function checkAnswer() {
    if (input.trim() === "") {
  return;
}
  if (Number(input) === question.answer) {
    setFlash("green");
setShowPlus(true);

setTimeout(() => {
  setFlash(null);
}, 150);

setTimeout(() => {
  setShowPlus(false);
}, 600);
    if (correctSound.current) {
  correctSound.current.currentTime = 0;
  correctSound.current.play();
}
    const newScore = score + 1;

    setScore(newScore);
    setCorrect((c) => c + 1);
    const finalScore = score + bestCombo;


    // High Score
    

    // Combo
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo >= 5 && newCombo % 5 === 0) {
  if (comboSound.current) {
  comboSound.current.currentTime = 0;
  comboSound.current.play();
}
}

    if (newCombo > bestCombo) {
      setBestCombo(newCombo);
    }

    setShowCombo(true);

    setTimeout(() => {
      setShowCombo(false);
    }, 500);

  } else {
    if (wrongSound.current) {
        setFlash("red");
setShake(true);

setTimeout(() => {
  setFlash(null);
}, 150);

setTimeout(() => {
  setShake(false);
}, 300);
  wrongSound.current.currentTime = 0;
  wrongSound.current.play();
}
    setWrong((w) => w + 1);

    // Combo reset
    setCombo(0);
  }

  setQuestion(generateQuestion());
  setInput("");
}
useEffect(() => {
  if (!gameOver) return;

  if (finalScore > highScore) {
    setHighScore(finalScore);

    localStorage.setItem(
      "mathSprintHighScore",
      String(finalScore)
    );

    if (recordSound.current) {
  recordSound.current.currentTime = 0;
  recordSound.current.play();
}
  }
}, [gameOver]);

useEffect(() => {
  if (!started || gameOver) return;

  if (timeLeft <= 0) {
    gameOverSound.current?.play();
    setGameOver(true);
    return;
  }

  const timer = setTimeout(() => {
    setTimeLeft((t) => t - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [started, timeLeft, gameOver]);
if (gameOver) {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6">

      <div className="w-full max-w-3xl rounded-[36px] border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-2xl shadow-green-500/10 p-10">

        {/* Header */}
        <div className="text-center">

          <div className="text-7xl mb-4">🏆</div>

          <h1 className="text-5xl font-black">
            Game Over
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            You did an amazing job!
          </p>

          <div className="mt-10">

            <p className="text-zinc-400 text-xl">
              Final Score
            </p>

            <h2 className="text-8xl font-black text-green-400 mt-2">
              {finalScore}
            </h2>

            <p className="text-zinc-500 mt-3">
              {score} + {bestCombo} Combo Bonus
            </p>

          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">

          <div className="rounded-3xl bg-black/40 border border-zinc-800 p-6 text-center">
            <p className="text-zinc-500">✅ Correct</p>
            <h2 className="text-5xl font-black text-green-400 mt-3">
              {correct}
            </h2>
          </div>

          <div className="rounded-3xl bg-black/40 border border-zinc-800 p-6 text-center">
            <p className="text-zinc-500">❌ Wrong</p>
            <h2 className="text-5xl font-black text-red-400 mt-3">
              {wrong}
            </h2>
          </div>

          <div className="rounded-3xl bg-black/40 border border-zinc-800 p-6 text-center">
            <p className="text-zinc-500">🔥 Best Combo</p>
            <h2 className="text-5xl font-black text-orange-400 mt-3">
              x{bestCombo}
            </h2>
          </div>

          <div className="rounded-3xl bg-black/40 border border-zinc-800 p-6 text-center">
            <p className="text-zinc-500">🏆 Personal Best</p>
            <h2 className="text-5xl font-black text-yellow-400 mt-3">
              {highScore}
            </h2>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-5 mt-12">

          <button
            onClick={() => {
              setScore(0);
              setCorrect(0);
              setWrong(0);
              setCombo(0);
              setBestCombo(0);
              setShowCombo(false);
              setTimeLeft(60);
              setQuestion(generateQuestion());
              setInput("");
              setGameOver(false);
              setStarted(false);
            }}
            className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-5 text-2xl font-bold hover:scale-105 transition duration-300"
          >
            🔄 Play Again
          </button>

          <button
            onClick={() => window.location.href = "/afterregister"}
            className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-800 py-5 text-2xl font-bold hover:bg-zinc-700 transition duration-300"
          >
            🏠 Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}
if (started) {
  return (
    <>
      <div
        className={`
          fixed inset-0 z-[999] pointer-events-none
          transition-opacity duration-150
          ${
            flash === "green"
              ? "bg-green-500/20 opacity-100"
              : flash === "red"
              ? "bg-red-500/20 opacity-100"
              : "opacity-0"
          }
        `}
      />

      <div className="max-w-4xl mx-auto py-16">

        <div className="flex justify-between items-center mb-10">

          <div>
            <p className="text-zinc-400">Score</p>
            <h2 className="text-4xl font-bold">{score}</h2>
          </div>

          <div>
            <p className="text-zinc-400">Correct</p>
            <h2 className="text-4xl font-bold text-green-400">
              {correct}
            </h2>
          </div>

          <div>
            <p className="text-zinc-400">Wrong</p>
            <h2 className="text-4xl font-bold text-red-400">
              {wrong}
            </h2>
          </div>

          <div>
            <p className="text-zinc-400">Time</p>
            <h2 className="text-4xl font-bold text-yellow-400">
              {timeLeft}s
            </h2>
          </div>

          <div>
            <p className="text-zinc-400">Combo</p>
            <h2 className="text-4xl font-bold text-orange-400">
              x{combo}
            </h2>
          </div>

        </div>

        <div
          className={`
            bg-zinc-900
            rounded-3xl
            border
            border-zinc-800
            p-12
            transition-all

            ${shake ? "animate-[wiggle_.3s_ease-in-out]" : ""}
          `}
        >

          {showPlus && (
            <div className="text-center mb-4 animate-bounce">
              <h2 className="text-5xl font-black text-green-400">
                +1
              </h2>
            </div>
          )}

          {showCombo && combo >= 2 && (
            <div className="text-center mb-6 animate-bounce">
              <h2 className="text-5xl font-black text-orange-400">
                🔥 Combo x{combo}
              </h2>
            </div>
          )}

          <h1 className="text-6xl font-bold text-center mb-10">
            {question.question} = ?
          </h1>

          <input
            ref={inputRef}
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkAnswer();
              }
            }}
            placeholder="Answer..."
            className="w-full bg-black border border-zinc-700 rounded-2xl p-6 text-3xl outline-none"
          />

          <button
            onClick={checkAnswer}
            className="mt-6 w-full rounded-2xl bg-green-600 hover:bg-green-700 py-5 text-2xl font-bold transition"
          >
            Submit
          </button>

        </div>

      </div>
    </>
  );
}

  return (
    <div className="relative min-h-[85vh] overflow-hidden rounded-3xl">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      {/* Floating Math */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <span className="absolute top-20 left-16 text-white/5 text-7xl font-bold">
          π
        </span>

        <span className="absolute top-56 right-24 text-white/5 text-6xl">
          √2
        </span>

        <span className="absolute bottom-32 left-40 text-white/5 text-7xl">
          ∑
        </span>

        <span className="absolute bottom-20 right-20 text-white/5 text-7xl">
          ∞
        </span>

      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-20 px-6">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2 mb-8">

            <Zap className="text-green-400" size={18} />

            <span className="text-green-300 font-semibold">
              NEW GAME MODE
            </span>

          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6">

            Math Sprint

          </h1>

          <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-9">

            Solve as many math questions as possible before the timer reaches zero.

            Compete with yourself, improve your speed, and climb the leaderboard.

          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition">

            <Timer size={38} className="text-green-400 mb-5" />

            <h3 className="text-3xl font-bold">
              60 Seconds
            </h3>

            <p className="text-zinc-400 mt-3">
              Beat the clock before time runs out.
            </p>

          </div>

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition">

            <Zap size={38} className="text-yellow-400 mb-5" />

            <h3 className="text-3xl font-bold">
              Random Questions
            </h3>

            <p className="text-zinc-400 mt-3">
              Every game generates new arithmetic problems.
            </p>

          </div>

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition">

            <Trophy size={38} className="text-orange-400 mb-5" />


  <h3 className="text-3xl font-bold">
    High Score
  </h3>

  <p className="text-5xl font-black mt-5 text-green-400">
    {highScore}
  </p>



            <p className="text-zinc-400 mt-3">
              Improve your personal record every day.
            </p>

          </div>

        </div>

        <div className="flex justify-center mt-16">

          <button
            onClick={() => {
  if (startSound.current) {
  startSound.current.currentTime = 0;
  startSound.current.play();
}

  setStarted(true);

  setTimeLeft(60);
  setScore(0);
  setCorrect(0);
  setWrong(0);

  setCombo(0);
  setBestCombo(0);
  setShowCombo(false);

  setQuestion(generateQuestion());
}}
            className="group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-5 text-2xl font-bold shadow-lg shadow-green-500/30 transition duration-300 hover:scale-105"
          >

            <Play
              className="group-hover:translate-x-1 transition"
              size={28}
            />

            Start Sprint

          </button>

        </div>

      </div>

    </div>
  );
}
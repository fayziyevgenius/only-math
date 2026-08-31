import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Agar Prisma ishlatayotgan bo'lsangiz

const CORRECT_ANSWERS: Record<number, string> = {
  1: "48",
  2: "5/3",
  3: "35000",
  4: "7",
  5: "27",
  6: "754",
  7: "42",
  8: "38",
  9: "310 yoki 77.5",
  10: "9",
  11: "30",
  12: "17.5",
  13: "16",
  14: "48",
  15: "\\( \\frac{\\sqrt{33}}{2} \\)",
  16: "0",
  17: "36^\\circ",
  18: "1 ta",
  19: "2 ta",
  20: "3 ta",
};

const POINTS_MAP: Record<number, number> = {
  // 1-16 gacha 10 balldan, 17-20 gacha 15 balldan (Jami 220 GP)
  1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10,
  11: 10, 12: 10, 13: 10, 14: 10, 15: 10, 16: 10, 17: 15, 18: 15, 19: 15, 20: 15,
};

export async function POST(req: Request) {
  try {
    const { username, answers, set } = await req.json();

    if (!username || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    /* Baza bilan ishlash (Namuna)
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    
    // Yechilganligini tekshirish
    if (user.completedCertificates.includes(set)) {
      return NextResponse.json({ error: "You have already completed the Independence Certificate." }, { status: 400 });
    }
    */

    let correctCount = 0;
    let incorrectCount = 0;
    let earnedPoints = 0;
    const totalQuestions = Object.keys(CORRECT_ANSWERS).length;

    for (const [qId, answer] of Object.entries(answers as Record<number, string>)) {
      const questionId = Number(qId);
      if (CORRECT_ANSWERS[questionId] === answer) {
        correctCount++;
        earnedPoints += (POINTS_MAP[questionId] || 10);
      } else {
        incorrectCount++;
      }
    }

    // Rank Update mantiqi
    let rankUp = false;
    let oldRank = "Bronze"; // user.rank;
    let newRank = "Bronze";

    // Agar reyting oshgan bo'lsa mantiqni shu yerda yozasiz:
    // await prisma.user.update({ ... points: user.points + earnedPoints ... });

    return NextResponse.json({
      points: earnedPoints,
      correct: correctCount,
      incorrect: incorrectCount,
      totalQuestions,
      rankUp,
      oldRank,
      newRank,
    });
  } catch (error) {
    console.error("Certificate Grading Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
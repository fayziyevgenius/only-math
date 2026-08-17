import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getTitle } from "@/lib/title";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const user = await db.collection("users").findOne(
      { username },
      {
        projection: {
          password: 0,
        },
      }
    );

    console.log("API /me USER:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // =====================================================
    // NATIONAL CERTIFICATE
    // =====================================================

    const national = {
      attempts: Number(
        user.stats?.national?.attempts ?? 0
      ),
      correct: Number(
        user.stats?.national?.correct ?? 0
      ),
    };

    // =====================================================
    // SAT
    // =====================================================

    const sat = {
      attempts: Number(
        user.stats?.sat?.attempts ?? 0
      ),
      correct: Number(
        user.stats?.sat?.correct ?? 0
      ),
    };

    // =====================================================
    // DAILY
    // =====================================================

    const daily = {
      attempts: Number(
        user.stats?.daily?.attempts ?? 0
      ),
      correct: Number(
        user.stats?.daily?.correct ?? 0
      ),
    };

    // =====================================================
    // OLYMPIAD
    //
    // Oddiy:
    // stats.olympiad.attempts
    //
    // Genesis:
    // stats.olympiad.genesis.attempts
    //
    // Independence:
    // stats.olympiad.independence.attempts
    //
    // Achievement uchun barchasini birlashtiramiz.
    // =====================================================

    const olympiadBase = {
      attempts: Number(
        user.stats?.olympiad?.attempts ?? 0
      ),
      correct: Number(
        user.stats?.olympiad?.correct ?? 0
      ),
    };

    const olympiadGenesis = {
      attempts: Number(
        user.stats?.olympiad?.genesis?.attempts ?? 0
      ),
      correct: Number(
        user.stats?.olympiad?.genesis?.correct ?? 0
      ),
    };

    const olympiadIndependence = {
      attempts: Number(
        user.stats?.olympiad?.independence?.attempts ?? 0
      ),
      correct: Number(
        user.stats?.olympiad?.independence?.correct ?? 0
      ),
    };

    const olympiadAttempts =
      olympiadBase.attempts +
      olympiadGenesis.attempts +
      olympiadIndependence.attempts;

    const olympiadCorrect =
      olympiadBase.correct +
      olympiadGenesis.correct +
      olympiadIndependence.correct;

    const olympiad = {
      attempts: olympiadAttempts,
      correct: olympiadCorrect,

      genesis: olympiadGenesis,
      independence: olympiadIndependence,
    };

    // =====================================================
    // MATH SPRINT
    // =====================================================

    const mathSpirit = {
      games: Number(
        user.stats?.mathSpirit?.games ?? 0
      ),

      highestScore: Number(
        user.stats?.mathSpirit?.highestScore ?? 0
      ),

      totalScore: Number(
        user.stats?.mathSpirit?.totalScore ?? 0
      ),

      bestCombo: Number(
        user.stats?.mathSpirit?.bestCombo ?? 0
      ),
    };

    // =====================================================
    // FINAL STATS
    // =====================================================

    const stats = {
      national,
      sat,
      olympiad,
      daily,
      mathSpirit,
    };

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      ...user,

      title: getTitle(
        Number(user.geniusPoints ?? 0)
      ),

      stats,
    });

  } catch (error) {
    console.error(
      "API /me ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
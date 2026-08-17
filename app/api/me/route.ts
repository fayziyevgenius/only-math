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
    const users = db.collection("users");

    const user = await users.findOne(
      { username },
      {
        projection: {
          password: 0,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* =====================================================
       NATIONAL / CERTIFICATE
    ===================================================== */

    let nationalAttempts = Number(
      user.stats?.national?.attempts ?? 0
    );

    let nationalCorrect = Number(
      user.stats?.national?.correct ?? 0
    );

    /*
     * Eski Certificate natijasini ham tekshiramiz.
     *
     * Agar oldingi test 20/20 bo'lib,
     * stats.national.attempts noto'g'ri 1 bo'lib qolgan bo'lsa,
     * uni 20/20 sifatida hisoblaymiz.
     */

    const certificateCycles =
      user.certificateCycles || {};

    for (const cycleName of [
      "genesis",
      "independence",
    ]) {
      const cycle = certificateCycles[cycleName];

      if (
        cycle?.solved === true &&
        Number(cycle?.totalQuestions ?? 0) === 20
      ) {
        const cycleCorrect = Number(
          cycle?.correct ?? 0
        );

        if (nationalAttempts < 20) {
          nationalAttempts = 20;
        }

        if (
          cycleCorrect === 20 &&
          nationalCorrect < 20
        ) {
          nationalCorrect = 20;
        }
      }
    }

    /* =====================================================
       SAT
    ===================================================== */

    const satAttempts = Number(
      user.stats?.sat?.attempts ?? 0
    );

    const satCorrect = Number(
      user.stats?.sat?.correct ?? 0
    );

    /* =====================================================
       OLYMPIAD
    ===================================================== */

    const olympiadBaseAttempts = Number(
      user.stats?.olympiad?.attempts ?? 0
    );

    const olympiadBaseCorrect = Number(
      user.stats?.olympiad?.correct ?? 0
    );

    const olympiadGenesisAttempts = Number(
      user.stats?.olympiad?.genesis?.attempts ?? 0
    );

    const olympiadGenesisCorrect = Number(
      user.stats?.olympiad?.genesis?.correct ?? 0
    );

    const olympiadIndependenceAttempts = Number(
      user.stats?.olympiad?.independence?.attempts ?? 0
    );

    const olympiadIndependenceCorrect = Number(
      user.stats?.olympiad?.independence?.correct ?? 0
    );

    /*
     * Barcha Olympiad natijalarini birlashtiramiz.
     */

    const olympiadAttempts =
      olympiadBaseAttempts +
      olympiadGenesisAttempts +
      olympiadIndependenceAttempts;

    const olympiadCorrect =
      olympiadBaseCorrect +
      olympiadGenesisCorrect +
      olympiadIndependenceCorrect;

    /* =====================================================
       DAILY
    ===================================================== */

    const dailyAttempts = Number(
      user.stats?.daily?.attempts ?? 0
    );

    const dailyCorrect = Number(
      user.stats?.daily?.correct ?? 0
    );

    /* =====================================================
       MATH SPRINT
    ===================================================== */

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

    /* =====================================================
       FINAL STATS
    ===================================================== */

    const stats = {
      national: {
        attempts: nationalAttempts,
        correct: nationalCorrect,
      },

      sat: {
        attempts: satAttempts,
        correct: satCorrect,
      },

      olympiad: {
        attempts: olympiadAttempts,
        correct: olympiadCorrect,

        genesis: {
          attempts: olympiadGenesisAttempts,
          correct: olympiadGenesisCorrect,
        },

        independence: {
          attempts: olympiadIndependenceAttempts,
          correct: olympiadIndependenceCorrect,
        },
      },

      daily: {
        attempts: dailyAttempts,
        correct: dailyCorrect,
      },

      mathSpirit,
    };

    /* =====================================================
       PERFECT TRIO
    ===================================================== */

    const certificatePerfect =
      nationalAttempts === 20 &&
      nationalCorrect === 20;

    const satPerfect =
      satAttempts === 20 &&
      satCorrect === 20;

    const olympiadPerfect =
      olympiadAttempts === 20 &&
      olympiadCorrect === 20;

    const perfectTrio =
      certificatePerfect &&
      satPerfect &&
      olympiadPerfect;

    /* =====================================================
       SELF-HEAL OLD CERTIFICATE DATA
    ===================================================== */

    /*
     * Agar eski Certificate natijasi MongoDB'da
     * 1 attempt bo'lib qolgan bo'lsa, uni 20 ga to'g'rilaymiz.
     *
     * Bu eski 20/20 natijani yo'qotmaydi.
     */

    if (
      nationalAttempts === 20 &&
      nationalCorrect === 20 &&
      Number(user.stats?.national?.attempts ?? 0) !== 20
    ) {
      await users.updateOne(
        { username },
        {
          $set: {
            "stats.national.attempts": 20,
            "stats.national.correct": 20,
          },
        }
      );
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      ...user,

      title: getTitle(
        Number(user.geniusPoints ?? 0)
      ),

      stats,

      perfectTrio,
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
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

    /* =====================================================
       NATIONAL CERTIFICATE
    ===================================================== */

    const national = {
      attempts: Number(
        user.stats?.national?.attempts ?? 0
      ),

      correct: Number(
        user.stats?.national?.correct ?? 0
      ),
    };

    /* =====================================================
       CERTIFICATE PERFECT
       
       Certificate route:
       attempts += 1
       correct += correct answers
       
       Shuning uchun nationalAttempts va
       nationalCorrectni solishtirmaymiz.
    ===================================================== */

    const certificateCycles =
      user.certificateCycles || {};

    const genesisCertificate =
      certificateCycles.genesis;

    const independenceCertificate =
      certificateCycles.independence;

    const genesisCertificatePerfect =
      genesisCertificate?.solved === true &&
      Number(genesisCertificate.correct ?? 0) ===
        Number(genesisCertificate.totalQuestions ?? 0) &&
      Number(genesisCertificate.totalQuestions ?? 0) > 0;

    const independenceCertificatePerfect =
      independenceCertificate?.solved === true &&
      Number(independenceCertificate.correct ?? 0) ===
        Number(independenceCertificate.totalQuestions ?? 0) &&
      Number(independenceCertificate.totalQuestions ?? 0) > 0;

    const certificatePerfect =
      genesisCertificatePerfect ||
      independenceCertificatePerfect;

    /* =====================================================
       SAT
    ===================================================== */

    const sat = {
      attempts: Number(
        user.stats?.sat?.attempts ?? 0
      ),

      correct: Number(
        user.stats?.sat?.correct ?? 0
      ),
    };

    /*
      SAT route:
      attempts += 20
      correct += correct

      Shuning uchun:
      20/20 => attempts 20, correct 20
    */

    const satPerfect =
      sat.attempts > 0 &&
      sat.correct === sat.attempts;

    /* =====================================================
       DAILY
    ===================================================== */

    const daily = {
      attempts: Number(
        user.stats?.daily?.attempts ?? 0
      ),

      correct: Number(
        user.stats?.daily?.correct ?? 0
      ),
    };

    /* =====================================================
       OLYMPIAD
    ===================================================== */

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

    /* =====================================================
       OLYMPIAD PERFECT
    ===================================================== */

    const olympiadGenesisPerfect =
      olympiadGenesis.attempts > 0 &&
      olympiadGenesis.correct ===
        olympiadGenesis.attempts;

    const olympiadIndependencePerfect =
      olympiadIndependence.attempts > 0 &&
      olympiadIndependence.correct ===
        olympiadIndependence.attempts;

    const olympiadBasePerfect =
      olympiadBase.attempts > 0 &&
      olympiadBase.correct ===
        olympiadBase.attempts;

    const olympiadPerfect =
      olympiadBasePerfect ||
      olympiadGenesisPerfect ||
      olympiadIndependencePerfect;

    /* =====================================================
       PERFECT TRIO
    ===================================================== */

    const perfectTrio =
      certificatePerfect &&
      satPerfect &&
      olympiadPerfect;

    console.log(
      "========== PERFECT TRIO =========="
    );

    console.log(
      "Certificate Perfect:",
      certificatePerfect
    );

    console.log(
      "SAT Perfect:",
      satPerfect
    );

    console.log(
      "Olympiad Perfect:",
      olympiadPerfect
    );

    console.log(
      "Perfect Trio:",
      perfectTrio
    );

    console.log(
      "=================================="
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
      national,
      sat,
      olympiad,
      daily,
      mathSpirit,
    };

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      ...user,

      title: getTitle(
        Number(user.geniusPoints ?? 0)
      ),

      stats,

      /* Achievement values */

      certificatePerfect,

      certificateGenesisPerfect:
        genesisCertificatePerfect,

      certificateIndependencePerfect:
        independenceCertificatePerfect,

      satPerfect,

      olympiadPerfect,

      olympiadGenesisPerfect,

      olympiadIndependencePerfect,

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
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { username, avatar } = await req.json();

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!username || !avatar) {
      return NextResponse.json(
        {
          error: "Username va avatar kerak.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // DATABASE
    // =====================================================

    const db = await connectDB();

    const users = db.collection("users");

    const user = await users.findOne({
      username,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // ALLOWED AVATARS
    // =====================================================

    const allowedAvatars = [
      "only-math",
      "genesis-cycle",
      "daily-7",
      "solve-question",
      "sprint-60",
      "perfect-trio",
      "top-3",
    ];

    if (!allowedAvatars.includes(avatar)) {
      return NextResponse.json(
        {
          error: "Invalid avatar.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // STATS
    // =====================================================

    const stats = user.stats || {};

    // -----------------------------------------------------
    // DAILY
    // -----------------------------------------------------

    const dailyAttempts = Number(
      stats.daily?.attempts || 0
    );

    // -----------------------------------------------------
    // NATIONAL
    // -----------------------------------------------------

    const nationalAttempts = Number(
      stats.national?.attempts || 0
    );

    const nationalCorrect = Number(
      stats.national?.correct || 0
    );

    // -----------------------------------------------------
    // SAT
    // -----------------------------------------------------

    const satAttempts = Number(
      stats.sat?.attempts || 0
    );

    const satCorrect = Number(
      stats.sat?.correct || 0
    );

    // -----------------------------------------------------
    // OLYMPIAD
    //
    // MUHIM:
    // Olympiad statistikasi cycle ichida saqlanadi:
    //
    // stats.olympiad.genesis.attempts
    // stats.olympiad.genesis.correct
    //
    // stats.olympiad.independence.attempts
    // stats.olympiad.independence.correct
    // -----------------------------------------------------

    const olympiadGenesisAttempts = Number(
      stats.olympiad?.genesis?.attempts || 0
    );

    const olympiadGenesisCorrect = Number(
      stats.olympiad?.genesis?.correct || 0
    );

    const olympiadIndependenceAttempts = Number(
      stats.olympiad?.independence?.attempts || 0
    );

    const olympiadIndependenceCorrect = Number(
      stats.olympiad?.independence?.correct || 0
    );

    // =====================================================
    // TOTAL OLYMPIAD STATISTICS
    // =====================================================

    const olympiadAttempts =
      olympiadGenesisAttempts +
      olympiadIndependenceAttempts;

    const olympiadCorrect =
      olympiadGenesisCorrect +
      olympiadIndependenceCorrect;

    // =====================================================
    // MATH SPRINT
    // =====================================================

    const sprintHighestScore = Number(
      stats.mathSpirit?.highestScore || 0
    );

    // =====================================================
    // ACHIEVEMENT CONDITIONS
    // =====================================================

    /*
     * Problem Solver
     *
     * Kamida bitta:
     * Certificate
     * SAT
     * Olympiad
     */

    const solvedAnyQuestion =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadAttempts > 0;

    /*
     * Genesis Cycle
     *
     * Genesis Cycle'da kamida bitta
     * akademik savol yechilgan bo'lishi kerak.
     */

    const genesisCycleUnlocked =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadGenesisAttempts > 0;

    /*
     * Daily Master
     */

    const daily7Unlocked =
      dailyAttempts >= 7;

    /*
     * Sprint Runner
     */

    const sprint60Unlocked =
      sprintHighestScore >= 60;

    /*
     * Perfect Certificate
     */

    const perfectCertificate =
      nationalAttempts > 0 &&
      nationalCorrect === nationalAttempts;

    /*
     * Perfect SAT
     */

    const perfectSAT =
      satAttempts > 0 &&
      satCorrect === satAttempts;

    /*
     * Perfect Olympiad
     *
     * Genesis + Independence jami.
     */

    const perfectOlympiad =
      olympiadAttempts > 0 &&
      olympiadCorrect === olympiadAttempts;

    /*
     * Perfect Trio
     */

    const perfectThreeUnlocked =
      perfectCertificate &&
      perfectSAT &&
      perfectOlympiad;

    /*
     * Top 3
     */

    const topThreeUnlocked =
      user.topThree === true;

    // =====================================================
    // CHECK SELECTED AVATAR
    // =====================================================

    let unlocked = false;

    switch (avatar) {
      // ---------------------------------------------------
      // ONLY MATH
      // ---------------------------------------------------

      case "only-math":
        unlocked = true;
        break;

      // ---------------------------------------------------
      // GENESIS CYCLE
      // ---------------------------------------------------

      case "genesis-cycle":
        unlocked = genesisCycleUnlocked;
        break;

      // ---------------------------------------------------
      // DAILY MASTER
      // ---------------------------------------------------

      case "daily-7":
        unlocked = daily7Unlocked;
        break;

      // ---------------------------------------------------
      // PROBLEM SOLVER
      // ---------------------------------------------------

      case "solve-question":
        unlocked = solvedAnyQuestion;
        break;

      // ---------------------------------------------------
      // SPRINT RUNNER
      // ---------------------------------------------------

      case "sprint-60":
        unlocked = sprint60Unlocked;
        break;

      // ---------------------------------------------------
      // PERFECT TRIO
      // ---------------------------------------------------

      case "perfect-trio":
        unlocked = perfectThreeUnlocked;
        break;

      // ---------------------------------------------------
      // TOP 3
      // ---------------------------------------------------

      case "top-3":
        unlocked = topThreeUnlocked;
        break;

      default:
        unlocked = false;
    }

    // =====================================================
    // DEBUG
    // =====================================================

    console.log("========== AVATAR CHECK ==========");

    console.log("Username:", username);
    console.log("Avatar:", avatar);

    console.log("National attempts:", nationalAttempts);
    console.log("SAT attempts:", satAttempts);

    console.log(
      "Olympiad Genesis attempts:",
      olympiadGenesisAttempts
    );

    console.log(
      "Olympiad Independence attempts:",
      olympiadIndependenceAttempts
    );

    console.log(
      "Total Olympiad attempts:",
      olympiadAttempts
    );

    console.log(
      "Solved any question:",
      solvedAnyQuestion
    );

    console.log(
      "Genesis unlocked:",
      genesisCycleUnlocked
    );

    console.log(
      "Daily 7 unlocked:",
      daily7Unlocked
    );

    console.log(
      "Sprint 60 unlocked:",
      sprint60Unlocked
    );

    console.log(
      "Perfect Trio unlocked:",
      perfectThreeUnlocked
    );

    console.log(
      "Top 3 unlocked:",
      topThreeUnlocked
    );

    console.log(
      "FINAL UNLOCKED:",
      unlocked
    );

    console.log("=================================");

    // =====================================================
    // NOT UNLOCKED
    // =====================================================

    if (!unlocked) {
      return NextResponse.json(
        {
          error:
            "Bu avatar hali unlock qilinmagan.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // SAVE AVATAR
    // =====================================================

    await users.updateOne(
      {
        username,
      },
      {
        $set: {
          avatar,
          updatedAt: new Date(),
        },
      }
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      avatar,
    });
  } catch (error) {
    console.error(
      "Update avatar error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}
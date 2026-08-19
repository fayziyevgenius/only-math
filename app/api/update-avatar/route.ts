import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const username = String(body?.username || "").trim();
    const avatar = String(body?.avatar || "").trim();

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!username) {
      return NextResponse.json(
        {
          error: "Username kerak.",
        },
        {
          status: 400,
        }
      );
    }

    if (!avatar) {
      return NextResponse.json(
        {
          error: "Avatar kerak.",
        },
        {
          status: 400,
        }
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
        {
          status: 400,
        }
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
      console.log("USER NOT FOUND:", username);

      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // STATS
    // =====================================================

    const stats = user.stats || {};

    // =====================================================
    // DAILY
    // =====================================================

    const dailyAttempts = Number(
      stats.daily?.attempts || 0
    );

    // =====================================================
    // CERTIFICATE
    // =====================================================

    const nationalAttempts = Number(
      stats.national?.attempts || 0
    );

    const nationalCorrect = Number(
      stats.national?.correct || 0
    );

    // =====================================================
    // SAT
    // =====================================================

    const satAttempts = Number(
      stats.sat?.attempts || 0
    );

    const satCorrect = Number(
      stats.sat?.correct || 0
    );

    // =====================================================
    // OLYMPIAD
    // =====================================================

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
    // BASIC ACHIEVEMENTS
    // =====================================================

    const solvedAnyQuestion =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadAttempts > 0;

    const genesisCycleUnlocked =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadGenesisAttempts > 0;

    const daily7Unlocked =
      dailyAttempts >= 7;

    const sprint60Unlocked =
      sprintHighestScore >= 60;

    // =====================================================
    // PERFECT CERTIFICATE
    //
    // Masalan:
    //
    // attempts = 20
    // correct  = 20
    //
    // yoki:
    //
    // attempts = 40
    // correct  = 40
    //
    // Ikkalasi ham PERFECT.
    // =====================================================

    const perfectCertificate =
      nationalAttempts > 0 &&
      nationalCorrect === nationalAttempts;

    // =====================================================
    // PERFECT SAT
    // =====================================================

    const perfectSAT =
      satAttempts > 0 &&
      satCorrect === satAttempts;

    // =====================================================
    // PERFECT OLYMPIAD
    //
    // Genesis + Independence birga hisoblanadi.
    //
    // Masalan:
    //
    // Genesis:
    //  attempts = 20
    //  correct  = 20
    //
    // Independence:
    //  attempts = 20
    //  correct  = 20
    //
    // Jami:
    //  attempts = 40
    //  correct  = 40
    //
    // PERFECT.
    // =====================================================

    const perfectOlympiad =
      olympiadAttempts > 0 &&
      olympiadCorrect === olympiadAttempts;

    // =====================================================
    // PERFECT TRIO
    // =====================================================

    const perfectTrio =
      perfectCertificate &&
      perfectSAT &&
      perfectOlympiad;

    // =====================================================
    // TOP 3
    // =====================================================

    const topThreeUnlocked =
      user.topThree === true;

    // =====================================================
    // DEBUG
    // =====================================================

    console.log("======================================");
    console.log("          AVATAR CHECK");
    console.log("======================================");

    console.log("USERNAME:", username);
    console.log("AVATAR:", avatar);

    console.log("--------------------------------------");
    console.log("CERTIFICATE");
    console.log("Attempts:", nationalAttempts);
    console.log("Correct:", nationalCorrect);
    console.log(
      "Perfect:",
      perfectCertificate
    );

    console.log("--------------------------------------");
    console.log("SAT");
    console.log("Attempts:", satAttempts);
    console.log("Correct:", satCorrect);
    console.log(
      "Perfect:",
      perfectSAT
    );

    console.log("--------------------------------------");
    console.log("OLYMPIAD GENESIS");
    console.log(
      "Attempts:",
      olympiadGenesisAttempts
    );
    console.log(
      "Correct:",
      olympiadGenesisCorrect
    );

    console.log("--------------------------------------");
    console.log("OLYMPIAD INDEPENDENCE");
    console.log(
      "Attempts:",
      olympiadIndependenceAttempts
    );
    console.log(
      "Correct:",
      olympiadIndependenceCorrect
    );

    console.log("--------------------------------------");
    console.log("OLYMPIAD TOTAL");
    console.log(
      "Attempts:",
      olympiadAttempts
    );
    console.log(
      "Correct:",
      olympiadCorrect
    );
    console.log(
      "Perfect:",
      perfectOlympiad
    );

    console.log("--------------------------------------");
    console.log("PERFECT TRIO");
    console.log(
      "Certificate:",
      perfectCertificate
    );
    console.log(
      "SAT:",
      perfectSAT
    );
    console.log(
      "Olympiad:",
      perfectOlympiad
    );
    console.log(
      "Perfect Trio:",
      perfectTrio
    );

    console.log("--------------------------------------");
    console.log("Stored perfectTrio:", user.perfectTrio);

    console.log("======================================");

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
        unlocked = perfectTrio;
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

    console.log("FINAL UNLOCKED:", unlocked);

    // =====================================================
    // NOT UNLOCKED
    // =====================================================

    if (!unlocked) {
      return NextResponse.json(
        {
          success: false,
          unlocked: false,
          error: "Bu avatar hali unlock qilinmagan.",
        },
        {
          status: 403,
        }
      );
    }

    // =====================================================
    // SAVE AVATAR
    //
    // Agar Perfect Trio haqiqatan ochilgan bo'lsa,
    // DB'dagi eski false qiymatni ham true qilamiz.
    // =====================================================

    const updateSet: Record<string, unknown> = {
      avatar,
      updatedAt: new Date(),
    };

    if (perfectTrio) {
      updateSet.perfectTrio = true;
    }

    await users.updateOne(
      {
        username,
      },
      {
        $set: updateSet,
      }
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      unlocked: true,
      avatar,

      achievements: {
        certificate: perfectCertificate,
        sat: perfectSAT,
        olympiad: perfectOlympiad,
        perfectTrio,
      },

      stats: {
        certificate: {
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
        },
      },
    });
  } catch (error) {
    console.error(
      "Update avatar error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

type CycleName = "genesis" | "independence";

function getCurrentCycle(): CycleName | null {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const today = formatter.format(new Date());

  if (today >= "2026-08-17" && today <= "2026-08-30") {
    return "genesis";
  }

  if (today >= "2026-08-31" && today <= "2026-09-13") {
    return "independence";
  }

  return null;
}

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

    // DAILY
    const dailyAttempts = Number(
      stats.daily?.attempts || 0
    );

    // NATIONAL / CERTIFICATE
    const nationalAttempts = Number(
      stats.national?.attempts || 0
    );

    const nationalCorrect = Number(
      stats.national?.correct || 0
    );

    // SAT
    const satAttempts = Number(
      stats.sat?.attempts || 0
    );

    const satCorrect = Number(
      stats.sat?.correct || 0
    );

    // OLYMPIAD
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

    // MATH SPRINT
    const sprintHighestScore = Number(
      stats.mathSpirit?.highestScore || 0
    );

    // =====================================================
    // CURRENT CYCLE
    // =====================================================

    const currentCycle = getCurrentCycle();

    const cycleLoginDays =
      currentCycle &&
      user.cycleLoginDays?.[currentCycle]
        ? user.cycleLoginDays[currentCycle]
        : [];

    const loginDays: string[] = Array.isArray(cycleLoginDays)
      ? cycleLoginDays
      : [];

    /*
     * 7 KUNLIK ACHIEVEMENT
     *
     * Streak kerak emas.
     *
     * Ketma-ket bo'lishi shart emas.
     *
     * Faqat current 14-day cycle ichida
     * 7 xil kunda kirgan bo'lishi kerak.
     */

    const daily7Unlocked =
      loginDays.length >= 7;

    // =====================================================
    // OTHER ACHIEVEMENTS
    // =====================================================

    const solvedAnyQuestion =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadAttempts > 0;

    const genesisCycleUnlocked =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadGenesisAttempts > 0;

    const sprint60Unlocked =
      sprintHighestScore >= 60;

    const perfectCertificate =
      nationalAttempts > 0 &&
      nationalCorrect === nationalAttempts;

    const perfectSAT =
      satAttempts > 0 &&
      satCorrect === satAttempts;

    const perfectOlympiad =
      olympiadAttempts > 0 &&
      olympiadCorrect === olympiadAttempts;

    const perfectThreeUnlocked =
      perfectCertificate &&
      perfectSAT &&
      perfectOlympiad;

    const topThreeUnlocked =
      user.topThree === true;

    // =====================================================
    // CHECK SELECTED AVATAR
    // =====================================================

    let unlocked = false;

    switch (avatar) {
      case "only-math":
        unlocked = true;
        break;

      case "genesis-cycle":
        unlocked = genesisCycleUnlocked;
        break;

      case "daily-7":
        unlocked = daily7Unlocked;
        break;

      case "solve-question":
        unlocked = solvedAnyQuestion;
        break;

      case "sprint-60":
        unlocked = sprint60Unlocked;
        break;

      case "perfect-trio":
        unlocked = perfectThreeUnlocked;
        break;

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

    console.log("Current cycle:", currentCycle);

    console.log(
      "Cycle login days:",
      loginDays
    );

    console.log(
      "Cycle login days count:",
      loginDays.length
    );

    console.log(
      "Daily 7 unlocked:",
      daily7Unlocked
    );

    console.log(
      "National attempts:",
      nationalAttempts
    );

    console.log(
      "SAT attempts:",
      satAttempts
    );

    console.log(
      "Olympiad attempts:",
      olympiadAttempts
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
          error: "Bu avatar hali unlock qilinmagan.",
          unlocked: false,
          avatar,
          cycle: currentCycle,
          daysCount: loginDays.length,
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
      unlocked: true,
      avatar,
      cycle: currentCycle,
      daysCount: loginDays.length,
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
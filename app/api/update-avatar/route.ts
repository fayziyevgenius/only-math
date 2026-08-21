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
    // STATS
    // =====================================================

    const stats = user.stats || {};

    // =====================================================
    // CERTIFICATE
    // =====================================================

    const nationalAttempts = Number(
      stats.national?.attempts || 0
    );

    const nationalCorrect = Number(
      stats.national?.correct || 0
    );

    const perfectCertificate =
      nationalAttempts > 0 &&
      nationalCorrect === nationalAttempts;

    // =====================================================
    // SAT
    // =====================================================

    const satAttempts = Number(
      stats.sat?.attempts || 0
    );

    const satCorrect = Number(
      stats.sat?.correct || 0
    );

    const perfectSAT =
      satAttempts > 0 &&
      satCorrect === satAttempts;

    // =====================================================
    // OLYMPIAD
    // =====================================================

    const olympiad = stats.olympiad || {};

    const olympiadGenesisAttempts = Number(
      olympiad.genesis?.attempts || 0
    );

    const olympiadGenesisCorrect = Number(
      olympiad.genesis?.correct || 0
    );

    const olympiadIndependenceAttempts = Number(
      olympiad.independence?.attempts || 0
    );

    const olympiadIndependenceCorrect = Number(
      olympiad.independence?.correct || 0
    );

    const olympiadAttempts =
      olympiadGenesisAttempts +
      olympiadIndependenceAttempts;

    const olympiadCorrect =
      olympiadGenesisCorrect +
      olympiadIndependenceCorrect;

    const perfectOlympiad =
      olympiadAttempts > 0 &&
      olympiadCorrect === olympiadAttempts;

    // =====================================================
    // PERFECT TRIO
    //
    // MUHIM:
    // BU QISMGA TEGILMAYDI.
    //
    // Agar DB'da perfectTrio true bo'lsa,
    // u doim unlock hisoblanadi.
    // =====================================================

    const perfectThreeUnlocked =
      user.perfectTrio === true ||
      (
        perfectCertificate &&
        perfectSAT &&
        perfectOlympiad
      );

    // =====================================================
    // OTHER STATS
    // =====================================================

    const dailyAttempts = Number(
      stats.daily?.attempts || 0
    );

    const sprintHighestScore = Number(
      stats.mathSpirit?.highestScore || 0
    );

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

    const topThreeUnlocked =
      user.topThree === true;

    // =====================================================
    // CURRENT CYCLE LOGIN DAYS
    //
    // FAQAT DAILY-7 UCHUN.
    //
    // PERFECT TRIO BUNGA BOG'LANMAYDI.
    // =====================================================

    const currentCycle = getCurrentCycle();

    let loginDays: string[] = [];

    if (currentCycle) {
      const savedDays =
        user.cycleLoginDays?.[currentCycle];

      if (Array.isArray(savedDays)) {
        loginDays = savedDays;
      }
    }

    const daily7Unlocked =
      loginDays.length >= 7;

    // =====================================================
    // CHECK AVATAR
    // =====================================================

    let unlocked = false;

    switch (avatar) {
      case "only-math":
        unlocked = true;
        break;

      case "genesis-cycle":
        unlocked =
          genesisCycleUnlocked;
        break;

      case "daily-7":
        unlocked =
          daily7Unlocked;
        break;

      case "solve-question":
        unlocked =
          solvedAnyQuestion;
        break;

      case "sprint-60":
        unlocked =
          sprint60Unlocked;
        break;

      case "perfect-trio":
        unlocked =
          perfectThreeUnlocked;
        break;

      case "top-3":
        unlocked =
          topThreeUnlocked;
        break;

      default:
        unlocked = false;
    }

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      "========== UPDATE AVATAR =========="
    );

    console.log(
      "Username:",
      username
    );

    console.log(
      "Avatar:",
      avatar
    );

    console.log(
      "Current cycle:",
      currentCycle
    );

    console.log(
      "Login days:",
      loginDays
    );

    console.log(
      "Login days count:",
      loginDays.length
    );

    console.log(
      "Daily 7:",
      daily7Unlocked
    );

    console.log(
      "-----------------------------------"
    );

    console.log(
      "Certificate perfect:",
      perfectCertificate
    );

    console.log(
      "SAT perfect:",
      perfectSAT
    );

    console.log(
      "Olympiad perfect:",
      perfectOlympiad
    );

    console.log(
      "Database perfectTrio:",
      user.perfectTrio
    );

    console.log(
      "Perfect Trio:",
      perfectThreeUnlocked
    );

    console.log(
      "-----------------------------------"
    );

    console.log(
      "FINAL UNLOCKED:",
      unlocked
    );

    console.log(
      "==================================="
    );

    // =====================================================
    // NOT UNLOCKED
    // =====================================================

    if (!unlocked) {
      return NextResponse.json(
        {
          error:
            "Bu avatar hali unlock qilinmagan.",

          avatar,

          unlocked: false,

          cycle: currentCycle,

          daysCount:
            loginDays.length,

          perfectTrio:
            perfectThreeUnlocked,
        },
        { status: 403 }
      );
    }

    // =====================================================
    // SAVE AVATAR
    //
    // PERFECT TRIO GA TEGILMAYDI.
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

      unlocked: true,

      cycle: currentCycle,

      daysCount:
        loginDays.length,

      perfectTrio:
        perfectThreeUnlocked,
    });
  } catch (error) {
    console.error(
      "Update avatar error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error.",
      },
      { status: 500 }
    );
  }
}
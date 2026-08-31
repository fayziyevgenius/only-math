import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

type CycleName = "independence";

function getCurrentCycle(): CycleName | null {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const today = formatter.format(new Date());

  // =====================================================
  // INDEPENDENCE CYCLE
  //
  // 31 AUGUST 2026 → 13 SEPTEMBER 2026
  // =====================================================

  if (
    today >= "2026-08-31" &&
    today <= "2026-09-13"
  ) {
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
    // ALLOWED AVATARS
    // =====================================================

    const allowedAvatars = [
      "only-math",
      "independence-cycle",
      "daily-7",
      "solve-question",
      "sprint-60",
      "perfect-trio",
      "top-3",
      "hacker",
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
    //
    // Genesis va Independence ikkalasi ham hisobga olinadi.
    //
    // Bu Perfect Trio uchun kerak.
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
    // BU QISM O'ZGARTIRILMAYDI.
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

    const sprintHighestScore = Number(
      stats.mathSpirit?.highestScore || 0
    );

    // =====================================================
    // SOLVED ANY QUESTION
    //
    // Certificate / SAT / Olympiad
    // dan kamida bitta savol.
    //
    // Bu umumiy Problem Solver uchun.
    // =====================================================

    const solvedAnyQuestion =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadAttempts > 0;

    // =====================================================
    // INDEPENDENCE CYCLE
    //
    // Independence Cycle'da:
    //
    // Certificate
    // SAT
    // Olympiad Independence
    //
    // dan kamida bitta savol yechilsa unlock.
    // =====================================================

    const independenceCycleUnlocked =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadIndependenceAttempts > 0;

    // =====================================================
    // SPRINT 60+
    // =====================================================

    const sprint60Unlocked =
      sprintHighestScore >= 60;

    // =====================================================
    // TOP 3
    // =====================================================

    const topThreeUnlocked =
      user.topThree === true;

    // =====================================================
    // HACKER
    //
    // MUHIM:
    //
    // Hacker achievement 8 talik kodni muvaffaqiyatli
    // ochgandan keyin DB'da:
    //
    // hackerUnlocked: true
    //
    // bo'lishi kerak.
    //
    // Biz bu yerda kodni o'zimiz ochmaymiz.
    // Faqat serverdagi haqiqiy unlock holatini tekshiramiz.
    // =====================================================

    const hackerUnlocked =
      user.hackerUnlocked === true;

    // =====================================================
    // CURRENT CYCLE LOGIN DAYS
    //
    // FAQAT INDEPENDENCE CYCLE.
    //
    // DAILY-7 uchun ishlatiladi.
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
      // ===================================================
      // ONLY MATH
      // ===================================================

      case "only-math":
        unlocked = true;
        break;

      // ===================================================
      // INDEPENDENCE CYCLE
      // ===================================================

      case "independence-cycle":
        unlocked =
          independenceCycleUnlocked;
        break;

      // ===================================================
      // DAILY MASTER
      // ===================================================

      case "daily-7":
        unlocked =
          daily7Unlocked;
        break;

      // ===================================================
      // PROBLEM SOLVER
      // ===================================================

      case "solve-question":
        unlocked =
          solvedAnyQuestion;
        break;

      // ===================================================
      // SPRINT RUNNER
      // ===================================================

      case "sprint-60":
        unlocked =
          sprint60Unlocked;
        break;

      // ===================================================
      // PERFECT TRIO
      // ===================================================

      case "perfect-trio":
        unlocked =
          perfectThreeUnlocked;
        break;

      // ===================================================
      // TOP 3
      // ===================================================

      case "top-3":
        unlocked =
          topThreeUnlocked;
        break;

      // ===================================================
      // HACKER
      // ===================================================

      case "hacker":
        unlocked =
          hackerUnlocked;
        break;

      // ===================================================
      // DEFAULT
      // ===================================================

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
      "Certificate attempts:",
      nationalAttempts
    );

    console.log(
      "Certificate correct:",
      nationalCorrect
    );

    console.log(
      "Certificate perfect:",
      perfectCertificate
    );

    console.log(
      "-----------------------------------"
    );

    console.log(
      "SAT attempts:",
      satAttempts
    );

    console.log(
      "SAT correct:",
      satCorrect
    );

    console.log(
      "SAT perfect:",
      perfectSAT
    );

    console.log(
      "-----------------------------------"
    );

    console.log(
      "Olympiad Genesis attempts:",
      olympiadGenesisAttempts
    );

    console.log(
      "Olympiad Genesis correct:",
      olympiadGenesisCorrect
    );

    console.log(
      "Olympiad Independence attempts:",
      olympiadIndependenceAttempts
    );

    console.log(
      "Olympiad Independence correct:",
      olympiadIndependenceCorrect
    );

    console.log(
      "Olympiad total attempts:",
      olympiadAttempts
    );

    console.log(
      "Olympiad total correct:",
      olympiadCorrect
    );

    console.log(
      "Olympiad perfect:",
      perfectOlympiad
    );

    console.log(
      "-----------------------------------"
    );

    console.log(
      "Independence Cycle:",
      independenceCycleUnlocked
    );

    console.log(
      "Problem Solver:",
      solvedAnyQuestion
    );

    console.log(
      "Sprint 60+:",
      sprint60Unlocked
    );

    console.log(
      "Top 3:",
      topThreeUnlocked
    );

    console.log(
      "Perfect Trio:",
      perfectThreeUnlocked
    );

    console.log(
      "Hacker DB status:",
      user.hackerUnlocked
    );

    console.log(
      "Hacker:",
      hackerUnlocked
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

          hacker:
            hackerUnlocked,
        },
        { status: 403 }
      );
    }

    // =====================================================
    // SAVE AVATAR
    //
    // MUHIM:
    // Bu yerda achievementlarning o'ziga tegilmaydi.
    //
    // Faqat foydalanuvchining ACTIVE avatar'i o'zgaradi.
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

      hacker:
        hackerUnlocked,
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
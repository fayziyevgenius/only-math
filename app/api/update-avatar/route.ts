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
    // DAILY
    // =====================================================

    const dailyAttempts = Number(
      stats.daily?.attempts || 0
    );

    // =====================================================
    // CERTIFICATE / NATIONAL
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

    // =====================================================
    // TOTAL OLYMPIAD
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
    // BASIC ACHIEVEMENTS
    // =====================================================

    /*
     * Problem Solver
     *
     * Kamida bitta akademik savol yechilgan.
     */

    const solvedAnyQuestion =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadAttempts > 0;

    /*
     * Genesis Cycle
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

    // =====================================================
    // PERFECT RESULTS
    // =====================================================

    /*
     * MUHIM:
     *
     * attempts > 20 bo'lishi mumkin.
     *
     * Masalan:
     *
     * attempts = 40
     * correct  = 35
     *
     * Bu foydalanuvchi ilgari 20/20 qilgan bo'lishi
     * mumkinligini anglatmaydi.
     *
     * Shuning uchun Perfect achievementni faqat
     * umumiy correct/attempts orqali aniqlash xavfli.
     *
     * Biz avval saqlangan perfect flagsni tekshiramiz.
     */

    const storedPerfectCertificate =
      user.perfectCertificate === true;

    const storedPerfectSAT =
      user.perfectSAT === true;

    const storedPerfectOlympiad =
      user.perfectOlympiad === true;

    // =====================================================
    // CERTIFICATE PERFECT
    // =====================================================

    /*
     * Agar eski database'da perfectCertificate
     * field hali yo'q bo'lsa, 20/20 mavjudligini
     * aniqlashga harakat qilamiz.
     *
     * Bu faqat attempts aynan 20 bo'lganda ishlaydi.
     */

    const calculatedPerfectCertificate =
      nationalAttempts === 20 &&
      nationalCorrect === 20;

    const perfectCertificate =
      storedPerfectCertificate ||
      calculatedPerfectCertificate;

    // =====================================================
    // SAT PERFECT
    // =====================================================

    const calculatedPerfectSAT =
      satAttempts === 20 &&
      satCorrect === 20;

    const perfectSAT =
      storedPerfectSAT ||
      calculatedPerfectSAT;

    // =====================================================
    // OLYMPIAD PERFECT
    // =====================================================

    /*
     * Olympiad cycle bo'yicha tekshiriladi.
     *
     * Agar Genesis 20/20 bo'lsa yoki
     * Independence 20/20 bo'lsa,
     * Olympiad Perfect ochiladi.
     */

    const perfectGenesisOlympiad =
      olympiadGenesisAttempts >= 20 &&
      olympiadGenesisCorrect >= 20 &&
      olympiadGenesisCorrect === olympiadGenesisAttempts;

    const perfectIndependenceOlympiad =
      olympiadIndependenceAttempts >= 20 &&
      olympiadIndependenceCorrect >= 20 &&
      olympiadIndependenceCorrect ===
        olympiadIndependenceAttempts;

    const calculatedPerfectOlympiad =
      perfectGenesisOlympiad ||
      perfectIndependenceOlympiad;

    const perfectOlympiad =
      storedPerfectOlympiad ||
      calculatedPerfectOlympiad;

    // =====================================================
    // PERFECT TRIO
    // =====================================================

    const perfectThreeUnlocked =
      perfectCertificate &&
      perfectSAT &&
      perfectOlympiad;

    // =====================================================
    // TOP 3
    // =====================================================

    const topThreeUnlocked =
      user.topThree === true;

    // =====================================================
    // FINAL UNLOCK CHECK
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

    console.log("========================================");
    console.log("         AVATAR CHECK");
    console.log("========================================");

    console.log("Username:", username);
    console.log("Avatar:", avatar);

    console.log("----------------------------------------");
    console.log("CERTIFICATE");
    console.log("Attempts:", nationalAttempts);
    console.log("Correct:", nationalCorrect);
    console.log(
      "Stored Perfect:",
      storedPerfectCertificate
    );
    console.log(
      "Calculated Perfect:",
      calculatedPerfectCertificate
    );
    console.log(
      "FINAL Perfect Certificate:",
      perfectCertificate
    );

    console.log("----------------------------------------");
    console.log("SAT");
    console.log("Attempts:", satAttempts);
    console.log("Correct:", satCorrect);
    console.log(
      "Stored Perfect:",
      storedPerfectSAT
    );
    console.log(
      "Calculated Perfect:",
      calculatedPerfectSAT
    );
    console.log(
      "FINAL Perfect SAT:",
      perfectSAT
    );

    console.log("----------------------------------------");
    console.log("OLYMPIAD");
    console.log(
      "Genesis Attempts:",
      olympiadGenesisAttempts
    );
    console.log(
      "Genesis Correct:",
      olympiadGenesisCorrect
    );

    console.log(
      "Independence Attempts:",
      olympiadIndependenceAttempts
    );
    console.log(
      "Independence Correct:",
      olympiadIndependenceCorrect
    );

    console.log(
      "Genesis Perfect:",
      perfectGenesisOlympiad
    );

    console.log(
      "Independence Perfect:",
      perfectIndependenceOlympiad
    );

    console.log(
      "Stored Perfect:",
      storedPerfectOlympiad
    );

    console.log(
      "FINAL Perfect Olympiad:",
      perfectOlympiad
    );

    console.log("----------------------------------------");
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
      "PERFECT TRIO UNLOCKED:",
      perfectThreeUnlocked
    );

    console.log("----------------------------------------");
    console.log("Other achievements");
    console.log(
      "Solved Any Question:",
      solvedAnyQuestion
    );

    console.log(
      "Genesis Cycle:",
      genesisCycleUnlocked
    );

    console.log(
      "Daily 7:",
      daily7Unlocked
    );

    console.log(
      "Sprint 60:",
      sprint60Unlocked
    );

    console.log(
      "Top 3:",
      topThreeUnlocked
    );

    console.log("----------------------------------------");
    console.log(
      "FINAL AVATAR UNLOCKED:",
      unlocked
    );

    console.log("========================================");

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

          perfectCertificate,
          perfectSAT,
          perfectOlympiad,

          perfectTrio:
            perfectThreeUnlocked,
        },
        { status: 403 }
      );
    }

    // =====================================================
    // SAVE PERFECT FLAGS
    // =====================================================

    /*
     * Agar foydalanuvchi Perfect natijaga erishgan bo'lsa,
     * uni doimiy saqlaymiz.
     *
     * Keyinchalik attempts 40, 60, 80 bo'lib ketsa ham
     * achievement yo'qolmaydi.
     */

    const achievementUpdate: Record<
      string,
      boolean | Date
    > = {
      updatedAt: new Date(),
    };

    if (perfectCertificate) {
      achievementUpdate.perfectCertificate = true;
    }

    if (perfectSAT) {
      achievementUpdate.perfectSAT = true;
    }

    if (perfectOlympiad) {
      achievementUpdate.perfectOlympiad = true;
    }

    if (perfectThreeUnlocked) {
      achievementUpdate.perfectTrio = true;
    }

    // =====================================================
    // SAVE AVATAR + ACHIEVEMENTS
    // =====================================================

    await users.updateOne(
      {
        username,
      },
      {
        $set: {
          avatar,
          ...achievementUpdate,
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

      perfectCertificate,

      perfectSAT,

      perfectOlympiad,

      perfectTrio:
        perfectThreeUnlocked,

      message:
        avatar === "perfect-trio"
          ? "Perfect Trio unlocked!"
          : "Avatar updated successfully.",
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
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
    // CERTIFICATE
    // =====================================================

    const nationalAttempts = Number(
      stats.national?.attempts || 0
    );

    const nationalCorrect = Number(
      stats.national?.correct || 0
    );

    // Certificate perfect:
    // Kamida bitta savol/test bo'lishi kerak
    // va barcha urinishlar to'g'ri bo'lishi kerak.
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

    // SAT perfect
    const perfectSAT =
      satAttempts > 0 &&
      satCorrect === satAttempts;

    // =====================================================
    // OLYMPIAD
    // =====================================================

    const olympiad = stats.olympiad || {};

    // -----------------------------------------------------
    // NEW FORMAT
    //
    // stats.olympiad.genesis.attempts
    // stats.olympiad.genesis.correct
    //
    // stats.olympiad.independence.attempts
    // stats.olympiad.independence.correct
    // -----------------------------------------------------

    const genesisAttempts = Number(
      olympiad.genesis?.attempts || 0
    );

    const genesisCorrect = Number(
      olympiad.genesis?.correct || 0
    );

    const independenceAttempts = Number(
      olympiad.independence?.attempts || 0
    );

    const independenceCorrect = Number(
      olympiad.independence?.correct || 0
    );

    // -----------------------------------------------------
    // OLD / FLAT FORMAT
    //
    // Agar eski database:
    //
    // stats.olympiad.attempts
    // stats.olympiad.correct
    //
    // ko'rinishida bo'lsa ham ishlaydi.
    // -----------------------------------------------------

    const flatOlympiadAttempts = Number(
      olympiad.attempts || 0
    );

    const flatOlympiadCorrect = Number(
      olympiad.correct || 0
    );

    // =====================================================
    // TOTAL OLYMPIAD
    // =====================================================

    let olympiadAttempts =
      genesisAttempts +
      independenceAttempts;

    let olympiadCorrect =
      genesisCorrect +
      independenceCorrect;

    // Agar cycle formatida ma'lumot bo'lmasa,
    // eski flat formatdan foydalanamiz.
    if (
      olympiadAttempts === 0 &&
      flatOlympiadAttempts > 0
    ) {
      olympiadAttempts =
        flatOlympiadAttempts;

      olympiadCorrect =
        flatOlympiadCorrect;
    }

    // =====================================================
    // OLYMPIAD PERFECT
    // =====================================================

    const perfectOlympiad =
      olympiadAttempts > 0 &&
      olympiadCorrect === olympiadAttempts;

    // =====================================================
    // OTHER STATS
    // =====================================================

    const dailyAttempts = Number(
      stats.daily?.attempts || 0
    );

    const sprintHighestScore = Number(
      stats.mathSpirit?.highestScore || 0
    );

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
      genesisAttempts > 0;

    const daily7Unlocked =
      dailyAttempts >= 7;

    const sprint60Unlocked =
      sprintHighestScore >= 60;

    const topThreeUnlocked =
      user.topThree === true;

    // =====================================================
    // PERFECT TRIO
    // =====================================================

    /*
     * MUHIM:
     *
     * Agar database'da perfectTrio allaqachon true bo'lsa,
     * qayta hisoblash shart emas.
     *
     * Yoki:
     *
     * Certificate PERFECT
     * +
     * SAT PERFECT
     * +
     * Olympiad PERFECT
     *
     * bo'lsa avatar unlock qilinadi.
     */

    const perfectThreeUnlocked =
      user.perfectTrio === true ||
      (
        perfectCertificate &&
        perfectSAT &&
        perfectOlympiad
      );

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      "=========================================="
    );

    console.log(
      "========== PERFECT TRIO AVATAR =========="
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
      "------------------------------------------"
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
      "------------------------------------------"
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
      "------------------------------------------"
    );

    console.log(
      "Olympiad Genesis attempts:",
      genesisAttempts
    );

    console.log(
      "Olympiad Genesis correct:",
      genesisCorrect
    );

    console.log(
      "Olympiad Independence attempts:",
      independenceAttempts
    );

    console.log(
      "Olympiad Independence correct:",
      independenceCorrect
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
      "------------------------------------------"
    );

    console.log(
      "DB perfectTrio:",
      user.perfectTrio
    );

    console.log(
      "FINAL Perfect Trio:",
      perfectThreeUnlocked
    );

    console.log(
      "=========================================="
    );

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
        unlocked =
          genesisCycleUnlocked;
        break;

      // ---------------------------------------------------
      // DAILY MASTER
      // ---------------------------------------------------

      case "daily-7":
        unlocked =
          daily7Unlocked;
        break;

      // ---------------------------------------------------
      // PROBLEM SOLVER
      // ---------------------------------------------------

      case "solve-question":
        unlocked =
          solvedAnyQuestion;
        break;

      // ---------------------------------------------------
      // SPRINT RUNNER
      // ---------------------------------------------------

      case "sprint-60":
        unlocked =
          sprint60Unlocked;
        break;

      // ---------------------------------------------------
      // PERFECT TRIO
      // ---------------------------------------------------

      case "perfect-trio":
        unlocked =
          perfectThreeUnlocked;
        break;

      // ---------------------------------------------------
      // TOP 3
      // ---------------------------------------------------

      case "top-3":
        unlocked =
          topThreeUnlocked;
        break;

      default:
        unlocked = false;
    }

    // =====================================================
    // NOT UNLOCKED
    // =====================================================

    if (!unlocked) {
      return NextResponse.json(
        {
          error:
            "Bu avatar hali unlock qilinmagan.",
        },
        {
          status: 403,
        }
      );
    }

    // =====================================================
    // SAVE PERFECT TRIO
    // =====================================================

    /*
     * Agar Perfect Trio shartlari bajarilgan bo'lsa,
     * database'ga true qilib yozib qo'yamiz.
     *
     * Keyingi safar stats qayta hisoblanmasa ham
     * avatar ochiq qoladi.
     */

    const updateFields: Record<
      string,
      unknown
    > = {
      avatar,
      updatedAt: new Date(),
    };

    if (
      perfectThreeUnlocked
    ) {
      updateFields.perfectTrio =
        true;
    }

    // =====================================================
    // SAVE AVATAR
    // =====================================================

    await users.updateOne(
      {
        username,
      },
      {
        $set: updateFields,
      }
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      avatar,

      unlocked: true,

      perfectTrio:
        perfectThreeUnlocked,

      message:
        "Avatar muvaffaqiyatli tanlandi.",
    });
  } catch (error) {
    console.error(
      "Update avatar error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}
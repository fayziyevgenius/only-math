import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const {
      username,
      avatar,
    } = await req.json();

    if (!username || !avatar) {
      return NextResponse.json(
        {
          error:
            "Username va avatar kerak.",
        },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const users =
      db.collection("users");

    const user =
      await users.findOne({
        username,
      });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User not found.",
        },
        { status: 404 }
      );
    }

    // Faqat mavjud avatar ID lariga ruxsat beramiz.
    const allowedAvatars = [
      "only-math",
      "genesis-cycle",
      "daily-7",
      "solve-question",
      "sprint-60",
      "perfect-trio",
      "top-3",
    ];

    if (
      !allowedAvatars.includes(
        avatar
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid avatar.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // ACHIEVEMENT CHECK
    // =================================================

    const stats = user.stats || {};

    const dailyAttempts =
      stats.daily?.attempts || 0;

    const nationalAttempts =
      stats.national?.attempts || 0;

    const satAttempts =
      stats.sat?.attempts || 0;

    const olympiadAttempts =
      stats.olympiad?.attempts || 0;

    const sprintHighestScore =
      stats.mathSpirit?.highestScore || 0;

    const nationalCorrect =
      stats.national?.correct || 0;

    const satCorrect =
      stats.sat?.correct || 0;

    const olympiadCorrect =
      stats.olympiad?.correct || 0;

    // =================================================
    // UNLOCK CONDITIONS
    // =================================================

    const solvedAnyQuestion =
      nationalAttempts > 0 ||
      satAttempts > 0 ||
      olympiadAttempts > 0;

    const daily7Unlocked =
      dailyAttempts >= 7;

    const sprint60Unlocked =
      sprintHighestScore >= 60;

    const perfectCertificate =
      nationalAttempts > 0 &&
      nationalCorrect ===
        nationalAttempts;

    const perfectSAT =
      satAttempts > 0 &&
      satCorrect === satAttempts;

    const perfectOlympiad =
      olympiadAttempts > 0 &&
      olympiadCorrect ===
        olympiadAttempts;

    const perfectThreeUnlocked =
      perfectCertificate &&
      perfectSAT &&
      perfectOlympiad;

    const topThreeUnlocked =
      user.topThree === true;

    // =================================================
    // CHECK SELECTED AVATAR
    // =================================================

    let unlocked = false;

    switch (avatar) {
      case "only-math":
        unlocked = true;
        break;

      case "genesis-cycle":
        unlocked =
          solvedAnyQuestion;
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

    if (!unlocked) {
      return NextResponse.json(
        {
          error:
            "Bu avatar hali unlock qilinmagan.",
        },
        { status: 403 }
      );
    }

    // =================================================
    // SAVE
    // =================================================

    await users.updateOne(
      { username },
      {
        $set: {
          avatar,
          updatedAt:
            new Date(),
        },
      }
    );

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
        error:
          "Server Error",
      },
      { status: 500 }
    );
  }
}
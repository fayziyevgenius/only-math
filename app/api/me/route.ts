import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getTitle } from "@/lib/title";

export const dynamic = "force-dynamic";

/*
=========================================================
  ESCAPE REGEX
=========================================================
*/

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/*
=========================================================
  POST
=========================================================
*/

export async function POST(req: Request) {
  try {
    /*
    =====================================================
      READ BODY
    =====================================================
    */

    const body = await req.json();

    const identifier = String(
      body?.username ?? body?.email ?? ""
    ).trim();

    if (!identifier) {
      return NextResponse.json(
        {
          error: "Username or email is required",
        },
        {
          status: 400,
        }
      );
    }

    console.log("=================================");
    console.log("API /ME");
    console.log("Identifier:", identifier);
    console.log("=================================");

    /*
    =====================================================
      DATABASE
    =====================================================
    */

    const db = await connectDB();
    const users = db.collection("users");

    /*
    =====================================================
      FIND USER
      Username OR Email
      Case insensitive
    =====================================================
    */

    const safeIdentifier = escapeRegex(identifier);

    const user = await users.findOne(
      {
        $or: [
          {
            username: {
              $regex: `^${safeIdentifier}$`,
              $options: "i",
            },
          },
          {
            email: {
              $regex: `^${safeIdentifier}$`,
              $options: "i",
            },
          },
        ],
      },
      {
        projection: {
          password: 0,
        },
      }
    );

    console.log(
      "USER RESULT:",
      user
        ? {
            username: user.username,
            email: user.email,
          }
        : null
    );

    /*
    =====================================================
      USER NOT FOUND
    =====================================================
    */

    if (!user) {
      console.log(
        "USER NOT FOUND:",
        identifier
      );

      return NextResponse.json(
        {
          error: "User not found",
          identifier,
        },
        {
          status: 404,
        }
      );
    }

    /*
    =====================================================
      NATIONAL / CERTIFICATE
    =====================================================
    */

    let nationalAttempts = Number(
      user.stats?.national?.attempts ?? 0
    );

    let nationalCorrect = Number(
      user.stats?.national?.correct ?? 0
    );

    /*
    =====================================================
      OLD CERTIFICATE DATA
    =====================================================
    */

    const certificateCycles =
      user.certificateCycles || {};

    for (const cycleName of [
      "genesis",
      "independence",
    ]) {
      const cycle =
        certificateCycles[cycleName];

      if (
        cycle?.solved === true &&
        Number(
          cycle?.totalQuestions ?? 0
        ) === 20
      ) {
        const cycleCorrect =
          Number(cycle?.correct ?? 0);

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

    /*
    =====================================================
      SAT
    =====================================================
    */

    const satAttempts = Number(
      user.stats?.sat?.attempts ?? 0
    );

    const satCorrect = Number(
      user.stats?.sat?.correct ?? 0
    );

    /*
    =====================================================
      OLYMPIAD
    =====================================================
    */

    const olympiadBaseAttempts =
      Number(
        user.stats?.olympiad?.attempts ?? 0
      );

    const olympiadBaseCorrect =
      Number(
        user.stats?.olympiad?.correct ?? 0
      );

    const olympiadGenesisAttempts =
      Number(
        user.stats?.olympiad?.genesis
          ?.attempts ?? 0
      );

    const olympiadGenesisCorrect =
      Number(
        user.stats?.olympiad?.genesis
          ?.correct ?? 0
      );

    const olympiadIndependenceAttempts =
      Number(
        user.stats?.olympiad?.independence
          ?.attempts ?? 0
      );

    const olympiadIndependenceCorrect =
      Number(
        user.stats?.olympiad?.independence
          ?.correct ?? 0
      );

    const olympiadAttempts =
      olympiadBaseAttempts +
      olympiadGenesisAttempts +
      olympiadIndependenceAttempts;

    const olympiadCorrect =
      olympiadBaseCorrect +
      olympiadGenesisCorrect +
      olympiadIndependenceCorrect;

    /*
    =====================================================
      DAILY
    =====================================================
    */

    const dailyAttempts = Number(
      user.stats?.daily?.attempts ?? 0
    );

    const dailyCorrect = Number(
      user.stats?.daily?.correct ?? 0
    );

    /*
    =====================================================
      MATH SPRINT
    =====================================================
    */

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

    /*
    =====================================================
      FINAL STATS
    =====================================================
    */

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

    /*
    =====================================================
      PERFECT TRIO
    =====================================================
    */

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

    /*
    =====================================================
      SELF HEAL CERTIFICATE DATA
    =====================================================
    */

    const oldNationalAttempts =
      Number(
        user.stats?.national?.attempts ?? 0
      );

    const oldNationalCorrect =
      Number(
        user.stats?.national?.correct ?? 0
      );

    if (
      nationalAttempts === 20 &&
      nationalCorrect === 20 &&
      (
        oldNationalAttempts !== 20 ||
        oldNationalCorrect !== 20
      )
    ) {
      await users.updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            "stats.national.attempts": 20,
            "stats.national.correct": 20,
          },
        }
      );
    }

    /*
    =====================================================
      RESPONSE USER
    =====================================================
    */

    const responseUser = {
      ...user,

      _id: undefined,

      title: getTitle(
        Number(user.geniusPoints ?? 0)
      ),

      geniusPoints: Number(
        user.geniusPoints ?? 0
      ),

      streak: Number(
        user.streak ?? 0
      ),

      stats,

      perfectTrio,

      avatar:
        user.avatar || "only-math",

      topThree:
        user.topThree === true,
    };

    /*
    =====================================================
      REMOVE _id
    =====================================================
    */

    delete responseUser._id;

    console.log(
      "API /ME SUCCESS:",
      user.username
    );

    console.log(
      "Current GP:",
      Number(user.geniusPoints ?? 0)
    );

    console.log("=================================");

    /*
    =====================================================
      RESPONSE
    =====================================================
    */

    return NextResponse.json(
      responseUser,
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "API /ME ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return NextResponse.json(
      {
        error: "Server Error",

        message:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      {
        status: 500,
      }
    );
  }
}
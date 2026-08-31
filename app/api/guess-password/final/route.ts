import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/*
=========================================================
  VERIFY SESSION TOKEN
=========================================================
*/

function verifyToken(
  token: string,
  identifier: string
): boolean {
  const secret =
    process.env.GUESS_PASSWORD_SESSION_SECRET;

  if (!secret) {
    console.error(
      "GUESS_PASSWORD_SESSION_SECRET is missing."
    );

    return false;
  }

  /*
  =======================================================
    TOKEN FORMAT

    timestamp.identifier.signature
  =======================================================
  */

  const parts =
    token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [
    timestamp,
    encodedIdentifier,
    signature,
  ] = parts;

  /*
  =======================================================
    TIMESTAMP
  =======================================================
  */

  const timestampNumber =
    Number(timestamp);

  if (
    !Number.isFinite(
      timestampNumber
    )
  ) {
    return false;
  }

  /*
  =======================================================
    TOKEN AGE
    30 MINUTES
  =======================================================
  */

  const age =
    Date.now() -
    timestampNumber;

  if (
    age < 0 ||
    age > 30 * 60 * 1000
  ) {
    return false;
  }

  /*
  =======================================================
    DECODE IDENTIFIER
  =======================================================
  */

  let tokenIdentifier = "";

  try {
    tokenIdentifier =
      Buffer.from(
        encodedIdentifier,
        "base64url"
      ).toString("utf8");
  } catch {
    return false;
  }

  if (!tokenIdentifier) {
    return false;
  }

  /*
  =======================================================
    IDENTIFIER MATCH
  =======================================================
  */

  if (
    tokenIdentifier.toLowerCase() !==
    identifier.toLowerCase()
  ) {
    return false;
  }

  /*
  =======================================================
    CREATE EXPECTED SIGNATURE
  =======================================================
  */

  const payload =
    `${timestamp}:${tokenIdentifier}`;

  const expected =
    crypto
      .createHmac(
        "sha256",
        secret
      )
      .update(
        `guess-password:${payload}`
      )
      .digest("hex");

  /*
  =======================================================
    SECURE SIGNATURE COMPARISON
  =======================================================
  */

  const signatureBuffer =
    Buffer.from(
      signature,
      "utf8"
    );

  const expectedBuffer =
    Buffer.from(
      expected,
      "utf8"
    );

  if (
    signatureBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    signatureBuffer,
    expectedBuffer
  );
}

/*
=========================================================
  ESCAPE REGEX
=========================================================
*/

function escapeRegex(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

/*
=========================================================
  POST
=========================================================
*/

export async function POST(
  request: Request
) {
  try {
    /*
    =====================================================
      BODY
    =====================================================
    */

    const body =
      await request.json();

    /*
    =====================================================
      PASSWORD
    =====================================================
    */

    const password =
      typeof body?.password === "string"
        ? body.password
            .trim()
            .toUpperCase()
        : "";

    /*
    =====================================================
      TOKEN
    =====================================================
    */

    const token =
      typeof body?.token === "string"
        ? body.token.trim()
        : "";

    /*
    =====================================================
      USERNAME
    =====================================================
    */

    const username =
      typeof body?.username === "string"
        ? body.username.trim()
        : "";

    /*
    =====================================================
      EMAIL
    =====================================================
    */

    const email =
      typeof body?.email === "string"
        ? body.email.trim()
        : "";

    /*
    =====================================================
      IDENTIFIER
    =====================================================
    */

    const identifier =
      username || email;

    /*
    =====================================================
      CHECK IDENTIFIER
    =====================================================
    */

    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User aniqlanmadi. Login ma'lumotlari yuborilmadi.",
        },
        {
          status: 401,
        }
      );
    }

    /*
    =====================================================
      CHECK TOKEN
    =====================================================
    */

    if (
      !verifyToken(
        token,
        identifier
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Session token noto'g'ri yoki muddati tugagan.",
        },
        {
          status: 401,
        }
      );
    }

    /*
    =====================================================
      SERVER PASSWORD
    =====================================================
    */

    const correctPassword =
      process.env.GUESS_PASSWORD
        ?.trim()
        .toUpperCase();

    if (!correctPassword) {
      console.error(
        "GUESS_PASSWORD is missing."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error.",
        },
        {
          status: 500,
        }
      );
    }

    /*
    =====================================================
      SERVER PASSWORD VALIDATION
    =====================================================
    */

    if (
      !/^[A-Z0-9]{8}$/.test(
        correctPassword
      )
    ) {
      console.error(
        "GUESS_PASSWORD must contain exactly 8 letters/numbers."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Server password configuration error.",
        },
        {
          status: 500,
        }
      );
    }

    /*
    =====================================================
      USER PASSWORD LENGTH
    =====================================================
    */

    if (
      password.length !== 8
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password 8 ta belgidan iborat bo'lishi kerak.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    =====================================================
      PASSWORD CHARACTERS
    =====================================================
    */

    if (
      !/^[A-Z0-9]{8}$/.test(
        password
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Faqat harf va raqamlardan foydalaning.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    =====================================================
      SECURE PASSWORD COMPARISON
    =====================================================
    */

    const passwordBuffer =
      Buffer.from(
        password,
        "utf8"
      );

    const correctBuffer =
      Buffer.from(
        correctPassword,
        "utf8"
      );

    const isCorrect =
      passwordBuffer.length ===
        correctBuffer.length &&
      crypto.timingSafeEqual(
        passwordBuffer,
        correctBuffer
      );

    /*
    =====================================================
      WRONG PASSWORD
    =====================================================
    */

    if (!isCorrect) {
      return NextResponse.json(
        {
          success: false,
          error:
            "8 belgili password noto'g'ri.",
        },
        {
          status: 401,
        }
      );
    }

    /*
    =====================================================
      DATABASE
    =====================================================
    */

    const db =
      await connectDB();

    const users =
      db.collection("users");

    /*
    =====================================================
      FIND USER
    =====================================================
    */

    const safeIdentifier =
      escapeRegex(
        identifier
      );

    const user =
      await users.findOne({
        $or: [
          {
            username: {
              $regex:
                `^${safeIdentifier}$`,
              $options: "i",
            },
          },
          {
            email: {
              $regex:
                `^${safeIdentifier}$`,
              $options: "i",
            },
          },
        ],
      });

    /*
    =====================================================
      USER NOT FOUND
    =====================================================
    */

    if (!user) {
      console.error(
        "GUESS PASSWORD USER NOT FOUND:",
        identifier
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "User topilmadi.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    =====================================================
      ATOMIC +700 GP
    =====================================================

      Reward faqat bir marta beriladi.

      guessPasswordRewardClaimed !== true
    */

    const updateResult =
      await users.updateOne(
        {
          _id: user._id,

          guessPasswordRewardClaimed: {
            $ne: true,
          },
        },
        {
          $inc: {
            geniusPoints: 700,
          },

          $set: {
            guessPasswordRewardClaimed:
              true,

            guessPasswordRewardAt:
              new Date(),
          },
        }
      );

    /*
    =====================================================
      REWARD GIVEN
    =====================================================
    */

    if (
      updateResult.modifiedCount ===
      1
    ) {
      const oldGP =
        Number(
          user.geniusPoints ?? 0
        );

      const newGP =
        oldGP + 700;

      console.log(
        "================================="
      );

      console.log(
        "GUESS PASSWORD SUCCESS"
      );

      console.log(
        "User:",
        user.username ||
          user.email
      );

      console.log(
        "User ID:",
        String(user._id)
      );

      console.log(
        "Old GP:",
        oldGP
      );

      console.log(
        "Reward:",
        700
      );

      console.log(
        "New GP:",
        newGP
      );

      console.log(
        "================================="
      );

      return NextResponse.json(
        {
          success: true,

          alreadyClaimed: false,

          reward: 700,

          geniusPoints: newGP,

          message:
            "🎉 Tabriklaymiz! Password buzildi! +700 GP",
        },
        {
          status: 200,

          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    /*
    =====================================================
      ALREADY CLAIMED
    =====================================================
    */

    const currentUser =
      await users.findOne(
        {
          _id: user._id,
        },
        {
          projection: {
            geniusPoints: 1,

            guessPasswordRewardClaimed:
              1,
          },
        }
      );

    const currentGP =
      Number(
        currentUser?.geniusPoints ??
          0
      );

    return NextResponse.json(
      {
        success: true,

        alreadyClaimed: true,

        reward: 0,

        geniusPoints: currentGP,

        message:
          "🎉 Password ochildi! 700 GP reward avval berilgan.",
      },
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
      "FINAL PASSWORD API ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
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
import { NextResponse } from "next/server";
import crypto from "crypto";

/*
=========================================================
  CREATE SESSION TOKEN
=========================================================
*/

function createToken(identifier: string) {
  const secret =
    process.env.GUESS_PASSWORD_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "GUESS_PASSWORD_SESSION_SECRET is missing."
    );
  }

  const timestamp = Date.now().toString();

  const payload =
    `${timestamp}:${identifier}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`guess-password:${payload}`)
    .digest("hex");

  const encodedIdentifier =
    Buffer.from(identifier, "utf8").toString(
      "base64url"
    );

  return `${timestamp}.${encodedIdentifier}.${signature}`;
}

/*
=========================================================
  CALCULATE GUESS RESULT
=========================================================

  correct:
    belgi to'g'ri va joyi to'g'ri

  misplaced:
    belgi passwordda bor,
    lekin joyi noto'g'ri

  wrong:
    belgi passwordda umuman yo'q
=========================================================
*/

function calculateResult(
  guess: string,
  correct: string
): ("correct" | "misplaced" | "wrong")[] {
  const result: (
    | "correct"
    | "misplaced"
    | "wrong"
  )[] = Array(guess.length).fill("wrong");

  /*
  =======================================================
    1. AVVAL EXACT MATCH
  =======================================================
  */

  const remainingCorrect: string[] = [];
  const remainingGuess: string[] = [];

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correct[i]) {
      result[i] = "correct";
    } else {
      remainingGuess.push(guess[i]);
      remainingCorrect.push(correct[i]);
    }
  }

  /*
  =======================================================
    2. MISPLACED MATCH
  =======================================================
  */

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") {
      continue;
    }

    const character = guess[i];

    const correctIndex =
      remainingCorrect.indexOf(character);

    if (correctIndex !== -1) {
      result[i] = "misplaced";

      remainingCorrect.splice(
        correctIndex,
        1
      );
    }
  }

  return result;
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
      READ BODY
    =====================================================
    */

    const body = await request.json();

    const guess =
      typeof body?.guess === "string"
        ? body.guess
            .trim()
            .toUpperCase()
        : "";

    const username =
      typeof body?.username === "string"
        ? body.username.trim()
        : "";

    const email =
      typeof body?.email === "string"
        ? body.email.trim()
        : "";

    /*
    =====================================================
      USER IDENTIFIER
    =====================================================
    */

    const identifier =
      username || email;

    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User aniqlanmadi. Iltimos, qayta login qiling.",
        },
        {
          status: 401,
        }
      );
    }

    /*
    =====================================================
      SERVER FIRST 4
    =====================================================
    */

    const correctGuess =
      process.env.GUESS_PASSWORD_FIRST4
        ?.trim()
        .toUpperCase();

    if (!correctGuess) {
      console.error(
        "GUESS_PASSWORD_FIRST4 is missing."
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
      !/^[A-Z0-9]{4}$/.test(
        correctGuess
      )
    ) {
      console.error(
        "GUESS_PASSWORD_FIRST4 must contain exactly 4 letters/numbers."
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
      GUESS LENGTH
    =====================================================
    */

    if (guess.length !== 4) {
      return NextResponse.json(
        {
          success: false,
          error:
            "4 ta belgidan iborat kod kiriting.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    =====================================================
      GUESS CHARACTERS
    =====================================================
    */

    if (!/^[A-Z0-9]{4}$/.test(guess)) {
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
      CALCULATE RESULT
    =====================================================
    */

    const result =
      calculateResult(
        guess,
        correctGuess
      );

    /*
    =====================================================
      CHECK WHETHER EVERYTHING IS CORRECT
    =====================================================
    */

    const isCorrect =
      result.every(
        (item) =>
          item === "correct"
      );

    /*
    =====================================================
      WRONG GUESS
    =====================================================
    */

    if (!isCorrect) {
      return NextResponse.json(
        {
          success: false,
          correct: false,
          result,
          error:
            "Password noto'g'ri. Ranglarga qarab yana urinib ko'ring.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    /*
    =====================================================
      CORRECT GUESS
    =====================================================
    */

    const token =
      createToken(identifier);

    console.log(
      "================================="
    );

    console.log(
      "GUESS PASSWORD FIRST 4 CORRECT"
    );

    console.log(
      "User:",
      identifier
    );

    console.log(
      "================================="
    );

    /*
    =====================================================
      SUCCESS
    =====================================================
    */

    return NextResponse.json(
      {
        success: true,
        correct: true,
        result,
        token,
        message:
          "🎉 4 ta belgini to'g'ri topdingiz!",
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
      "Guess password API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}
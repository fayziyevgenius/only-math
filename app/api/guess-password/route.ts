import { NextResponse } from "next/server";
import crypto from "crypto";

/*
=========================================================
  CREATE SESSION TOKEN
=========================================================
*/

function createToken(identifier: string) {
  const secret =
    process.env.GUESS_PASSWORD_SESSION_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "GUESS_PASSWORD_SESSION_SECRET is missing."
    );
  }

  const timestamp = Date.now().toString();

  const payload = `${timestamp}:${identifier}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`guess-password:${payload}`)
    .digest("hex");

  const encodedIdentifier = Buffer.from(
    identifier,
    "utf8"
  ).toString("base64url");

  return `${timestamp}.${encodedIdentifier}.${signature}`;
}

/*
=========================================================
  CALCULATE GUESS RESULT

  correct   = belgi bor + joyi to'g'ri
  misplaced = belgi bor + joyi noto'g'ri
  wrong     = belgi umuman yo'q

  Duplicate belgilar ham to'g'ri hisoblanadi.
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

  const usedCorrect = Array(correct.length).fill(false);

  /*
  =======================================================
    1. EXACT MATCH
  =======================================================
  */

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correct[i]) {
      result[i] = "correct";
      usedCorrect[i] = true;
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

    for (let j = 0; j < correct.length; j++) {
      if (
        !usedCorrect[j] &&
        guess[i] === correct[j]
      ) {
        result[i] = "misplaced";
        usedCorrect[j] = true;
        break;
      }
    }
  }

  return result;
}

/*
=========================================================
  SAFE JSON RESPONSE
=========================================================
*/

function jsonResponse(
  data: unknown,
  status = 200
) {
  return NextResponse.json(
    data,
    {
      status,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    }
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
      READ BODY
    =====================================================
    */

    let body: any;

    try {
      body = await request.json();
    } catch (error) {
      console.error(
        "Invalid JSON body:",
        error
      );

      return jsonResponse(
        {
          success: false,
          correct: false,
          result: [
            "wrong",
            "wrong",
            "wrong",
            "wrong",
          ],
          error:
            "Noto'g'ri so'rov yuborildi.",
        },
        400
      );
    }

    /*
    =====================================================
      READ GUESS
    =====================================================
    */

    const guess =
      typeof body?.guess === "string"
        ? body.guess
            .trim()
            .toUpperCase()
        : "";

    /*
    =====================================================
      READ USER
    =====================================================
    */

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
      IDENTIFIER
    =====================================================
    */

    const identifier =
      username || email;

    if (!identifier) {
      return jsonResponse(
        {
          success: false,
          correct: false,
          result: [
            "wrong",
            "wrong",
            "wrong",
            "wrong",
          ],
          error:
            "User aniqlanmadi. Iltimos, qayta login qiling.",
        },
        401
      );
    }

    /*
    =====================================================
      SERVER PASSWORD
    =====================================================
    */

    const correctGuess =
      process.env.GUESS_PASSWORD_FIRST4
        ?.trim()
        .toUpperCase();

    /*
    =====================================================
      ENV MISSING
    =====================================================
    */

    if (!correctGuess) {
      console.error(
        "GUESS_PASSWORD_FIRST4 is missing."
      );

      return jsonResponse(
        {
          success: false,
          correct: false,
          error:
            "Server configuration error.",
        },
        500
      );
    }

    /*
    =====================================================
      ENV VALIDATION
    =====================================================
    */

    if (
      !/^[A-Z0-9]{4}$/.test(
        correctGuess
      )
    ) {
      console.error(
        "Invalid GUESS_PASSWORD_FIRST4:",
        correctGuess.length
      );

      return jsonResponse(
        {
          success: false,
          correct: false,
          error:
            "Server password configuration error.",
        },
        500
      );
    }

    /*
    =====================================================
      GUESS LENGTH
    =====================================================
    */

    if (
      guess.length !== 4
    ) {
      return jsonResponse(
        {
          success: false,
          correct: false,
          result: [
            "wrong",
            "wrong",
            "wrong",
            "wrong",
          ],
          error:
            "4 ta belgidan iborat kod kiriting.",
        },
        400
      );
    }

    /*
    =====================================================
      GUESS CHARACTERS
    =====================================================
    */

    if (
      !/^[A-Z0-9]{4}$/.test(
        guess
      )
    ) {
      return jsonResponse(
        {
          success: false,
          correct: false,
          result: [
            "wrong",
            "wrong",
            "wrong",
            "wrong",
          ],
          error:
            "Faqat harf va raqamlardan foydalaning.",
        },
        400
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
      DEBUG LOG

      Vercel logs orqali ko'rish mumkin.
    =====================================================
    */

    console.log(
      "Guess:",
      guess,
      "Result:",
      result
    );

    /*
    =====================================================
      CHECK FULL MATCH
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
      return jsonResponse(
        {
          success: false,
          correct: false,
          result,
          error:
            "Password noto'g'ri. Ranglarga qarab yana urinib ko'ring.",
        },
        200
      );
    }

    /*
    =====================================================
      CORRECT GUESS
    =====================================================
    */

    let token: string;

    try {
      token =
        createToken(identifier);
    } catch (error) {
      console.error(
        "Token creation error:",
        error
      );

      return jsonResponse(
        {
          success: false,
          correct: false,
          result,
          error:
            "Session configuration error.",
        },
        500
      );
    }

    /*
    =====================================================
      SUCCESS LOG
    =====================================================
    */

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
      "Guess:",
      guess
    );

    console.log(
      "================================="
    );

    /*
    =====================================================
      SUCCESS
    =====================================================
    */

    return jsonResponse(
      {
        success: true,
        correct: true,
        result,
        token,
        message:
          "🎉 4 ta belgini to'g'ri topdingiz!",
      },
      200
    );
  } catch (error) {
    /*
    =====================================================
      REAL SERVER ERROR
    =====================================================
    */

    console.error(
      "Guess password API error:",
      error
    );

    return jsonResponse(
      {
        success: false,
        correct: false,
        error:
          "Server Error.",
      },
      500
    );
  }
}
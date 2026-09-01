import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    console.log("========== LOGIN ==========");
    console.log("LOGIN:", username);

    if (!username || !password) {
      return NextResponse.json(
        {
          error: "Username/email and password are required.",
        },
        { status: 400 }
      );
    }

    const loginValue = String(username).trim();

    /* =====================================================
       ADMIN LOGIN
    ===================================================== */

    const adminUsername =
      process.env.ADMIN_USERNAME || "onlymathadmin";

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (
      adminPassword &&
      loginValue === adminUsername &&
      password === adminPassword
    ) {
      console.log("ADMIN LOGIN SUCCESS");

      return NextResponse.json({
        success: true,

        user: {
          username: adminUsername,
          isAdmin: true,
          role: "admin",
          name: "Only Math Admin",
        },
      });
    }

    /* =====================================================
       DATABASE
    ===================================================== */

    const db = await connectDB();

    const users = db.collection("users");

    /* =====================================================
       FIND USER
       Username OR Email
    ===================================================== */

    const user = await users.findOne({
      $or: [
        {
          username: loginValue,
        },
        {
          email: loginValue,
        },
      ],
    });

    console.log(
      "USER RESULT:",
      user
        ? {
            username: user.username,
            email: user.email,
          }
        : null
    );

    if (!user) {
      console.log("USER NOT FOUND:", loginValue);

      return NextResponse.json(
        {
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    /* =====================================================
       PASSWORD
    ===================================================== */

    if (
      String(user.password) !==
      String(password)
    ) {
      console.log(
        "INCORRECT PASSWORD:",
        loginValue
      );

      return NextResponse.json(
        {
          error: "Incorrect password.",
        },
        { status: 401 }
      );
    }

    /* =====================================================
       REMOVE PASSWORD
    ===================================================== */

    const safeUser = {
      ...user,
      password: undefined,
    };

    console.log(
      "USER LOGIN SUCCESS:",
      user.username
    );

    console.log("==========================");

    return NextResponse.json({
      success: true,

      user: safeUser,
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
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
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const identifier = String(body?.username || "")
      .trim()
      .toLowerCase();

    const password = String(body?.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        {
          error: "Email/Username and password are required.",
        },
        { status: 400 }
      );
    }

    console.log("=================================");
    console.log("LOGIN ATTEMPT");
    console.log("Identifier:", identifier);
    console.log("=================================");

    /*
     * ADMIN LOGIN
     */

    const adminUsername = String(
      process.env.ADMIN_USERNAME || "onlymathadmin"
    ).trim().toLowerCase();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      adminPassword &&
      identifier === adminUsername &&
      password === adminPassword
    ) {
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

    /*
     * DATABASE
     */

    const db = await connectDB();

    const users = db.collection("users");

    /*
     * USER SEARCH
     *
     * Email yoki username.
     * Katta/kichik harflar farqi bo'lmaydi.
     */

    const user = await users.findOne({
      $or: [
        {
          email: {
            $regex: `^${escapeRegex(identifier)}$`,
            $options: "i",
          },
        },
        {
          username: {
            $regex: `^${escapeRegex(identifier)}$`,
            $options: "i",
          },
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
      console.log("USER NOT FOUND:", identifier);

      return NextResponse.json(
        {
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    /*
     * PASSWORD
     */

    if (String(user.password) !== password) {
      console.log("INCORRECT PASSWORD");

      return NextResponse.json(
        {
          error: "Incorrect password.",
        },
        { status: 401 }
      );
    }

    /*
     * PASSWORDNI FRONTENDGA YUBORMAYMIZ
     */

    const safeUser = {
      ...user,
      password: undefined,
    };

    console.log(
      "LOGIN SUCCESS:",
      user.username
    );

    console.log("=================================");

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}

/*
 * Regex ichidagi maxsus belgilarni escape qiladi.
 */
function escapeRegex(value: string) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}
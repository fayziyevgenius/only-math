import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const identifier = String(body?.username || "").trim();
    const password = String(body?.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        {
          error: "Email/Username and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("=================================");
    console.log("LOGIN ATTEMPT");
    console.log("Identifier:", identifier);
    console.log("=================================");

    const db = await connectDB();

    console.log("MongoDB connected");

    /*
     * Email OR username orqali user qidiramiz.
     */
    const user = await db.collection("users").findOne({
      $or: [
        {
          username: identifier,
        },
        {
          email: identifier,
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
        {
          status: 404,
        }
      );
    }

    /*
     * Hozirgi registration sistemang passwordni
     * oddiy string sifatida saqlayapti.
     *
     * Shuning uchun eski login ishlash tartibini
     * saqlab qolamiz.
     */
    if (String(user.password) !== password) {
      console.log("INCORRECT PASSWORD");

      return NextResponse.json(
        {
          error: "Incorrect password.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Frontendga passwordni qaytarmaymiz.
     */
    const safeUser = {
      ...user,
      password: undefined,
    };

    console.log("LOGIN SUCCESS:", user.username);

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
      {
        status: 500,
      }
    );
  }
}
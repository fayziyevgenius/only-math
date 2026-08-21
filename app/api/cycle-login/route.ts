import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

type CycleName = "genesis" | "independence";

function getCurrentCycle(): CycleName | null {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const today = formatter.format(new Date());

  if (today >= "2026-08-17" && today <= "2026-08-30") {
    return "genesis";
  }

  if (today >= "2026-08-31" && today <= "2026-09-13") {
    return "independence";
  }

  return null;
}

function getToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required.",
        },
        { status: 400 }
      );
    }

    const cycle = getCurrentCycle();

    if (!cycle) {
      return NextResponse.json({
        success: true,
        cycle: null,
        days: 0,
        unlocked: false,
      });
    }

    const today = getToday();

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

    const currentDays =
      user.cycleLoginDays?.[cycle] || [];

    const days: string[] = Array.isArray(currentDays)
      ? currentDays
      : [];

    /*
     * MUHIM:
     *
     * Agar bugun allaqachon yozilgan bo'lsa,
     * yana qo'shilmaydi.
     *
     * Shuning uchun bir kunda 100 marta
     * login qilsa ham 1 kun hisoblanadi.
     */

    if (!days.includes(today)) {
      days.push(today);
    }

    /*
     * Faqat current cycle kunlarini saqlaymiz.
     */

    await users.updateOne(
      {
        username,
      },
      {
        $set: {
          [`cycleLoginDays.${cycle}`]: days,
          updatedAt: new Date(),
        },
      }
    );

    const unlocked = days.length >= 7;

    return NextResponse.json({
      success: true,
      cycle,
      today,
      days,
      daysCount: days.length,
      unlocked,
    });
  } catch (error) {
    console.error("Cycle login error:", error);

    return NextResponse.json(
      {
        error: "Server Error.",
      },
      { status: 500 }
    );
  }
}
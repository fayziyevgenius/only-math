import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

const DEFAULT_CYCLE = {
  name: "Genesis Cycle",
  number: 1,
  theme: "genesis",
  start: "2026-08-17",
  end: "2026-08-30",
};

function isAdmin(username: string) {
  return (
    username === process.env.ADMIN_USERNAME &&
    !!process.env.ADMIN_PASSWORD
  );
}

export async function GET() {
  try {
    const db = await connectDB();

    const settings = await db
      .collection("settings")
      .findOne({
        type: "cycle",
      });

    return NextResponse.json({
      success: true,
      cycle: settings?.cycle || DEFAULT_CYCLE,
    });
  } catch (error) {
    console.error("Admin GET cycle error:", error);

    return NextResponse.json(
      {
        error: "Server Error.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const username = body?.username;
    const start = body?.start;
    const end = body?.end;

    if (!username || !isAdmin(username)) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (!start || !end) {
      return NextResponse.json(
        {
          error: "Start va end date kerak.",
        },
        { status: 400 }
      );
    }

    if (start > end) {
      return NextResponse.json(
        {
          error: "Start date end date'dan keyin bo'lishi mumkin emas.",
        },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const settingsCollection =
      db.collection("settings");

    const oldSettings =
      await settingsCollection.findOne({
        type: "cycle",
      });

    const oldCycle =
      oldSettings?.cycle || DEFAULT_CYCLE;

    const updatedCycle = {
      name: oldCycle.name,
      number: oldCycle.number,
      theme: oldCycle.theme,
      start,
      end,
      updatedAt: new Date(),
    };

    await settingsCollection.updateOne(
      {
        type: "cycle",
      },
      {
        $set: {
          type: "cycle",
          cycle: updatedCycle,
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      cycle: updatedCycle,
    });
  } catch (error) {
    console.error("Admin POST cycle error:", error);

    return NextResponse.json(
      {
        error: "Server Error.",
      },
      { status: 500 }
    );
  }
}
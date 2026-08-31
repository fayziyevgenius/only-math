import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "RESET API IS WORKING",
    date: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "RESET POST IS WORKING",
    date: new Date().toISOString(),
  });
}
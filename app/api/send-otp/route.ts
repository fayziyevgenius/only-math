import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const db = await connectDB();
    const existingUser = await db.collection("users").findOne({
  email,
});

if (existingUser) {
  return NextResponse.json(
    { error: "This email is already registered." },
    { status: 400 }
  );
}
    await db.collection("otp_codes").deleteMany({ email });

    // Yangi OTP ni saqlash
    await db.collection("otp_codes").insertOne({
      email,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minut
    });

    const result = await resend.emails.send({
  from: "Only Math <verify@onlymath.app>",
  to: email,
  subject: "Only Math Verification Code",
  html: `
<div style="max-width:650px;margin:auto;background:#111827;padding:40px;border-radius:20px;font-family:Arial,sans-serif;color:white;">

  <div style="text-align:center;">
    <h1 style="color:#22c55e;font-size:38px;margin-bottom:10px;">
      Welcome to Only Math 🎉
    </h1>

    <p style="color:#d1d5db;font-size:18px;">
      Verify your email to complete your registration.
    </p>
  </div>

  <div
    style="
      background:#18181b;
      border:2px solid #22c55e;
      border-radius:18px;
      padding:30px;
      text-align:center;
      margin:40px 0;
    "
  >
    <p style="margin:0;color:#9ca3af;font-size:18px;">
      Your Verification Code
    </p>

    <h1
      style="
        margin:15px 0 0;
        font-size:52px;
        letter-spacing:12px;
        color:#22c55e;
      "
    >
      ${otp}
    </h1>
  </div>

  <p style="font-size:17px;line-height:1.8;">
    Enter this code in the verification page to activate your
    <b> Only Math </b> account.
  </p>

  <p style="font-size:17px;line-height:1.8;">
    This code is valid for <b>10 minutes</b>.
  </p>

  <hr style="border-color:#374151;margin:35px 0;">

  <p style="color:#9ca3af;">
    If you didn't create an account on Only Math,
    you can safely ignore this email.
  </p>

  <div style="margin-top:35px;text-align:center;">
    <a
      href="https://onlymath.app"
      style="
        display:inline-block;
        background:#22c55e;
        color:white;
        padding:16px 34px;
        text-decoration:none;
        border-radius:12px;
        font-weight:bold;
        font-size:18px;
      "
    >
      Visit Only Math
    </a>
  </div>

  <div style="text-align:center;margin-top:40px;">
    <h3 style="color:#22c55e;">
      Only Math Team 💚
    </h3>

    <p style="color:#6b7280;">
      Learn • Compete • Become a Math Genius
    </p>
  </div>

</div>
`,
});

if (result.error) {
  return NextResponse.json(
    { error: result.error.message },
    { status: 400 }
  );
}

return NextResponse.json({ success: true });

console.log(result);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to send OTP." },
      { status: 500 }
    );
  }
}
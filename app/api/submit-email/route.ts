
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;

    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (!apiKey || !notifyEmail) {
      console.error("Missing Resend environment variables.");

      return NextResponse.json(
        { message: "Email service is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const submittedEmail = email.trim();
    const submittedAt = new Date().toISOString();

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [notifyEmail],
      replyTo: submittedEmail,
      subject: "New Email Submission",
      text: `A visitor submitted their email.

Email: ${submittedEmail}
Submitted at (UTC): ${submittedAt}`,
    });

    if (error || !data) {
      console.error("Resend email error:", error);

      return NextResponse.json(
        { message: "Unable to send notification. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "Thank you! Your email has been submitted.",
    });
  } catch (error) {
    console.error("Submission error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

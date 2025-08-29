import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Story content is required" },
        { status: 400 }
      );
    }

    // EmailJS configuration
    const emailjsData = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: process.env.YOUR_EMAIL, // Your personal email
        from_name: "Claudia Story Submission",
        message: message,
        language: language || "en",
        subject: "New Story for Claudia",
      },
    };

    // Send email via EmailJS
    const response = await fetch(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailjsData),
      }
    );

    if (!response.ok) {
      throw new Error(`EmailJS API error: ${response.statusText}`);
    }

    return NextResponse.json(
      { success: true, message: "Story submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting story:", error);
    return NextResponse.json(
      { error: "Failed to submit story" },
      { status: 500 }
    );
  }
}

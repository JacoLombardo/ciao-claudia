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

    // Send email via Formspree
    const response = await fetch("https://formspree.io/f/mrbaedwe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        language: language === "it" ? "Italian" : "English",
        subject: "New Story for Claudia",
        _subject: "New Story for Claudia",
      }),
    });

    if (!response.ok) {
      throw new Error(`Formspree error: ${response.statusText}`);
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

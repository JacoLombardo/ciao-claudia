import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection string - use environment variable
const MONGODB_URI = process.env.MONGODB_URI || "";

interface Story {
  id: string;
  text: string;
  language: "en" | "it";
  createdAt: Date;
}

interface MongoStory {
  _id: string;
  id: string;
  text: string;
  language: "en" | "it";
  createdAt: Date;
}

export async function GET() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("claudiate");

    // Get stories from the stories collection
    const dbStories = (await db
      .collection("stories")
      .find({})
      .toArray()) as unknown as MongoStory[];

    // Convert MongoDB documents to our Story interface
    const stories: Story[] = dbStories.map((doc) => ({
      id: doc.id,
      text: doc.text,
      language: doc.language,
      createdAt: doc.createdAt,
    }));

    await client.close();

    console.log(`Found ${stories.length} stories in database`);

    return NextResponse.json({
      messages: stories,
      total: stories.length,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection string - use environment variable
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Claudia:Claudia1@cluster0.zt4gj7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

interface Story {
  id: string;
  text: string;
  language: "en" | "it";
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("claudiate");

    // Try to get stories from the stories collection first
    let stories: Story[] = [];
    const dbStories = await db.collection("stories").find({}).toArray();

    if (dbStories.length > 0) {
      // Convert MongoDB documents to our Story interface
      stories = dbStories.map((doc) => ({
        id: doc.id || doc._id?.toString() || `story-${Date.now()}`,
        text: doc.text || "Unknown story",
        language: doc.language || "it",
        createdAt: doc.createdAt || new Date(),
      }));
    } else {
      // Fall back to the old claudiate collection
      const oldStories = await db.collection("claudiate").find({}).toArray();
      if (oldStories.length > 0) {
        // Convert old format to new format
        stories = oldStories.map((story, index: number) => ({
          id: `legacy-${index + 1}`,
          text: story.claudiate || story.text || "Unknown story",
          language: "it" as const, // Assume Italian for old stories
          createdAt: new Date(),
        }));
      }
    }

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

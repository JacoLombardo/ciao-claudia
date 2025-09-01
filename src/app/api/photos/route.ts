import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || "";

interface Photo {
  id: string;
  url: string;
  createdAt: Date;
}

interface MongoPhoto {
  _id: string;
  id: string;
  url: string;
  createdAt: Date;
}

export async function GET() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("claudiate");

    // Get photos from the photos collection, sorted by creation date (newest first)
    const dbPhotos = await db
      .collection<MongoPhoto>("photos")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert MongoDB documents to our Photo interface
    const photos: Photo[] = dbPhotos.map((doc) => ({
      id: doc.id,
      url: doc.url,
      createdAt: doc.createdAt,
    }));

    await client.close();

    console.log(`Found ${photos.length} photos in database`);

    return NextResponse.json({
      photos: photos,
      total: photos.length,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Photo URL is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("claudiate");

    // Create a new photo document
    const photo: Photo = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: url,
      createdAt: new Date(),
    };

    // Insert the photo into the photos collection
    await db.collection("photos").insertOne(photo);

    await client.close();

    console.log(`Saved photo with ID: ${photo.id}`);

    return NextResponse.json({
      success: true,
      photo: photo,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save photo" },
      { status: 500 }
    );
  }
}

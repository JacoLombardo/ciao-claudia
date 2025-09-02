import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection string - use environment variable
const MONGODB_URI = process.env.MONGODB_URI || "";

interface MongoGalleryImage {
  _id: string;
  id: string;
  url: string;
  createdAt: Date;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("claudiate");

    // Delete the image from the gallery collection
    const result = await db
      .collection<MongoGalleryImage>("gallery")
      .deleteOne({ id });

    await client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    console.log(`Deleted gallery image with ID: ${id}`);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}


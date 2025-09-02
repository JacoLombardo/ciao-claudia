import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection string - use environment variable
const MONGODB_URI = process.env.MONGODB_URI || "";

interface GalleryImage {
  id: string;
  url: string;
  createdAt: Date;
}

interface MongoGalleryImage {
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

    // Get gallery images from the gallery collection
    const dbImages = await db
      .collection<MongoGalleryImage>("gallery")
      .find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    // Convert MongoDB documents to our GalleryImage interface
    const images: GalleryImage[] = dbImages.map((doc) => ({
      id: doc.id,
      url: doc.url,
      createdAt: doc.createdAt.toISOString(),
    }));

    await client.close();

    console.log(`Found ${images.length} gallery images in database`);

    return NextResponse.json({
      images,
      total: images.length,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("claudiate");

    // Generate a unique ID for the image
    const imageId = `img_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create the gallery image document
    const galleryImage: MongoGalleryImage = {
      _id: imageId,
      id: imageId,
      url,
      createdAt: new Date(),
    };

    // Insert the image into the gallery collection
    await db.collection<MongoGalleryImage>("gallery").insertOne(galleryImage);

    await client.close();

    console.log(`Saved gallery image with ID: ${imageId}`);

    return NextResponse.json({
      success: true,
      image: {
        id: galleryImage.id,
        url: galleryImage.url,
        createdAt: galleryImage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save gallery image" },
      { status: 500 }
    );
  }
}


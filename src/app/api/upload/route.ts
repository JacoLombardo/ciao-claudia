import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  return NextResponse.json({ message: "Upload API is working" });
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== UPLOAD API CALLED ===");

    // Debug: Log ALL environment variables
    console.log(
      "ALL ENV VARS:",
      Object.keys(process.env).filter((key) => key.includes("CLOUDINARY"))
    );
    console.log("Raw values:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Debug: Log environment variables (remove in production)
    console.log("Environment check:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "NOT SET",
      api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET",
    });

    // Check if Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary environment variables not configured");
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    console.log("Attempting to upload image to Cloudinary...");

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      folder: "ciao-claudia/gallery",
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
    });

    console.log("Image uploaded to Cloudinary:", result.public_id);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        error: `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}

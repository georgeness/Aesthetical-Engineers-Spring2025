import { NextResponse } from "next/server";
import { connectToDB } from "../../../utils/database";
import Painting from "../../../modules/painting";

export async function GET(request, { params }) {
  try {
    // Extract the filename
    const filename = params.id.join('/');
    console.log(`Image redirect request for: ${filename}`);
    
    // First, try to find the painting by local path
    await connectToDB();
    const painting = await Painting.findOne({ image: `/images/${filename}` });
    
    // If found, redirect to the blob URL
    if (painting && painting.image && painting.image.includes("vercel-storage.com")) {
      console.log(`Redirecting to Blob storage URL: ${painting.image}`);
      return NextResponse.redirect(painting.image);
    }
    
    // If not found or no blob URL, try to construct a fallback URL
    // This assumes images were migrated with the same filename
    const blobUrl = `https://bhvqdgbwuom91t7g.public.blob.vercel-storage.com/${filename}`;
    console.log(`Trying fallback URL: ${blobUrl}`);
    
    return NextResponse.redirect(blobUrl);
  } catch (error) {
    console.error("Error handling image redirect:", error);
    return NextResponse.json({ error: "Failed to retrieve image" }, { status: 500 });
  }
} 
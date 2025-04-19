import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

// Configure the route to allow larger uploads using the new format
export const dynamic = 'force-dynamic';
export const maxDuration = 90; // Increase to 90 seconds for very large uploads
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const bodyParser = {
  sizeLimit: '32mb' // Set Next.js body parser limit slightly higher than our actual limit
};

// POST - Handle image upload
export async function POST(request) {
  try {
    // Check if user is logged in via cookies or authorization header
    const cookieLoggedIn = request.cookies.get('loggedIn')?.value === 'true';
    // Also check headers in case cookies aren't working
    const headerLoggedIn = request.headers.get('x-is-logged-in') === 'true';
    
    const isLoggedIn = cookieLoggedIn || headerLoggedIn;
    
    console.log("Login status:", { cookieLoggedIn, headerLoggedIn, isLoggedIn });
    
    // TEMPORARY: Allow uploads without auth for testing
    // Remove this override in production
    const bypassAuth = true;
    
    if (!isLoggedIn && !bypassAuth) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get("file");
    
    console.log("File received:", file?.name, file?.type, file?.size); // Log file info
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, JPG, PNG and WebP images are allowed" 
      }, { status: 400 });
    }
    
    // Validate file size (limit to 30MB)
    const maxSize = 30 * 1024 * 1024; // 30MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is 30MB, your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
      }, { status: 400 });
    }
    
    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    console.log("Attempting to upload to Blob Storage:", fileName, "Size:", (file.size / (1024 * 1024)).toFixed(2) + "MB"); // Log upload attempt with size info
    
    try {
      // Upload to Vercel Blob Storage
      const blob = await put(fileName, file, {
        access: 'public',
        contentDisposition: 'inline',
        addRandomSuffix: false,
        cacheControl: 'public, max-age=31536000, immutable',
      });
      
      console.log("Upload successful, blob URL:", blob.url); // Log success
      
      // Return the image URL
      return NextResponse.json({ 
        url: blob.url,
        message: "File uploaded successfully",
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
      }, { status: 200 });
    } catch (blobError) {
      console.error("Blob storage error details:", blobError); // Log detailed blob error
      
      // Check if the error is related to file size
      const errorMessage = blobError.message || '';
      if (errorMessage.includes('size') || errorMessage.includes('large')) {
        return NextResponse.json({ 
          error: `File size error: ${errorMessage}. Try a smaller file or compress this one.` 
        }, { status: 413 }); // 413 = Payload Too Large
      }
      
      return NextResponse.json({ 
        error: `Blob storage error: ${blobError.message}` 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ 
      error: `Failed to upload file: ${error.message}` 
    }, { status: 500 });
  }
} 
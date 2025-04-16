import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

// POST - Handle image upload
export async function POST(request) {
  try {
    // Check if user is logged in
    const isLoggedIn = request.cookies.get('loggedIn')?.value === 'true';
    
    console.log("Login status:", isLoggedIn); // Log auth status
    
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get("file");
    
    console.log("File received:", file?.name, file?.type, file?.size); // Log file info
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG and PNG images are allowed" 
      }, { status: 400 });
    }
    
    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 5MB" 
      }, { status: 400 });
    }
    
    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    console.log("Attempting to upload to Blob Storage:", fileName); // Log upload attempt
    
    try {
      // Upload to Vercel Blob Storage
      const blob = await put(fileName, file, {
        access: 'public',
      });
      
      console.log("Upload successful, blob URL:", blob.url); // Log success
      
      // Return the image URL
      return NextResponse.json({ 
        url: blob.url,
        message: "File uploaded successfully" 
      }, { status: 200 });
    } catch (blobError) {
      console.error("Blob storage error details:", blobError); // Log detailed blob error
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
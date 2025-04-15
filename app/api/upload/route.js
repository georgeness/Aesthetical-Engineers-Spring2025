import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// POST - Handle image upload
export async function POST(request) {
  try {
    // Check if user is logged in
    const isLoggedIn = request.cookies.get('loggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get("file");
    
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
    
    // Define the upload path
    const uploadDir = path.join(process.cwd(), "public/images");
    const filePath = path.join(uploadDir, fileName);
    
    // Read the file as a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Write the file to the server
    await writeFile(filePath, buffer);
    
    // Return the image URL
    return NextResponse.json({ 
      url: `/images/${fileName}`,
      message: "File uploaded successfully" 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
} 
import { connectToDB } from "../../../utils/database";
import Painting from "../../../modules/painting";
import { NextResponse } from "next/server";

// GET all paintings
export async function GET(request) {
  try {
    await connectToDB();
    
    // Always sort by order first (ascending), then by creation date (descending)
    const paintings = await Painting.find({}).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(paintings, { status: 200 });
  } catch (error) {
    console.error("Error fetching paintings:", error);
    return NextResponse.json({ error: "Failed to fetch paintings" }, { status: 500 });
  }
}

// POST - Create a new painting
export async function POST(request) {
  try {
    // Check if user is logged in
    const isLoggedIn = request.cookies.get('loggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    
    await connectToDB();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'dimensions', 'medium', 'price', 'image'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Instead of adding to the end, shift all paintings down and place new one at top
    // Increment all existing paintings' order values by 1
    await Painting.updateMany({}, { $inc: { order: 1 } });
    
    // Create new painting with order 0 (will appear at the top)
    const newPainting = new Painting({
      ...data,
      order: 0
    });
    
    await newPainting.save();
    
    return NextResponse.json(newPainting, { status: 201 });
  } catch (error) {
    console.error("Error creating painting:", error);
    return NextResponse.json({ error: "Failed to create painting" }, { status: 500 });
  }
} 
import { connectToDB } from "../../../utils/database";
import Painting from "../../../modules/painting";
import { NextResponse } from "next/server";

// GET all paintings
export async function GET(request) {
  try {
    await connectToDB();
    
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
    
    // Find the maximum order value and add 1 for the new painting
    const maxOrderPainting = await Painting.findOne().sort({ order: -1 });
    const newOrder = maxOrderPainting ? maxOrderPainting.order + 1 : 0;
    
    // Create new painting with order
    const newPainting = new Painting({
      ...data,
      order: newOrder
    });
    
    await newPainting.save();
    
    return NextResponse.json(newPainting, { status: 201 });
  } catch (error) {
    console.error("Error creating painting:", error);
    return NextResponse.json({ error: "Failed to create painting" }, { status: 500 });
  }
} 
import { connectToDB } from "../../../../utils/database";
import Painting from "../../../../modules/painting";
import { NextResponse } from "next/server";

// PATCH - Update painting orders
export async function PATCH(request) {
  try {
    // Check if user is logged in
    const isLoggedIn = request.cookies.get('loggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    
    await connectToDB();
    
    const data = await request.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    
    // Update each painting's order
    const updateOperations = data.map(item => {
      return Painting.findByIdAndUpdate(
        item.id,
        { order: item.order },
        { new: true }
      );
    });
    
    await Promise.all(updateOperations);
    
    return NextResponse.json({ message: "Painting orders updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating painting orders:", error);
    return NextResponse.json({ error: "Failed to update painting orders" }, { status: 500 });
  }
} 
import { connectToDB } from "../../../../utils/database";
import Painting from "../../../../modules/painting";
import { NextResponse } from "next/server";

// GET painting by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await connectToDB();
    
    const painting = await Painting.findById(id);
    
    if (!painting) {
      return NextResponse.json({ error: "Painting not found" }, { status: 404 });
    }
    
    return NextResponse.json(painting, { status: 200 });
  } catch (error) {
    console.error("Error fetching painting:", error);
    return NextResponse.json({ error: "Failed to fetch painting" }, { status: 500 });
  }
}

// PATCH - Update a painting
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    
    // Check if user is logged in
    const isLoggedIn = request.cookies.get('loggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    
    await connectToDB();
    
    const data = await request.json();
    
    // Update the painting
    const updatedPainting = await Painting.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedPainting) {
      return NextResponse.json({ error: "Painting not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedPainting, { status: 200 });
  } catch (error) {
    console.error("Error updating painting:", error);
    return NextResponse.json({ error: "Failed to update painting" }, { status: 500 });
  }
}

// DELETE - Delete a painting
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if user is logged in
    const isLoggedIn = request.cookies.get('loggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    
    await connectToDB();
    
    // Find and delete the painting
    const deletedPainting = await Painting.findByIdAndDelete(id);
    
    if (!deletedPainting) {
      return NextResponse.json({ error: "Painting not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Painting deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting painting:", error);
    return NextResponse.json({ error: "Failed to delete painting" }, { status: 500 });
  }
} 
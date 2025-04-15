import { NextResponse } from 'next/server';
import User from '../../../modules/user';
import { connectToDB } from '../../../utils/database';

export async function GET(req) {
  // This is just for debugging and should be removed in production
  try {
    await connectToDB();
    
    // Check if any users exist
    const usersCount = await User.countDocuments();
    
    // Check for GeorgeJr specifically
    const georgeExists = await User.findOne({ username: "GeorgeJr" });
    
    return NextResponse.json({
      totalUsers: usersCount,
      georgeJrExists: !!georgeExists,
      databaseName: "share_prompt" // The database we're connected to
    }, { status: 200 });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../modules/user';
import { connectToDB } from '../../../utils/database';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    
    console.log('Login attempt for username:', username);
    
    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    // Try finding user with exact match first
    let user = await User.findOne({ username });
    
    // If not found, try case-insensitive match
    if (!user) {
      user = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, 'i') }
      });
    }
    
    // Try matching "GeorgeJr" specifically if still not found
    if (!user && (username.toLowerCase() === 'georgejr' || username.toLowerCase() === 'george jr')) {
      user = await User.findOne({
        username: "GeorgeJr"
      });
    }
    
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid username' },
        { status: 401 }
      );
    }
    
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    console.log('Password match:', isPasswordCorrect ? 'Yes' : 'No');
    
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Set a cookie to maintain login state
    const response = NextResponse.json(
      { message: 'Login successful', username: user.username },
      { status: 200 }
    );
    
    // Set both an HTTP-only cookie and a readable cookie
    response.cookies.set({
      name: 'loggedIn',
      value: 'true',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

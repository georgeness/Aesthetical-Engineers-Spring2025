import bcrypt from 'bcryptjs';
import User from '../../../modules/user';
import { connectToDB } from '../../../utils/database';

export const POST = async (req) => {
  const { username, password } = await req.json();

  try {
    // Connect to the database
    await connectToDB();

    // Find user in the database - using case-insensitive query
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid username' }),
        { status: 401 }
      );
    }

    // Compare hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ message: 'Invalid password' }),
        { status: 401 }
      );
    }

    // Return a success message if the login is successful
    return new Response(
      JSON.stringify({ message: 'Login successful' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Server error, please try again later' }),
      { status: 500 }
    );
  }
};

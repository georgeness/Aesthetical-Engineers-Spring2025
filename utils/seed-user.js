import { connectToDB } from './database.js';
import User from '../modules/user.js';
import bcrypt from 'bcryptjs';

const seedUser = async () => {
  try {
    await connectToDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ username: 'GeorgeJr' });
    
    if (existingUser) {
      console.log('User GeorgeJr already exists');
      process.exit(0);
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash('AuthoritativePermissions537', 10);
    
    await User.create({
      username: 'GeorgeJr',
      password: hashedPassword
    });
    
    console.log('User GeorgeJr created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser(); 
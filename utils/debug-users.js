import { connectToDB } from './database.js';
import User from '../modules/user.js';

const debugUsers = async () => {
  try {
    await connectToDB();
    
    // Check for all users
    const users = await User.find({});
    
    console.log('Number of users found:', users.length);
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`User ${index + 1}: ${user.username}`);
      });
    } else {
      console.log('No users found in the database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

debugUsers(); 
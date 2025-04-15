"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState(''); // Renaming 'email' to 'username'
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error state to display error messages
  const [success, setSuccess] = useState(''); // Success state to display success message
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset success and error states before new login attempt
    setError('');
    setSuccess('');

    // Normalize username to avoid case-sensitivity issues
    const normalizedUsername = username.trim();
    
    console.log('Attempting login with username:', normalizedUsername);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedUsername, password }),
      });

      const data = await response.json();
      console.log('Login response status:', response.status);

      if (response.ok) {
        console.log('Login successful, setting localStorage');
        
        // Set login state in localStorage
        localStorage.setItem('loggedIn', 'true');
        
        // Store the username for personalized welcome message (optional)
        localStorage.setItem('username', data.username || 'George');
        
        // Dispatch a custom event to notify other components of login status change
        window.dispatchEvent(new Event('auth-change'));
        
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        // Show error message if login fails
        console.log('Login failed:', data.message);
        setError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <section className="w-full flex justify-center items-start min-h-screen pt-20 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="bg-white p-9 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>

        {/* Show success message if login is successful */}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        {/* Show error message if login fails */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <input
            type="text" // Change from 'email' to 'text'
            placeholder="Username" // Change placeholder text
            value={username} // Update state to 'username'
            onChange={(e) => setUsername(e.target.value)} // Handle 'username' change
            className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow hover:from-blue-600 hover:to-blue-800 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Demo Credentials: <br />
          <span className="font-bold">login: GeorgeJr</span> <br />
          <span className="font-bold">password: AuthoritativePermissions537</span>
        </p>
      </div>
    </section>
  );
};

export default Login;
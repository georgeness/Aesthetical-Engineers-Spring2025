"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Nav = () => {
  // State for toggling the mobile menu
  const [isOpen, setIsOpen] = useState(false);
  // State to track login status and username
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('George');
  
  // Check login status on component mount and when storage changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkLoginStatus = () => {
        const loginStatus = localStorage.getItem('loggedIn') === 'true';
        setIsLoggedIn(loginStatus);
        
        // Get stored username if available
        if (loginStatus) {
          const storedUsername = localStorage.getItem('username');
          if (storedUsername) {
            setUsername(storedUsername);
          }
        }
      };
      
      // Check initially
      checkLoginStatus();
      
      // Listen for storage events (in case of logout in another tab)
      window.addEventListener('storage', checkLoginStatus);
      
      // Custom event for login/logout updates
      window.addEventListener('auth-change', checkLoginStatus);
      
      return () => {
        window.removeEventListener('storage', checkLoginStatus);
        window.removeEventListener('auth-change', checkLoginStatus);
      };
    }
  }, []);

  // Format username for display (capitalize first letter)
  const formatUsername = (name) => {
    if (!name) return 'George';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <>
      {/* -- Desktop Nav */}
      <nav className="hidden md:flex flex-between w-full mb-16 pt-7 px-4">
        <Link href="/" className="flex gap-2 flex-center mr-auto">
          <Image
            src="/images/other/signature.png"
            alt="signature"
            width={300}
            height={200}
            className="object-fit"
          />
        </Link>
        <div className="flex items-center space-x-8">
          <Link 
            href="/" 
            className="flex gap-2 flex-center relative px-2 py-1 font-medium transition-all duration-300 hover:text-orange-500 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link 
            href="/collection" 
            className="flex gap-2 flex-center relative px-2 py-1 font-medium transition-all duration-300 hover:text-orange-500 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Collection
          </Link>
          <Link 
            href="/exhibitions" 
            className="flex gap-2 flex-center relative px-2 py-1 font-medium transition-all duration-300 hover:text-orange-500 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Awards & Exhibitions
          </Link>
          <Link 
            href="/contact" 
            className="flex gap-2 flex-center relative px-2 py-1 font-medium transition-all duration-300 hover:text-orange-500 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </Link>
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="flex gap-2 flex-center px-4 py-2 bg-orange-500 text-white rounded-full transition-all duration-300 hover:bg-orange-600 hover:shadow-md hover:scale-105 ml-4"
            >
              Welcome, {formatUsername(username)}!
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="flex gap-2 flex-center px-4 py-2 bg-orange-500 text-white rounded-full transition-all duration-300 hover:bg-orange-600 hover:shadow-md hover:scale-105 ml-4"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* -- Mobile Nav (shown only if width < md) -- */}
      <nav className="md:hidden w-full px-4 mb-4">
        {/* Top bar with logo & hamburger button */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/" className="flex gap-2 flex-center">
            <Image
              src="/images/other/signature.png"
              alt="signature"
              width={120}
              height={80}
              className="object-fit"
            />
          </Link>
          {/* Hamburger Icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none hover:text-orange-500 transition-colors duration-300"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Links */}
        {isOpen && (
          <div className="flex flex-col mt-2 space-y-2">
            <Link 
              href="/" 
              className="flex gap-2 flex-center py-2 border-b border-gray-200 transition-all duration-300 hover:pl-2 hover:text-orange-500 hover:border-orange-500"
            >
              Home
            </Link>
            <Link 
              href="/Collection" 
              className="flex gap-2 flex-center py-2 border-b border-gray-200 transition-all duration-300 hover:pl-2 hover:text-orange-500 hover:border-orange-500"
            >
              Collection
            </Link>
            <Link 
              href="/exhibitions" 
              className="flex gap-2 flex-center py-2 border-b border-gray-200 transition-all duration-300 hover:pl-2 hover:text-orange-500 hover:border-orange-500"
            >
              Awards & Exhibitions
            </Link>
            <Link 
              href="/contact" 
              className="flex gap-2 flex-center py-2 border-b border-gray-200 transition-all duration-300 hover:pl-2 hover:text-orange-500 hover:border-orange-500"
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="flex gap-2 flex-center mt-2 p-2 bg-orange-500 text-white rounded-md text-center justify-center transition-all duration-300 hover:bg-orange-600"
              >
                Welcome, {formatUsername(username)}!
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="flex gap-2 flex-center mt-2 p-2 bg-orange-500 text-white rounded-md text-center justify-center transition-all duration-300 hover:bg-orange-600"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Nav;

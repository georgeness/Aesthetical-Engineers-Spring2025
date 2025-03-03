"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Nav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Logo / Brand */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex gap-2 flex-center">
          <Image
            src="/images/other/signature.png"
            alt="signature"
            width={150}
            height={80}
            className="object-fit"
          />
        </Link>
        {/* Hamburger Icon */}
        <button
          type="button"
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
        >
          {/* Simple icon - or import any icon library */}
          <svg className="h-6 w-6" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Nav Links */}
      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } mt-4 md:mt-0 md:flex md:items-center`}
      >
        <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 md:inline-block">
          Home
        </Link>
        <Link href="/Collection" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 md:inline-block">
          Collection
        </Link>
        <Link href="/exhibitions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 md:inline-block">
          Awards & Exhibitions
        </Link>
        <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 md:inline-block">
          Contact
        </Link>
        <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 md:inline-block">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Nav;

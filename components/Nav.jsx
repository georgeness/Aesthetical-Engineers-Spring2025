"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Nav = () => {
  // State for toggling the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* -- Desktop Nav */}
      <nav className="hidden md:flex flex-between w-full mb-16 pt-7 px-4">
        <Link href="/" className="flex gap-2 flex-center">
          <Image
            src="/images/other/signature.png"
            alt="signature"
            width={300}
            height={200}
            className="object-fit"
          />
        </Link>
        <Link href="/" className="flex gap-2 flex-center">
          Home
        </Link>
        <Link href="/collection" className="flex gap-2 flex-center">
          Collection
        </Link>
        <Link href="/exhibitions" className="flex gap-2 flex-center">
          Awards & Exhibitions
        </Link>
        <Link href="/contact" className="flex gap-2 flex-center">
          Contact
        </Link>
        <Link href="/login" className="flex gap-2 flex-center">
          Login
        </Link>
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
            className="text-gray-700 focus:outline-none"
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
            <Link href="/" className="flex gap-2 flex-center">
              Home
            </Link>
            <Link href="/Collection" className="flex gap-2 flex-center">
              Collection
            </Link>
            <Link href="/exhibitions" className="flex gap-2 flex-center">
              Awards & Exhibitions
            </Link>
            <Link href="/contact" className="flex gap-2 flex-center">
              Contact
            </Link>
            <Link href="/login" className="flex gap-2 flex-center">
              Login
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Nav;

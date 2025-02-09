// app/components/Nav.jsx
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Nav = () => {
  return (
    <nav className="flex-between w-full mb-16 pt-7">
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
    </nav>
  );
};

export default Nav;

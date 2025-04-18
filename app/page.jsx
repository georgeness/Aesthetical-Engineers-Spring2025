"use client";
import React from "react";
import Link from "next/link";
import { ImageCarousel } from "../components/ImageCarousel.tsx";

/**
 *Full list of images for the carousel
 */
const CAROUSEL = [
  "/images/Matrix 125.jpg",
  "/images/Matrix 127a.jpg",
  "/images/Matrix 128.jpg",
  "/images/Matrix 135.jpg",
  "/images/Matrix 141.jpg",
  "/images/Matrix 143.jpg",
  "/images/Matrix 145.jpg",
  "/images/Matrix 146.jpg",
  "/images/Matrix 148.jpg",
  "/images/Matrix Flag.jpg",
  "/images/Pythagoras 44.jpg",
  "/images/Red Richard.jpg",
];

const HomePage = () => {
  return (
    <main className="w-full flex flex-col items-center justify-center p-3 md:p-6 relative min-h-screen">
      {/* Welcome Section */}
      <section className="w-full flex flex-col items-center text-center relative z-40">
        <div className="px-4 py-2 md:px-6 md:py-4 mb-4 md:mb-8 z-50 relative">
          <h1
            className="
              font-bold
              transition-opacity
              duration-700
              opacity-90
              text-3xl
              sm:text-4xl
              md:text-6xl
              lg:text-7xl
              leading-tight
              max-w-xs
              sm:max-w-lg
              md:max-w-2xl
              mx-auto
              break-words
              z-50
            "
          >
            Welcome
            <br className="hidden sm:block" />
            <span
              className="
                bg-gradient-to-r
                from-orange-500
                to-yellow-400
                bg-clip-text
                text-transparent
                font-extrabold
                text-4xl
                sm:text-5xl
                md:text-7xl
                lg:text-8xl
                leading-tight
                break-words
                block
                align-baseline
                z-50
                drop-shadow
                mb-0
                md:mb-2
              "
            >
              Paintings
            </span>
          </h1>
        </div>

        {/* Image Carousel */}
        <div className="w-full max-w-4xl mt-2 md:mt-4 animate-fadeIn px-0 sm:px-6 relative z-30">
          <ImageCarousel imageUrls={CAROUSEL} />
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 mt-3 md:mt-6 relative z-40">
          <Link href="/about">
            <button
              className="
                px-6
                py-2
                md:px-8
                md:py-3
                bg-gradient-to-r
                from-orange-500
                to-yellow-500
                text-white
                font-semibold
                rounded-full
                shadow-xl
                transition-transform
                hover:scale-105
                hover:shadow-2xl
                w-full
                sm:w-auto
              "
            >
              About Me
            </button>
          </Link>
          
          <Link href="/museum">
            <button
              className="
                px-6
                py-2
                md:px-8
                md:py-3
                bg-gradient-to-r
                from-purple-500
                to-indigo-600
                text-white
                font-semibold
                rounded-full
                shadow-xl
                transition-transform
                hover:scale-105
                hover:shadow-2xl
                w-full
                sm:w-auto
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <span>Interactive Museum</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        </div>
      </section>

      {/* Social Media Links at bottom left */}
      <div className="absolute bottom-6 left-6 flex gap-4 z-40">
        <Link 
          href="https://www.facebook.com/profile.php?id=100052005893530"
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
          </svg>
        </Link>
        <Link 
          href="#"
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#E1306C">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </Link>
      </div>
    </main>
  );
};

export default HomePage;

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
    <main className="w-full flex flex-col items-center justify-center p-3 md:p-6">
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
                md:mb-[-60px]
                pb-3
                overflow-visible
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
    </main>
  );
};

export default HomePage;

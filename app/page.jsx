"use client";
import React from "react";
import Link from "next/link";
import { ImageCarousel } from "../components/ImageCarousel.tsx";

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
    <main className="w-full flex flex-col items-center justify-center p-6">
      {/* Welcome Section */}
      <section className="w-full flex flex-col items-center text-center">
        <h1 className="mt-2 text-5xl font-bold transition-opacity duration-700 opacity-90">
          Welcome
          <br className="max-md:hidden" />
          <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent text-6xl md:text-7xl font-extrabold">
            Paintings
          </span>
        </h1>

        {/* Image Carousel */}
        <div className="w-full max-w-4xl mt-6 animate-fadeIn">
          <ImageCarousel imageUrls={CAROUSEL} />
        </div>

        {/* About Me Button */}
        <div className="w-full flex justify-center mt-6">
          <Link href="/about">
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
              About Me
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

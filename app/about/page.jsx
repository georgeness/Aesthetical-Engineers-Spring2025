"use client";
import React from "react";
import Link from "next/link";

const About = () => (
  <section className="w-full flex flex-col items-center px-4 py-8 sm:p-10 bg-gray-50">
    <div className="max-w-4xl w-full">
      {/* Responsive heading: smaller on mobile, larger on wider screens */}
      <h1 className="head_text text-center mb-8 text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        The Artist Behind The Canvas
      </h1>

      {/* About content container */}
      <article className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-gray-700 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          My Artistic Journey
        </h2>
        <p className="mb-4">
          At this point, there is no sole reason why I make art. I do it for the enjoyment of
          doing it. However, for many years, one of my quests has been to enhance my own
          awareness of who I am as a human being. My experience is that I have used creating
          art to heighten this awareness.
        </p>
        <p className="mb-4">
          I was born in Brooklyn, New York. I recognized the passion I had for art and the
          making of it at a very young age. Somehow, I knew that I was going to study art and
          identify myself as a visual artist.
        </p>
        <p className="mb-4">
          Four years after graduating from the State University of New York Maritime College
          and going to sea as a Deck Officer on American cargo ships, I left New York and
          drove to Tempe, Arizona to study art at Arizona State University.
        </p>
        <p className="mb-4">
          I have two undergraduate degrees: a BFA in Painting and Drawing from Arizona State
          and a BS in Meteorology and Oceanography from SUNY Maritime College.
        </p>
        <p className="mb-4">
          I live in Florida, and have a studio in West Palm Beach not far from the ocean.
        </p>
        <p className="mb-4">
          My recent work consists of large colorful non-objective pieces, which contain a
          large amount of underpainting. I use simple geometric forms – mostly squares,
          rectangles and at times triangles in their creation.
        </p>
        <p className="mb-4">
          While painting, I mostly concern myself with color balance – and how I move the
          viewer's eye on the canvas. Color value is another element that I concern myself
          with as I paint.
        </p>
        <p className="mb-4">
          My paintings have much to do with the manipulation of space, color and paint. To a
          great extent, my non-objective work is an expression of my present awareness of
          the power of being present.
        </p>
        <p className="mb-4">
          My work is purposely void of representationalism, story or poetry. There is the
          space, the color and the paint.
        </p>
        
        {/* Social Media Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Connect With Me</h3>
          <div className="flex items-center">
            <Link 
              href="https://www.facebook.com/profile.php?id=100052005893530"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
              </svg>
              Visit my Facebook page
            </Link>
          </div>
        </div>
      </article>
    </div>
  </section>
);

export default About;

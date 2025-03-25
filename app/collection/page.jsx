"use client";
import React, { useState } from "react";

const PaintingLibrary = () => {
  // State to control the modal visibility
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample image data
  const paintings = [
    {
      id: 1,
      title: "Matrix 125",
      dimensions: "24x36 inches",
      medium: "Oil on canvas",
      notes: "A vibrant play of colors.",
      price: "$2000",
      image: "/images/Matrix 125.jpg"
    },
    {
      id: 2,
      title: "Matrix 141",
      dimensions: "30x40 inches",
      medium: "Acrylic",
      notes: "Abstract and modern.",
      price: "$2500",
      image: "/images/Matrix 141.jpg"
    },
    {
      id: 3,
      title: "Matrix 127a",
      dimensions: "20x30 inches",
      medium: "Mixed Media",
      notes: "Intriguing abstract work.",
      price: "$2200",
      image: "/images/Matrix 127a.jpg"
    },
    {
      id: 4,
      title: "Matrix 128",
      dimensions: "18x24 inches",
      medium: "Oil on canvas",
      notes: "Bold and colorful composition.",
      price: "$1800",
      image: "/images/Matrix 128.jpg"
    },
    {
      id: 5,
      title: "Matrix 135",
      dimensions: "36x48 inches",
      medium: "Acrylic",
      notes: "Large scale abstract work.",
      price: "$3000",
      image: "/images/Matrix 135.jpg"
    },
    {
      id: 6,
      title: "Matrix 143",
      dimensions: "24x36 inches",
      medium: "Oil",
      notes: "Deep emotions captured on canvas.",
      price: "$2500",
      image: "/images/Matrix 143.jpg"
    },
    {
      id: 7,
      title: "Matrix 145",
      dimensions: "30x40 inches",
      medium: "Acrylic",
      notes: "Vibrant brush strokes create an energetic feel.",
      price: "$2700",
      image: "/images/Matrix 145.jpg"
    },
    {
      id: 8,
      title: "Matrix 146",
      dimensions: "20x30 inches",
      medium: "Watercolor",
      notes: "Subtle hues and gentle textures.",
      price: "$2100",
      image: "/images/Matrix 146.jpg"
    },
    {
      id: 9,
      title: "Matrix 148",
      dimensions: "24x36 inches",
      medium: "Oil on canvas",
      notes: "Intricate details and rich textures.",
      price: "$2600",
      image: "/images/Matrix 148.jpg"
    },
    {
      id: 10,
      title: "Matrix Flag",
      dimensions: "18x24 inches",
      medium: "Acrylic",
      notes: "An iconic symbol reinterpreted in art.",
      price: "$2300",
      image: "/images/Matrix Flag.jpg"
    },
    {
      id: 11,
      title: "Pythagoras 44",
      dimensions: "30x30 inches",
      medium: "Mixed Media",
      notes: "Mathematical beauty meets artistic expression.",
      price: "$2900",
      image: "/images/Pythagoras 44.jpg"
    },
    {
      id: 12,
      title: "Red Richard",
      dimensions: "36x48 inches",
      medium: "Oil",
      notes: "Striking composition with bold colors.",
      price: "$3200",
      image: "/images/Red Richard.jpg"
    },
  ];

  // Function to open modal with selected painting
  const openModal = (index) => {
    setCurrentIndex(index);
    setSelectedPainting(paintings[index]);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedPainting(null);
  };

  // Function to navigate to previous painting
  const prevPainting = () => {
    const newIndex = currentIndex === 0 ? paintings.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedPainting(paintings[newIndex]);
  };

  // Function to navigate to next painting
  const nextPainting = () => {
    const newIndex = currentIndex === paintings.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedPainting(paintings[newIndex]);
  };

  return (
    <section className="w-full flex flex-col items-center py-4">
      <h1 className="head_text text-center">Painting Library</h1>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-9 w-full px-4">
        {paintings.map((painting, index) => (
          <div
            key={painting.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300"
          >
            <img
              src={painting.image}
              alt={painting.title}
              className="w-full h-auto mb-4 rounded cursor-pointer transform hover:scale-105 transition duration-300"
              onClick={() => openModal(index)}
            />
            <h2 className="text-lg md:text-xl font-bold mb-2">{painting.title}</h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Dimensions:</strong> {painting.dimensions}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Medium:</strong> {painting.medium}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Notes:</strong> {painting.notes}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              <strong>Price:</strong> {painting.price}
            </p>
          </div>
        ))}
      </div>

      {/* Modal (Popup View) */}
      {selectedPainting && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50 px-4">
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            <div className="relative">
              {/* Previous Arrow */}
              <button
                onClick={prevPainting}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-700 to-gray-900 text-white p-3 rounded-full hover:scale-110 transition duration-300 shadow-lg"
              >
                &#9664;
              </button>

              {/* Next Arrow */}
              <button
                onClick={nextPainting}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-700 to-gray-900 text-white p-3 rounded-full hover:scale-110 transition duration-300 shadow-lg"
              >
                &#9654;
              </button>

              <img
                src={selectedPainting.image}
                alt={selectedPainting.title}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Painting Details */}
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold mb-2">{selectedPainting.title}</h2>
              <p className="text-base text-gray-600">
                <strong>Dimensions:</strong> {selectedPainting.dimensions}
              </p>
              <p className="text-base text-gray-600">
                <strong>Medium:</strong> {selectedPainting.medium}
              </p>
              <p className="text-base text-gray-600">
                <strong>Notes:</strong> {selectedPainting.notes}
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-2">
                <strong>Price:</strong> {selectedPainting.price}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaintingLibrary;

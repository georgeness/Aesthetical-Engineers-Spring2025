"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import "../components/image-carousel.css";

type ImageCarouselProps = {
  imageUrls: string[];
};

export function ImageCarousel({ imageUrls }: ImageCarouselProps) {
  const [imageIndex, setImageIndex] = useState(0);

  function showNextImage() {
    setImageIndex((index) =>
      index === imageUrls.length - 1 ? 0 : index + 1
    );
  }

  function showPrevImage() {
    setImageIndex((index) =>
      index === 0 ? imageUrls.length - 1 : index - 1
    );
  }

  return (
    <div className="carousel-container">
      {/* Left Button */}
      <button onClick={showPrevImage} className="img-carousel-btn left">
        <ArrowBigLeft />
      </button>

      {/* Image Display */}
      <div className="carousel-image-wrapper">
        <Image
          src={imageUrls[imageIndex]}
          alt="Painting"
          className="img-carousel-img object-contain"
          width={1200}
          height={800}
          sizes="(max-width: 640px) 100vw,
                 (max-width: 1024px) 50vw,
                 33vw"
          priority={true}
        />
      </div>

      {/* Right Button */}
      <button onClick={showNextImage} className="img-carousel-btn right">
        <ArrowBigRight />
      </button>
    </div>
  );
}

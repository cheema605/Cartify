"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Carousel({ images, autoPlay = true, autoPlayTime = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayTime);
    }

    return () => {
      resetTimeout();
    };
  }, [currentIndex, autoPlay, autoPlayTime, images.length]);

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-2xl">
      <div
        className="flex transition-transform ease-in-out duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="flex-shrink-0 w-full h-[500px] flex items-center justify-center bg-gray-900">
            <img
              src={img.url}
              alt={img.alt || `Slide ${index + 1}`}
              className="w-full h-full object-contain"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/75 transition-all duration-300"
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/75 transition-all duration-300"
        aria-label="Next Slide"
      >
        &#10095;
      </button>
    </div>
  );
}

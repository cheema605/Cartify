"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Carousel from "../components/ui/carousel";
import AnimatedCounter from "../components/ui/animatedCounter";

const heroAnimation = (
  <svg
    className="w-48 h-48 mx-auto mb-6 animate-spin-slow"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="white"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      strokeWidth="4"
      stroke="currentColor"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

const trendingDealsImages = [
  { url: "https://images.unsplash.com/photo-1512499617640-c2f99912a0f1?auto=format&fit=crop&w=800&q=80", alt: "Wireless Headphones" },
  { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", alt: "Smartwatch Series 7" },
  { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", alt: "Gaming Laptop" },
  { url: "https://images.unsplash.com/photo-1496180727794-817822f65950?auto=format&fit=crop&w=800&q=80", alt: "Bluetooth Speaker" },
];

const sections = [
  {
    id: 1,
    className: "relative flex flex-col lg:flex-row items-center justify-center text-white h-screen px-8 md:px-16 bg-gradient-to-r from-[#157a94] via-[#0e5a6d] to-[#0a4a56] font-[Inter]",
    content: (router) => (
      <div className="w-full flex flex-col">
        {/* Main Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto flex-1 pt-24">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-md leading-tight">
              Discover a New Way to Buy and Sell
            </h1>
            <p className="text-lg md:text-xl mt-4 drop-shadow-md leading-relaxed">
              At Cartify, we empower you to easily buy, sell, and rent a variety of items. Join our community and experience seamless transactions that fit your lifestyle.
            </p>
            <div className="mt-6 flex gap-4 justify-center lg:justify-start">
              <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition" onClick={() => router.push("/signup")}>
                Get Started
              </button>
              <button className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition">
                Learn More
              </button>
            </div>
          </div>
          {/* Right Animated SVG */}
          <div className="lg:w-1/2 flex justify-center items-center">
            {heroAnimation}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    className: "min-h-screen bg-white flex flex-col items-center py-12 font-serif",
    content: (
      <div className="w-full max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-wide text-center">
          🔥 Trending Deals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { id: 1, title: "Wireless Headphones", price: "$59.99", image: "https://images.unsplash.com/photo-1512499617640-c2f99912a0f1?auto=format&fit=crop&w=800&q=80" },
            { id: 2, title: "Smartwatch Series 7", price: "$199.99", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
            { id: 3, title: "Gaming Laptop", price: "$999.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
            { id: 4, title: "Bluetooth Speaker", price: "$39.99", image: "https://images.unsplash.com/photo-1496180727794-817822f65950?auto=format&fit=crop&w=800&q=80" },
          ].map((deal) => (
            <div key={deal.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center">
              <img src={deal.image} alt={deal.title} className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
              <p className="text-md font-medium text-gray-700 mt-2">{deal.price}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    className: "h-screen bg-gradient-to-r from-[#0a4a56] via-[#0e5a6d] to-[#157a94] text-white flex justify-center items-center font-serif",
    content: (
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <AnimatedCounter end={1500} suffix="+" />
            <p className="mt-2 text-lg font-semibold">Products Sold</p>
          </div>
          <div>
            <AnimatedCounter end={1200} suffix="+" />
            <p className="mt-2 text-lg font-semibold">Happy Customers</p>
          </div>
          <div>
            <AnimatedCounter end={500} suffix="+" />
            <p className="mt-2 text-lg font-semibold">Stores Joined</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    className: "min-h-screen flex flex-col items-center font-serif",
    content: (
      <div className="w-full flex flex-col items-center">
        {/* Upper Half - White Background */}
        <div className="w-full min-h-[50vh] bg-white"></div>
        {/* Lower Half - Teal Background */}
        <div className="w-full bg-[#0e5a6d] text-white py-12 text-center shadow-md">
          <h2 className="text-3xl font-extrabold tracking-wide">Contact Us</h2>
          <p className="text-lg mt-2">Have any questions? Reach out to us via email or phone.</p>
          {/* Contact Details */}
          <p className="text-xl font-semibold mt-4">✉️ Email: cartifystores@gmail.com</p>
          <p className="text-xl font-semibold mt-2">📞 Phone: +123 456 7890</p>
          <p className="text-lg mt-4 italic">Available: Mon - Fri, 9 AM - 6 PM</p>
          {/* Footer */}
          <p className="mt-8 text-sm opacity-80">© 2025 Cartify Pvt. Ltd. All Rights Reserved.</p>
        </div>
      </div>
    ),
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const scrollToSection = (index) => {
    if (index >= 0 && index < sections.length) {
      document
        .getElementById(`section-${index}`)
        .scrollIntoView({ behavior: "smooth" });
      setCurrentSection(index);
    }
  };

  // Handles mouse scroll (desktop)
  const handleScroll = useCallback(
    (event) => {
      if (isScrolling.current) return;
      isScrolling.current = true;

      if (event.deltaY > 0) {
        scrollToSection(currentSection + 1);
      } else if (event.deltaY < 0) {
        scrollToSection(currentSection - 1);
      }

      setTimeout(() => (isScrolling.current = false), 800);
    },
    [currentSection]
  );

  // Handles touch swipe (mobile)
  const handleTouchStart = (event) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event) => {
    touchEndY.current = event.changedTouches[0].clientY;
    const swipeDistance = touchStartY.current - touchEndY.current;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        scrollToSection(currentSection + 1); // Swipe up → Scroll down
      } else {
        scrollToSection(currentSection - 1); // Swipe down → Scroll up
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") scrollToSection(currentSection + 1);
      else if (event.key === "ArrowUp") scrollToSection(currentSection - 1);
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleScroll]);

  return (
    <div className="w-full h-screen overflow-hidden">
      {sections.map((section, index) => (
        <div key={section.id} id={`section-${index}`} className={`w-full min-h-screen ${section.className}`}>
          {typeof section.content === "function" ? section.content(router) : section.content}
        </div>
      ))}
    </div>
  );
}

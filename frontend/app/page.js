"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    id: 1,
    className: "relative flex flex-col lg:flex-row items-center justify-center text-white h-screen px-8 md:px-16 bg-[#157a94] font-[Inter]", // Updated font
    content: () => (
      <div className="w-full flex flex-col">
        
        {/* Fixed Top Task Bar */}
        <div className="fixed top-0 left-0 w-full flex items-center justify-between px-8 md:px-16 py-4 bg-[#106b82] shadow-md z-50">
          <span className="text-2xl font-bold italic tracking-wide">Cartify</span>
          <nav className="hidden md:flex gap-6 text-lg font-medium">
            <a href="#" className="hover:text-gray-300 transition">Home</a>
            <a href="#" className="hover:text-gray-300 transition">Shop</a>
            <a href="#" className="hover:text-gray-300 transition">Rent</a>
            <a href="#" className="hover:text-gray-300 transition">More</a>
          </nav>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-black transition font-medium">
              Help
            </button>
            <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium">
              Login
            </button>
          </div>
        </div>
  
        {/* Main Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto flex-1 pt-24"> {/* Adjusted padding for navbar */}
          
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-md leading-tight">
              Discover a New Way to Buy and Sell
            </h1>
            <p className="text-lg md:text-xl mt-4 drop-shadow-md leading-relaxed">
              At Cartify, we empower you to easily buy, sell, and rent a variety of items. Join our community and experience seamless transactions that fit your lifestyle.
            </p>
            <div className="mt-6 flex gap-4 justify-center lg:justify-start">
              <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
                Get Started
              </button>
              <button className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition">
                Learn More
              </button>
            </div>
          </div>
  
          {/* Right Image Grid */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 mt-4 lg:mt-0">
  {/* First Row - Offset Left & Right */}
  <div className="-mt-2">
    <img src="../images/image1.jpg" alt="Shopping" className="rounded-lg shadow-lg w-full h-auto object-cover" />
  </div>
  <div className="mt-2">
    <img src="../images/image2.jpg" alt="Women discussing" className="rounded-lg shadow-lg w-full h-auto object-cover" />
  </div>
  </div>
  <div className="lg:w-1/2 grid grid-cols-2 gap-4 mt-4 lg:mt-0">
  {/* Second Row - Offset Opposite Direction */}
  <div className="mt-2">
    <img src="../images/image3.jpg" alt="Businesswoman" className="rounded-lg shadow-lg w-full h-auto object-cover" />
  </div>
  <div className="-mt-4">
    <img src="../images/image4.jpg" alt="Group discussion" className="rounded-lg shadow-lg w-full h-auto object-cover" />
  </div>
</div>



  
        </div>
  
      </div>
    ),
  },
  {
    id: 2,
    className: "min-h-screen bg-white flex flex-col items-center py-12 font-serif",
    content: (
      <div className="w-11/12 max-w-6xl mt-35"> {/* Added mt-12 for spacing */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-wide">
          🔥 Trending Deals
        </h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 1, title: "Wireless Headphones", price: "$59.99", image: "../images/deal1.jpg" },
            { id: 2, title: "Smartwatch Series 7", price: "$199.99", image: "../images/deal2.jpg" },
            { id: 3, title: "Gaming Laptop", price: "$999.99", image: "../images/deal3.jpg" },
            { id: 4, title: "Bluetooth Speaker", price: "$39.99", image: "../images/deal4.jpg" },
          ].map((deal) => (
            <div
              key={deal.id}
              className="bg-gray-100 rounded-lg p-4 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 tracking-wide">{deal.title}</h3>
              <p className="text-lg text-gray-600 italic">{deal.price}</p>
              <button className="mt-4 px-5 py-2 bg-[#157a94] text-white font-bold rounded-lg hover:bg-[#106b82] transition shadow-md">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    ),
  }  ,
  {
    id: 3,
    className: "min-h-screen flex flex-col items-center font-serif",
    content: (
      <div className="w-full flex flex-col items-center">
        
        {/* Upper Half - White Background */}
        <div className="w-full min-h-[50vh] bg-white"></div>

  
        {/* Lower Half - Teal Background */}
        <div className="w-full bg-[#0e5a6d] text-white py-12 text-center shadow-md">
          <h2 className="text-3xl font-extrabold tracking-wide">📞 Contact Us</h2>
          <p className="text-lg mt-2">Have any questions? Reach out to us via email or phone.</p>
  
          {/* Contact Details */}
          <p className="text-xl font-semibold mt-4">✉️ Email: support@example.com</p>
          <p className="text-xl font-semibold mt-2">📞 Phone: +123 456 7890</p>
          <p className="text-lg mt-4 italic">Available: Mon - Fri, 9 AM - 6 PM</p>
  
          {/* Footer */}
          <p className="mt-8 text-sm opacity-80">© 2025 YourCompany. All Rights Reserved.</p>
        </div>
      </div>
    ),
  }
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

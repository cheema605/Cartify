"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    id: 1,
    className:
      "relative flex items-center justify-center text-center h-screen bg-[repeating-linear-gradient(90deg, black 0%, black 10%, white 10%, white 20%)]",
    content: (router) => (
      <div className="w-full h-full flex flex-col">
        {/* Top-right buttons */}
        <div className="absolute top-5 right-5 flex gap-4">
          <button
            className="px-6 py-2 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition"
            onClick={() => router.push("login")}
          >
            Login
          </button>
          <button
            className="px-6 py-2 bg-white text-black font-bold rounded-full shadow-md hover:bg-gray-200 transition"
            onClick={() => router.push("signup")}
          >
            Signup
          </button>
        </div>

        {/* Centered Content */}
        <div className="flex flex-1 items-center justify-center flex-col">
          {/* CSS Shopping Bag Logo */}
          <div className="relative flex items-center justify-center mb-4">
            {/* Bag Body */}
            <div className="w-16 h-16 bg-white rounded-b-lg shadow-lg relative"></div>

            {/* Bag Handles */}
            <div className="absolute -top-4 flex gap-6">
              <div className="w-4 h-6 border-4 border-white rounded-full"></div>
              <div className="w-4 h-6 border-4 border-white rounded-full"></div>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-6xl font-extrabold text-white drop-shadow-md">
            WELCOME TO CARTIFY
          </h1>
          <p className="text-2xl font-bold italic text-white drop-shadow-md mt-4">
            Your one-stop shop
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    className: "bg-teal-500 text-white flex flex-col items-center justify-center text-center p-10",
    content: (
      <>
        <h1 className="text-4xl font-bold">Welcome to Cartify!</h1>
        <p className="text-lg mt-4">
          Your go-to platform for buying and selling with ease.
        </p>
      </>
    ),
  },
  {
    id: 3,
    className: "bg-purple-400 text-white flex flex-col items-center justify-center text-center p-10",
    content: (
      <>
        <h1 className="text-3xl font-semibold">About Us</h1>
        <p className="text-lg mt-4 max-w-2xl">
          Cartify is a marketplace designed to bring buyers and sellers together effortlessly.
        </p>
      </>
    ),
  },
  {
    id: 4,
    className: "bg-[#FF7F50]  text-white flex flex-col items-center justify-center text-center p-10",
    content: (
      <>
        <h1 className="text-3xl font-semibold">Why Choose Cartify?</h1>
        <ul className="mt-4 text-lg">
          <li>✔ Seamless transactions</li>
          <li>✔ Secure and reliable platform</li>
          <li>✔ User-friendly interface</li>
        </ul>
      </>
    ),
  },
  {
    id: 5,
    className: "bg-[#00CED1]   text-white flex flex-col items-center justify-center text-center p-10",
    content: (
      <>
        <h1 className="text-3xl font-semibold">Get Started Today!</h1>
        <p className="text-lg mt-4">
          Join thousands of users already benefiting from Cartify.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md">
          Sign Up Now
        </button>
      </>
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

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { id: 1, content: "Welcome to Cartify!", image: "/images/Cartifylogo.png" },
  { id: 2, content: "Shop and Sell with Ease!" },
  { id: 3, content: "Join Us Today!", button: true }
];

export default function LogoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {slides[currentSlide].image && (
            <img
              src={slides[currentSlide].image}
              alt="Cartify Logo"
              className="w-48 h-48 mx-auto"
            />
          )}
          <p className="text-white text-xl font-semibold mt-4">
            {slides[currentSlide].content}
          </p>
          {slides[currentSlide].button && (
            <button
              className="mt-4 px-6 py-2 bg-white text-blue-500 rounded-lg shadow-lg"
              onClick={() => router.push("/signup")}
            >
              Get Started
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import AnimatedCounter from "../components/ui/animatedCounter";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSVG = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-md mx-auto">
    <ellipse cx="200" cy="250" rx="180" ry="30" fill="#0a192f" fillOpacity="0.3" />
    <rect x="120" y="80" width="160" height="100" rx="20" fill="#1e293b" />
    <rect x="140" y="100" width="120" height="60" rx="12" fill="#2563eb" />
    <circle cx="200" cy="130" r="18" fill="#fff" />
    <rect x="170" y="160" width="60" height="10" rx="5" fill="#fff" fillOpacity="0.7" />
    <rect x="150" y="180" width="100" height="8" rx="4" fill="#fff" fillOpacity="0.3" />
  </svg>
);

const sections = [
  {
    id: 1,
    className: "relative min-h-screen bg-gradient-to-br from-[#0a192f] via-[#2563eb] to-black overflow-hidden flex items-center justify-center",
    content: (router) => (
      <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center min-h-screen px-8 md:px-16 pt-24 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 text-center lg:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
              Welcome to Cartify
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-600">
              The Modern Marketplace
            </span>
          </h1>
          <p className="text-lg md:text-xl mt-6 text-white/90 leading-relaxed">
            Buy, sell, and discover amazing products in a seamless, secure, and modern shopping experience.
          </p>
          <div className="mt-8 flex gap-4 justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-black text-white font-semibold rounded-full hover:opacity-90 transition shadow-lg"
              onClick={() => router.push("/signup")}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 flex justify-center items-center mt-12 lg:mt-0"
        >
          <HeroSVG />
        </motion.div>
      </div>
    ),
  },
  {
    id: 2,
    className: "min-h-screen bg-gradient-to-br from-[#0a192f] to-[#1e293b] py-20",
    content: (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Discover our handpicked selection of trending items
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              id: 1,
              title: "Premium Headphones",
              price: "Rs2999.99",
              image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
              category: "Electronics"
            },
            {
              id: 2,
              title: "Smart Watch Pro",
              price: "Rs3999.99",
              image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
              category: "Wearables"
            },
            {
              id: 3,
              title: "Wireless Earbuds",
              price: "Rs1598.99",
              image: "/images/OIP.jpeg",
              category: "Audio"
            },
            {
              id: 4,
              title: "Smart Speaker",
              price: "Rs1299.99",
              image: "https://images.unsplash.com/photo-1496180727794-817822f65950?auto=format&fit=crop&w=800&q=80",
              category: "Smart Home"
            }
          ].map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-[#1e293b] rounded-2xl shadow-xl overflow-hidden border border-blue-900"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-blue-200">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">{product.title}</h3>
                <p className="mt-2 text-2xl font-bold text-blue-400">{product.price}</p>
                <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-black text-white py-2 rounded-full hover:opacity-90 transition">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    className: "min-h-screen bg-gradient-to-br from-[#0a192f] via-[#2563eb] to-black py-20",
    content: (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Why Choose Cartify?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Experience the future of shopping with our innovative features
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🚀",
              title: "Lightning Fast",
              description: "Experience instant checkout and quick delivery"
            },
            {
              icon: "🔒",
              title: "Secure Shopping",
              description: "Your data is protected with enterprise-grade security"
            },
            {
              icon: "💎",
              title: "Premium Quality",
              description: "Curated products from trusted sellers"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-blue-900"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <AnimatedCounter end={1500} suffix="+" />
            <p className="mt-2 text-xl font-semibold text-white">Products Sold</p>
          </div>
          <div>
            <AnimatedCounter end={1200} suffix="+" />
            <p className="mt-2 text-xl font-semibold text-white">Happy Customers</p>
          </div>
          <div>
            <AnimatedCounter end={500} suffix="+" />
            <p className="mt-2 text-xl font-semibold text-white">Stores Joined</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    className: "min-h-screen bg-gradient-to-br from-black to-[#0a192f] py-20",
    content: (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Have questions? We're here to help!
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-blue-900"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
            <div className="space-y-4">
              <p className="flex items-center text-blue-100">
                <span className="text-2xl mr-3">✉️</span>
                cartifystores@gmail.com
              </p>
              <p className="flex items-center text-blue-100">
                <span className="text-2xl mr-3">📞</span>
                +123 456 7890
              </p>
              <p className="flex items-center text-blue-100">
                <span className="text-2xl mr-3">🕒</span>
                Mon - Fri, 9 AM - 6 PM
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-blue-900"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Newsletter</h3>
            <p className="text-blue-100 mb-6">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-black text-white rounded-lg hover:opacity-90 transition">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-blue-100"
        >
          <p>© 2025 Cartify Pvt. Ltd. All Rights Reserved.</p>
        </motion.div>
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
  const [cartOpen, setCartOpen] = useState(false);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

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
        scrollToSection(currentSection + 1);
      } else {
        scrollToSection(currentSection - 1);
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
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar cartOpen={cartOpen} toggleCart={toggleCart} />
      </div>
      {sections.map((section, index) => (
        <div key={section.id} id={`section-${index}`} className={`w-full min-h-screen ${section.className}`}>
          {typeof section.content === "function" ? section.content(router) : section.content}
        </div>
      ))}
    </div>
  );
}

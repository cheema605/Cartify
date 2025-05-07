"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import Logo from "./Logo";

export default function Navbar({ cartOpen, toggleCart }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isExplorePage = pathname === "/explore";
  const isWishlistPage = pathname === "/wishlist";

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-8 md:px-16 py-4 bg-[#106b82] shadow-md z-50">
        <div className="flex items-center gap-4">
          <div onClick={() => router.push("/")} className="cursor-pointer">
            <Logo />
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-lg font-medium">
          <a href="#" className="hover:text-gray-300 transition">Home</a>
          <a href="#" className="hover:text-gray-300 transition">Shop</a>
          <a href="#" className="hover:text-gray-300 transition">Rent</a>
          <a href="#" className="hover:text-gray-300 transition">More</a>
        </nav>
        <div className="flex gap-4 items-center">
          {!isExplorePage && !isWishlistPage && (
            <button className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-black transition font-medium" >
              Help
            </button>
          )}
          {!isLoginPage && !isSignupPage && !isExplorePage && !isWishlistPage && (
            <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium" onClick={() => router.push("/login")}>
              Login
            </button>
          )}
          {isLoginPage && (
            <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium" onClick={() => router.push("/signup")}>
              Sign Up
            </button>
          )}
          {isSignupPage && (
            <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium" onClick={() => router.push("/login")}>
              Login
            </button>
          )}
          {isExplorePage && (
            <>
              <div className="relative w-4/6 mr-30">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full py-2 px-4 rounded-lg focus:outline-none"
                />
              </div>
              <button
                onClick={toggleCart}
                aria-label="Toggle cart"
                className="fixed top-4 right-6 px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition font-semibold flex items-center shadow-lg z-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-12.83-2.25l1.72-7.5h11.22l1.72 7.5H4.17zM6 6h12l-1-4H7L6 6z" />
                </svg>
              </button>
              <button
                onClick={() => router.push("/wishlist")}
                aria-label="Wishlist"
                className="fixed top-4 right-28 px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition font-semibold flex items-center shadow-lg z-50"
              >
                <Heart className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

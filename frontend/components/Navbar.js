"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { X, Heart, Menu, Search, ShoppingCart, LayoutDashboard } from "lucide-react";
import Logo from "./Logo";
import DashboardToggle from "./DashboardToggle";

export default function Navbar({ cartOpen, toggleCart }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toggleChecked, setToggleChecked] = useState(false);

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isExplorePage = pathname === "/explore";
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isWishlistPage = pathname === "/wishlist";

  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[98vw] max-w-7xl rounded-2xl bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-between px-8 py-3 transition-all duration-500 animate-fadeInDown">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <div onClick={() => router.push("/")} className="cursor-pointer">
          <Logo />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <a href="/" className="text-base font-medium text-white hover:text-teal-300 transition-colors duration-200">Home</a>
        <a href="/explore" className="text-base font-medium text-white hover:text-teal-300 transition-colors duration-200">Shop</a>
        <a href="#" className="text-base font-medium text-white hover:text-teal-300 transition-colors duration-200">Rent</a>
        <a href="#" className="text-base font-medium text-white hover:text-teal-300 transition-colors duration-200">More</a>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-48 px-4 py-1.5 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
          <Search className="absolute right-3 top-2 h-4 w-4 text-white/70" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Dashboard Toggle: only show on main pages, not on dashboard */}
        {!isDashboardPage && (
          <DashboardToggle
            checked={toggleChecked}
            onToggle={(checked) => {
              setToggleChecked(checked);
              if (checked) {
                setTimeout(() => router.push("/dashboard"), 350);
              }
            }}
          />
        )}
        {!isExplorePage && !isWishlistPage && (
          <button className="px-3 py-1.5 rounded-lg text-base font-medium text-white hover:bg-teal-500/30 transition-colors duration-200">
            Help
          </button>
        )}
        <button
          onClick={() => router.push("/wishlist")}
          className="p-2 rounded-full hover:bg-teal-500/30 transition-colors duration-200"
        >
          <Heart className="h-5 w-5 text-white" />
        </button>
        <button
          onClick={toggleCart}
          className="p-2 rounded-full hover:bg-teal-500/30 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        {!isLoginPage && !isSignupPage && !isExplorePage && !isWishlistPage && (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-base font-medium shadow-md"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-white hover:bg-teal-500/30"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black/90 backdrop-blur-md rounded-b-2xl shadow-lg py-4 px-6 flex flex-col space-y-3 animate-fadeInDown">
          <a href="/" className="text-base font-medium text-white hover:text-teal-300 transition">Home</a>
          <a href="/explore" className="text-base font-medium text-white hover:text-teal-300 transition">Shop</a>
          <a href="#" className="text-base font-medium text-white hover:text-teal-300 transition">Rent</a>
          <a href="#" className="text-base font-medium text-white hover:text-teal-300 transition">More</a>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={() => router.push("/login")}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-base font-medium mt-2"
          >
            Login
          </button>
        </div>
      )}
      <style jsx global>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </nav>
  );
}

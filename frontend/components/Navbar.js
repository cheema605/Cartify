"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { X, Heart, Menu, Search, ShoppingCart, LayoutDashboard } from "lucide-react";
import Logo from "./Logo";
import DashboardToggle from "./DashboardToggle";

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
}

import { useEffect } from "react";

export default function Navbar({ cartOpen, toggleCart }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toggleChecked, setToggleChecked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  // Fetch cart items when cart dropdown is opened
  useEffect(() => {
    if (cartDropdownOpen) {
      const fetchCartItems = async () => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          setCartItems([]);
          return;
        }
        try {
          const response = await fetch("http://localhost:5000/api/shopping-cart/get-cart/current", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Failed to fetch cart items:", error);
          setCartItems([]);
        }
      };
      fetchCartItems();
    }
  }, [cartDropdownOpen]);

  const toggleCartDropdown = () => {
    setCartDropdownOpen(!cartDropdownOpen);
  };

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isExplorePage = pathname === "/explore";
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isWishlistPage = pathname === "/wishlist";
  const isHomePage = pathname === "/";

  // Decode JWT token to get user name or ID
  let userName = null;
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
  if (token) {
    try {
      const decoded = parseJwt(token);
      userName = decoded?.name || decoded?.username || decoded?.user_name || decoded?.sub || null;
    } catch (err) {
      console.error("Failed to decode JWT token", err);
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleSearchIconClick = () => {
    if (searchInput.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav className="fixed top-6 inset-x-0 z-60 w-[98vw] max-w-7xl mx-auto rounded-2xl bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-between px-8 py-3 transition-all duration-500 animate-fadeInDown">
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
            className="w-48 px-4 py-1.5 rounded-full bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchKeyDown}
          />
          <Search
            className="absolute right-3 top-2 h-4 w-4 text-gray-500 cursor-pointer"
            onClick={handleSearchIconClick}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <DashboardToggle
          checked={toggleChecked}
          onToggle={(checked) => {
            setToggleChecked(checked);
            if (checked) {
              setTimeout(() => router.push("/dashboard"), 350);
            }
          }}
        />
        {!isExplorePage && !isWishlistPage && (
          <button
            onClick={() => router.push("/help")}
            className="px-3 py-1.5 rounded-lg text-base font-medium text-white hover:bg-teal-500/30 transition-colors duration-200"
          >
            Help
          </button>
        )}
        {!isHomePage && (
          <>
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
          </>
        )}
        {!isLoginPage && !isSignupPage && (
          <>
            {userName ? (
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-full hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-colors font-semibold shadow-lg transform hover:scale-105 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen ? "true" : "false"}
                >
                  {userName[0].toUpperCase()}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        router.push("/myorders");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Orders
                    </button>
                    <button
                      onClick={() => router.push("/rental-orders")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Rental Orders
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("jwt_token");
                        router.push("/login");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-base font-medium shadow-md"
              >
                Login
              </button>
            )}
          </>
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
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchKeyDown}
          />
          <button
            onClick={() => {
              if (searchInput.trim() !== "") {
                router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
                setSearchInput("");
                setIsMobileMenuOpen(false);
              }
            }}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-base font-medium mt-2"
          >
            Search
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

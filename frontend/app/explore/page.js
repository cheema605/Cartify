"use client";

import React, { useState, useEffect, useMemo } from "react";
import Carousel from "../../components/ui/carousel";
import axios from "axios";
import { useRouter } from "next/navigation";

const sampleCategories = [
  { id: 1, name: "Electronics", icon: "📱" },
  { id: 2, name: "Fashion", icon: "👗" },
  { id: 3, name: "Home", icon: "🏠" },
  { id: 4, name: "Sports", icon: "⚽" },
  { id: 5, name: "Toys", icon: "🧸" },
  { id: 6, name: "Books", icon: "📚" },
  { id: 7, name: "Beauty", icon: "💄" },
];

// Carousel images as placeholders
const carouselImages = [
  { url: "/images/deal1.jpg", alt: "Deal 1" },
  { url: "/images/deal2.jpg", alt: "Deal 2" },
  { url: "/images/deal3.jpg", alt: "Deal 3" },
  { url: "/images/deal4.jpg", alt: "Deal 4" },
];

const ExplorePage = () => {
    const router = useRouter();
  const [mode, setMode] = useState("products"); // Default mode is "products"
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const token = localStorage.getItem("jwt_token"); // Get the JWT token from localStorage

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        // Fetch the product suggestions from the API
        const response = await axios.get('http://localhost:5000/api/explore', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        
        setProductData(response.data);
        setLoading(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.warn("Unauthorized. Redirecting to login...");
          router.push("/login"); // 🔁 Redirect using Next.js
        }
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const filteredItems = useMemo(() => {
    let items = [];

    if (mode === "products") {
      items = productData.flatMap((category) =>
        category.product_suggestions.map((product) => ({
          ...product,
          rating: 0, // Default rating if not provided
        }))
      );
    }

    if (selectedCategory) {
      items = items.filter((item) => item.category_id === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortOption) {
      case "price-asc":
        items = items.slice().sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items = items.slice().sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        items = items.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        items = items.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return items;
  }, [mode, searchQuery, sortOption, selectedCategory, productData]);

  return (
    <div className="min-h-screen w-full bg-gray-100 relative pt-20">
      {/* Carousel Slideshow */}
      <div className="container mx-auto mt-4">
        <Carousel images={carouselImages} autoPlay={true} autoPlayTime={4000} />
      </div>
  
      {/* Categories Bar */}
      <div className="container mx-auto mt-6 p-4 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Categories</h2>
        <div className="flex space-x-6">
          {sampleCategories.map((category) => (
            <div
              key={category.id}
              className={`flex flex-col items-center justify-center w-20 h-20 rounded-full cursor-pointer transition-shadow shadow-sm hover:shadow-lg ${
                selectedCategory === category.id ? "bg-teal-600 text-white shadow-lg" : "bg-white text-gray-700"
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <div className="text-4xl mb-1">{category.icon}</div>
              <p className="text-sm font-semibold">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
  
      {/* Search and Sort */}
      <div className="container mx-auto mt-6 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <label htmlFor="search" className="sr-only">Search Products</label>
        <input
          id="search"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 py-3 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-md transition text-teal-900"
        />
        <label htmlFor="sort" className="sr-only">Sort By</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:w-1/4 py-3 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-md transition text-teal-900"
        >
          <option value="default" className="text-teal-900">Sort By</option>
          <option value="price-asc" className="text-teal-900">Price: Low to High</option>
          <option value="price-desc" className="text-teal-900">Price: High to Low</option>
          <option value="name-asc" className="text-teal-900">Name: A to Z</option>
          <option value="name-desc" className="text-teal-900">Name: Z to A</option>
        </select>
      </div>
  
      {/* Mode Toggle */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setMode("products")}
          className={`px-4 py-2 rounded ${mode === "products" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Explore Products
        </button>
        <button
          onClick={() => setMode("rentals")}
          className={`px-4 py-2 rounded ${mode === "rentals" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Explore Rentals
        </button>
      </div>
      {/* Suggested Products by Category */}
      <div className="container mx-auto mt-10 p-4 space-y-10">
        {productData.map((category) => (
          <div key={category.category_id}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{category.category_name}</h2>
  
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.product_suggestions.map((product) => (
                <div key={product.product_id} className="bg-white p-3 rounded-lg shadow hover:shadow-md transition">
                  <img
                    src={product.image_url || "/images/default.jpg"}
                    alt={product.name}
                    className="w-full h-36 object-cover rounded"
                  />
                  <h3 className="text-md font-semibold mt-2 text-teal-900">{product.name}</h3>
                  <p className="text-teal-600 font-bold">Rs. {product.price}</p>
                  <StarRating rating={4} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
  

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center justify-center space-x-1 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={"full" + i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z"/></svg>
      ))}
      {halfStar && (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill="url(#half-grad)" d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={"empty" + i} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z"/></svg>
      ))}
    </div>
  );
}


export default ExplorePage;

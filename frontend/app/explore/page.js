"use client";

import React, { useState, useMemo } from "react";
import Carousel from "../../components/ui/carousel";

const sampleCategories = [
  { id: 1, name: "Electronics", icon: "📱" },
  { id: 2, name: "Fashion", icon: "👗" },
  { id: 3, name: "Home", icon: "🏠" },
  { id: 4, name: "Sports", icon: "⚽" },
  { id: 5, name: "Toys", icon: "🧸" },
  { id: 6, name: "Books", icon: "📚" },
  { id: 7, name: "Beauty", icon: "💄" },
];

const sampleProducts = [
  { id: 1, name: "Smartphone", price: 1200, originalPrice: 1500, image: "/placeholder.jpg", rating: 4.5, categoryId: 1 },
  { id: 2, name: "Dress", price: 800, originalPrice: 1000, image: "/placeholder.jpg", rating: 4.0, categoryId: 2 },
  { id: 3, name: "Sofa", price: 1500, originalPrice: 1800, image: "/placeholder.jpg", rating: 4.8, categoryId: 3 },
  { id: 4, name: "Football", price: 500, originalPrice: 700, image: "/placeholder.jpg", rating: 4.2, categoryId: 4 },
  { id: 5, name: "Teddy Bear", price: 2000, originalPrice: 2200, image: "/placeholder.jpg", rating: 4.7, categoryId: 5 },
  { id: 6, name: "Novel", price: 900, originalPrice: 1100, image: "/placeholder.jpg", rating: 4.3, categoryId: 6 },
  { id: 7, name: "Lipstick", price: 300, originalPrice: 400, image: "/placeholder.jpg", rating: 4.1, categoryId: 7 },
];

const carouselImages = [
  { url: "/images/deal1.jpg", alt: "Deal 1" },
  { url: "/images/deal2.jpg", alt: "Deal 2" },
  { url: "/images/deal3.jpg", alt: "Deal 3" },
  { url: "/images/deal4.jpg", alt: "Deal 4" },
];

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

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = useMemo(() => {
    let filtered = sampleProducts;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortOption) {
      case "price-asc":
        filtered = filtered.slice().sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = filtered.slice().sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered = filtered.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, sortOption, selectedCategory]);

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

      {/* Products Grid */}
      <div className="container mx-auto mt-4 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-2 shadow-lg rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-sm font-semibold mt-2 text-teal-900">{product.name}</h2>
              <p className="text-teal-600 font-bold">Rs. {product.price}</p>
              <p className="text-red-500 line-through text-sm">Rs. {product.originalPrice}</p>
              <StarRating rating={product.rating} />
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-red-600">No products found.</p>
        )}
      </div>
    </div>
  );
}

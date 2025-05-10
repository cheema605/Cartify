"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
    sortBy: "relevance"
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Mock data for demonstration
        const mockProducts = [
          {
            product_id: 1,
            name: "Wireless Headphones",
            description: "High-quality wireless headphones with noise cancellation",
            price: 199.99,
            image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
            is_rentable: true
          },
          {
            product_id: 2,
            name: "Smart Watch",
            description: "Latest smart watch with health monitoring features",
            price: 299.99,
            image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
            is_rentable: false
          },
          {
            product_id: 3,
            name: "Laptop Backpack",
            description: "Water-resistant laptop backpack with multiple compartments",
            price: 49.99,
            image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
            is_rentable: true
          },
          {
            product_id: 4,
            name: "Coffee Maker",
            description: "Programmable coffee maker with thermal carafe",
            price: 79.99,
            image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80",
            is_rentable: false
          },
          {
            product_id: 5,
            name: "Yoga Mat",
            description: "Non-slip yoga mat with carrying strap",
            price: 29.99,
            image_url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80",
            is_rentable: true
          },
          {
            product_id: 6,
            name: "Bluetooth Speaker",
            description: "Portable bluetooth speaker with 20-hour battery life",
            price: 89.99,
            image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
            is_rentable: false
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter mock data based on search query
        const filteredProducts = mockProducts.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        );
        
        setProducts(filteredProducts);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [query]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#157a94]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#157a94] text-white rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="h-16 bg-white"></div>
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0F1516] mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600">
              Found {products.length} results
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 bg-white rounded-xl shadow-lg p-6 h-fit">
              <h2 className="text-xl font-semibold text-[#0F1516] mb-4">Filters</h2>
              
              <div className="space-y-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-[#157a94] mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#157a94] mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Garden</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-[#157a94] mb-2">
                    Sort By
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Results Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <h3 className="text-xl font-semibold text-[#0F1516] mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link 
                      href={`/product/${product.product_id}`}
                      key={product.product_id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48">
                        <Image
                          src={product.image_url || "/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-[#0F1516] mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-[#157a94]">
                            ${product.price}
                          </span>
                          {product.is_rentable && (
                            <span className="bg-[#157a94] text-white text-xs px-2 py-1 rounded">
                              Rentable
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
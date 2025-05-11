"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const pageParam = searchParams.get("page") || "1";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Separate state for filter inputs before applying
  const [filterInputs, setFilterInputs] = useState({
    minPrice: "",
    maxPrice: "",
    sortBy: "relevance",
    category: categoryParam,
    type: "all", // new filter for rentals or products
  });

  // Actual filters used for fetching
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortBy: "relevance",
    category: categoryParam,
    type: "all",
  });

  const [page, setPage] = useState(parseInt(pageParam));
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axios.get("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwt_token");
        const params = {
          q: query,
          category: filters.category,
          page: page,
          pageSize: pageSize,
          type: filters.type,
        };
        // Add sorting param if needed
        if (filters.sortBy === "price_low") {
          params.sort = "price_asc";
        } else if (filters.sortBy === "price_high") {
          params.sort = "price_desc";
        } else if (filters.sortBy === "newest") {
          params.sort = "newest";
        } else {
          params.sort = "rating_desc"; // default to top rated
        }

        const response = await axios.get("http://localhost:5000/api/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params,
        });

        setProducts(response.data.products);
        // Assuming backend returns total count or total pages, set totalPages accordingly
        // For now, we assume totalPages = 10 for demonstration
        setTotalPages(10);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, filters.category, page, filters.sortBy, filters.type]);

  const handleFilterInputChange = (e) => {
    const { name, value } = e.target;
    setFilterInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setFilters(filterInputs);
    setPage(1); // reset to first page on filter apply
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/productpage?product_id=${productId}`);
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
              Search Results for "{query}" {filters.category && `in ${filters.category}`}
            </h1>
            <p className="text-gray-600">Found {products.length} results</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 bg-white rounded-xl shadow-lg p-6 h-fit">
              <h2 className="text-xl font-semibold text-[#0F1516] mb-4">Filters</h2>

              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[#157a94] mb-2">
                    Category
                  </label>
                  <input
                    list="category-list"
                    name="category"
                    id="category"
                    value={filterInputs.category}
                    onChange={handleFilterInputChange}
                    placeholder="Select or type category"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                    autoComplete="off"
                  />
                  <datalist id="category-list">
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_name} />
                    ))}
                  </datalist>
                </div>

                {/* Type Filter */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-[#157a94] mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={filterInputs.type}
                    onChange={handleFilterInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                  >
                    <option value="all">All</option>
                    <option value="product">Product</option>
                    <option value="rental">Rental</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-[#157a94] mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filterInputs.minPrice}
                      onChange={handleFilterInputChange}
                      placeholder="Min"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filterInputs.maxPrice}
                      onChange={handleFilterInputChange}
                      placeholder="Max"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-[#157a94] mb-2">
                    Sort By
                  </label>
                  <select
                    name="sortBy"
                    value={filterInputs.sortBy}
                    onChange={handleFilterInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="mt-6">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-[#157a94] text-white rounded-lg hover:opacity-90"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Search Results Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <h3 className="text-xl font-semibold text-[#0F1516] mb-2">No results found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.product_id}
                      onClick={() => handleProductClick(product.product_id)}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
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
                        <h3 className="text-lg font-semibold text-[#0F1516] mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-[#157a94]">${product.price}</span>
                          {product.is_rentable && (
                            <span className="bg-[#157a94] text-white text-xs px-2 py-1 rounded">Rentable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              <div className="flex justify-center mt-8 gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

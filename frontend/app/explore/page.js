"use client";

import React, { useState, useEffect, useMemo } from "react";
import Carousel from "../../components/ui/carousel";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Star, Search, Filter } from "lucide-react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import CartSlidingPanel from "../../components/CartSlidingPanel";

const carouselImages = [
  { url: "/images/deal1.jpg", alt: "Deal 1" },
  { url: "/images/deal2.jpg", alt: "Deal 2" },
  { url: "/images/deal3.jpg", alt: "Deal 3" },
  { url: "/images/deal4.jpg", alt: "Deal 4" },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, mode }) => {
  const router = useRouter();
  const [isOnWishlist, setIsOnWishlist] = useState(product.is_on_wishlist || false);

  useEffect(() => {
    setIsOnWishlist(product.is_on_wishlist || false);
  }, [product.is_on_wishlist]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product.product_id);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      alert("Please login to manage wishlist.");
      return;
    }
    try {
      if (!isOnWishlist) {
        await fetch("http://localhost:5000/api/wishlist/add-to-wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.product_id }),
        });
        setIsOnWishlist(true);
      } else {
        await fetch("http://localhost:5000/api/wishlist/remove-from-wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.product_id }),
        });
        setIsOnWishlist(false);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      alert("Failed to update wishlist.");
    }
  };

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => router.push(`/productpage?product_id=${product.product_id}`)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url || "/images/default.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label={isOnWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 ${
              isOnWishlist ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          {product.discount_percent && product.discount_percent > 0 ? (
            <div className="flex items-center space-x-2">
              <p className="text-xl font-bold text-gray-500 line-through">Rs. {product.price}</p>
              <p className="text-xl font-bold text-red-600">Rs. {product.discounted_price.toFixed(2)}</p>
              <p className="text-sm text-red-500">({product.discount_percent}% off)</p>
            </div>
          ) : (
            <p className="text-xl font-bold text-teal-600">Rs. {product.price}</p>
          )}
          <StarRating rating={product.rating || 0} />
        </div>
        {mode === "products" && product.is_sellable && (
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        )}
        {/* Rent button removed as per request */}
      </div>
    </div>
  );
};

const ExplorePage = () => {
  const router = useRouter();
  const [mode, setMode] = useState("products");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  useEffect(() => {
    setCartOpen(false);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setCartOpen(false);
    };

    return () => {
      setCartOpen(false);
    };
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      alert("Please login to add items to cart.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/shoppping-cart/add-to-cart",
        { product_id: productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Item added to cart!");
      if (!cartOpen) {
        setCartOpen(true);
      } else {
        setCartRefreshTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      alert("Please login to add items to wishlist.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/wishlist/add-to-wishlist",
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Item added to wishlist!");
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
      alert("Failed to add item to wishlist.");
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const token = localStorage.getItem("jwt_token");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/explore", {
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
          router.push("/login");
        }
        setError("Failed to fetch data");
        setProductData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const filteredItems = useMemo(() => {
    if (!Array.isArray(productData)) return [];
    
    let items = [];

    if (mode === "products") {
      items = productData.flatMap((category) => {
        if (!category || !Array.isArray(category.product_suggestions)) return [];
        return category.product_suggestions.map((product) => ({
          ...product,
          rating: 0,
        }));
      });
    }

    if (selectedCategory) {
      items = items.filter((item) => item.category_id === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply sorting
    if (sortOption === "price-asc") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      items.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }

    return items;
  }, [mode, selectedCategory, productData, searchQuery, sortOption]);

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="fixed -top-4 left-1/2 z-50 -translate-x-1/2 w-[98vw] max-w-7xl">
        <Navbar cartOpen={cartOpen} toggleCart={toggleCart} />
      </div>
      <div className="relative bg-gradient-to-b from-teal-600 to-teal-800 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Carousel images={carouselImages} autoPlay={true} autoPlayTime={4000} />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 pt-24">
        <CartSlidingPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} userId={"current"} disableOverlay={true} />
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 ">
          {/* Modern Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/70 backdrop-blur-md shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition"
              style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)" }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex gap-3 items-center bg-white/70 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-gray-200">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm text-gray-700 font-medium transition"
            >
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold shadow hover:from-blue-600 hover:to-teal-500 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Category Section - Styled Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productData.map((category, index) => (
              <div
                key={category.id}
                className={`rounded-xl p-6 shadow-md text-white cursor-pointer transition-transform transform hover:scale-105 ${
                  [
                    "bg-gradient-to-br from-black to-gray-800",
                    "bg-yellow-400 text-black",
                    "bg-red-500",
                    "bg-violet-500 text-black",
                    "bg-green-500",
                    "bg-blue-500",
                    "bg-pink-500",
                  ][index % 7]
                }`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              >
                <div className="text-4xl mb-4">{category.symbol}</div>
                <h3 className="text-xl font-semibold mb-1">{category.category_name}</h3>
                <p className="mb-4 text-sm">Discover the best in {category.category_name}</p>
                <button className="px-4 py-2 bg-white text-sm font-medium rounded-md text-black hover:bg-gray-100 transition">
                  Browse
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("products")}
            className={`px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300
              ${mode === "products"
                ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white ring-2 ring-blue-300/60 backdrop-blur-md"
                : "bg-white/60 text-gray-800 border border-gray-300 hover:bg-white/80 hover:shadow-xl backdrop-blur-md"}
            `}
          >
            Explore Products
          </button>
          <button
            onClick={() => setMode("rentals")}
            className={`px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300
              ${mode === "rentals"
                ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white ring-2 ring-blue-300/60 backdrop-blur-md"
                : "bg-white/60 text-gray-800 border border-gray-300 hover:bg-white/80 hover:shadow-xl backdrop-blur-md"}
            `}
          >
            Explore Rentals
          </button>
        </div>

        {/* Suggested Categories and Products */}
        {productData.slice(0, 7).map(({ category_name, product_suggestions, rental_suggestions }) => {
          const suggestions = mode === "rentals" ? rental_suggestions : product_suggestions;

          return (
            <div key={category_name} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{category_name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {suggestions && suggestions.length > 0 ? (
                  suggestions.map((product) => (
                    <ProductCard key={product.product_id} product={product} onAddToCart={addToCart} mode={mode} />
                  ))
                ) : (
                  <div className="col-span-4 text-center">No products available</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;

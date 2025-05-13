"use client";

import React, { useState, useEffect, useMemo } from "react";
import Carousel from "../../components/ui/carousel";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import CartSlidingPanel from "../../components/CartSlidingPanel";

const carouselImages = [
  { url: "/images/deal-1.png", alt: "Mega Sale - Up to 50% Off!" },
  { url: "/images/deal-2.png", alt: "Buy 1 Get 1 Free on Select Items" },
  { url: "/images/summer-sale.jpg", alt: "Summer Sale - Limited Time Only" },
  { url: "/images/electronics-discount.jpg", alt: "Electronics Discount" },
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);

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

        const mappedData = response.data.map((category) => ({
          ...category,
          product_suggestions: category.product_suggestions.map((p) => ({
            ...p,
            rating: p.average_rating || 0,
          })),
          rental_suggestions: category.rental_suggestions.map((p) => ({
            ...p,
            rating: p.average_rating || 0,
          })),
        }));
        setProductData(mappedData);
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
          rating: 0,
        }))
      );
    }

    if (selectedCategory) {
      items = items.filter((item) => item.category_id === selectedCategory);
    }

    return items;
  }, [mode, selectedCategory, productData]);

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
        <CartSlidingPanel
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          userId={"current"}
          disableOverlay={true}
        />
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
                onClick={() => router.push(`/search?category=${encodeURIComponent(category.category_name)}`)}
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
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}
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

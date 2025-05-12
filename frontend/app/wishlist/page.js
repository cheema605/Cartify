"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch("http://localhost:5000/api/wishlist/get-wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlistItems(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (product_id) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch("http://localhost:5000/api/wishlist/remove-from-wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id }),
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to remove item");

      // Filter out the removed item
      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== product_id)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-6">
      <div
        className="flex items-center justify-center mb-8 gap-4 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6 text-gray-900" />
        <h1 className="text-4xl font-extrabold text-gray-900">
          Your Wishlist
        </h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading wishlist...</p>
      ) : wishlistItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div
              key={item.wishlist_id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <img
                src={item.image_url || "/images/placeholder.png"}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-lg text-teal-700 font-bold mt-2">${item.price}</p>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

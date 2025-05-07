"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const sampleWishlistItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$59.99",
    image: "/images/deal1.jpg",
  },
  {
    id: 2,
    name: "Smartwatch Series 7",
    price: "$199.99",
    image: "/images/deal2.jpg",
  },
  {
    id: 3,
    name: "Gaming Laptop",
    price: "$999.99",
    image: "/images/deal3.jpg",
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(sampleWishlistItems);
  const router = useRouter();

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-6">
      <div className="flex items-center justify-center mb-8 gap-4 cursor-pointer" onClick={() => router.push("/explore")}>
        <ArrowLeft className="h-6 w-6 text-gray-900" />
        <h1 className="text-4xl font-extrabold text-gray-900">
          Your Wishlist
        </h1>
      </div>
      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-lg text-teal-700 font-bold mt-2">{item.price}</p>
                <button
                  onClick={() => removeItem(item.id)}
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

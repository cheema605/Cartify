"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";

export default function ExplorePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const userId = 1; // TODO: Replace with actual logged-in user ID

  // Fetch cart items from backend when cart is opened
  useEffect(() => {
    if (cartOpen) {
      fetch("/api/shopping-cart/" + userId)
        .then((res) => res.json())
        .then((data) => {
          setCartItems(data);
        })
        .catch((err) => {
          console.error("Failed to fetch cart items:", err);
        });
    }
  }, [cartOpen]);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const continueShopping = () => {
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Navbar */}
      <div className="bg-[#0e5a6d] py-4 px-6 flex items-center justify-between shadow-md">
        <h1 className="text-white text-2xl font-bold italic">Cartify</h1>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search in Cartify"
            className="w-full py-2 px-4 rounded-lg focus:outline-none"
          />
          <Search className="absolute right-3 top-2 text-gray-500" />
        </div>
        <button onClick={toggleCart} aria-label="Toggle cart">
          <ShoppingCart className="text-white w-6 h-6" />
        </button>
      </div>

      {/* Sliding Cart Panel */}
      <div
        className={
          "fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col " +
          (cartOpen ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button onClick={toggleCart} aria-label="Close cart">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.cart_id} className="flex items-center mb-4 border-b pb-2">
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : "/placeholder.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-teal-600 font-bold">Rs. {item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={continueShopping}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Continue Shopping
          </button>
          <Link href="/checkout" legacyBehavior>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto mt-6 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white p-2 shadow-lg rounded-lg">
            <img
              src="/placeholder.jpg"
              alt="Product"
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-sm font-semibold mt-2">Product Name</h2>
            <p className="text-teal-600 font-bold">Rs. 999</p>
            <p className="text-gray-500 line-through text-sm">Rs. 1,500</p>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-4 shadow rounded-lg text-center">
              <img
                src="/placeholder-category.jpg"
                alt="Category"
                className="w-16 h-16 mx-auto mb-2"
              />
              <p className="text-sm font-medium">Category {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

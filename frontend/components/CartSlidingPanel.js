"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function CartSlidingPanel({ isOpen, onClose, userId, disableOverlay = false }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/shopping-cart/" + userId)
        .then((res) => res.json())
        .then((data) => {
          setCartItems(data);
        })
        .catch((err) => {
          console.error("Failed to fetch cart items:", err);
        });
    }
  }, [isOpen, userId]);

  return (
    <>
      {/* Overlay with blur */}
      {!disableOverlay && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        ></div>
      )}

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 flex flex-col transform transition-transform duration-[1500ms] ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-teal-700">Shopping Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
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
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Continue Shopping
          </button>
          <Link href="/checkout" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
}

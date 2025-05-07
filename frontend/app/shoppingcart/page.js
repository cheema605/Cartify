"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if the modal is open

  // Sample cart data (replace with actual cart data from your app state)
  const cartItems = [
    {
      id: 1,
      name: "Cool Sneakers",
      price: 99.99,
      quantity: 1,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Stylish Jacket",
      price: 59.99,
      quantity: 2,
      imageUrl: "https://via.placeholder.com/150",
    },
  ];

  const handleProceedToCheckout = () => {
    setIsModalOpen(true); // Open the confirmation dialog
  };

  const handleConfirmCheckout = () => {
    setIsModalOpen(false); // Close the modal
    router.push("/checkout"); // Navigate to the checkout page
  };

  const handleCancelCheckout = () => {
    setIsModalOpen(false); // Close the modal and stay on the cart page
  };

  return (
    <div className="w-full h-screen bg-white">
      {/* Cart Page Content */}
      <div className="w-full h-full pt-24 pb-16 overflow-y-auto bg-white flex flex-col items-center">
        <div className="w-11/12 max-w-4xl bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-extrabold text-center tracking-wide mb-6 text-[#106b82] font-serif">
            Your Cart
          </h2>

          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-4 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex flex-col ml-4">
                  <p className="text-lg font-semibold font-serif">{item.name}</p>
                  <p className="text-sm text-gray-600 font-serif">x{item.quantity}</p>
                  <p className="text-lg font-medium font-serif">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button className="text-[#106b82] text-sm font-medium font-serif">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 border-t pt-6">
            <p className="text-xl font-semibold font-serif">Total:</p>
            <p className="text-xl font-semibold text-[#106b82] font-serif">
              ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </p>
          </div>

          {/* Proceed to Checkout Button */}
          <div className="flex justify-center mt-8">
            <button
              className="px-8 py-3 bg-[#106b82] text-white font-bold rounded-lg hover:bg-[#0e5a6d] transition font-serif"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4 text-white text-center font-serif">
              Are you sure you want to checkout?
            </h3>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-6 py-2 bg-[#106b82] text-white font-medium rounded-lg hover:bg-[#0e5a6d] transition font-serif"
                onClick={handleConfirmCheckout}
              >
                Yes
              </button>
              <button
                className="px-6 py-2 bg-[#106b82] text-white font-medium rounded-lg hover:bg-[#0e5a6d] transition font-serif"
                onClick={handleCancelCheckout}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

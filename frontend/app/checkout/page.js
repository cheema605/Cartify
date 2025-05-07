"use client"; // Enables client-side rendering
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !shippingInfo.name ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.zip ||
      !shippingInfo.country
    ) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    alert("Order placed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-24 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 w-full max-w-xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center font-serif tracking-normal">
          Checkout
        </h1>
        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Shipping Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 font-serif">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={shippingInfo.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 font-serif transition duration-200"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 font-serif">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 font-serif transition duration-200"
                placeholder="123 Main St"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1 font-serif">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 font-serif transition duration-200"
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 font-serif">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={shippingInfo.zip}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 font-serif transition duration-200"
                  placeholder="10001"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 font-serif">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 font-serif transition duration-200"
                placeholder="USA"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 font-medium mb-3 font-serif">
              Payment Method
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 font-serif transition duration-200"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash on Delivery</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-transform transform hover:scale-105 font-serif font-semibold text-base shadow-md"
          >
            Place Order
          </button>
        </form>

        {/* Return to Explore with Cart Open */}
        <p className="mt-6 text-center text-sm font-serif text-gray-600">
          <Link href="/explore?cartOpen=true" className="text-indigo-600 underline hover:text-indigo-800">
            Back to Cart
          </Link>
        </p>
      </div>
    </div>
  );
}

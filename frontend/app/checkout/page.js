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
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip || !shippingInfo.country) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    alert("Order placed successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0e5a6d] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center font-serif">Checkout</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Shipping Information */}
          <div className="mb-4">
            <label className="block text-[#157a94] font-serif">Full Name</label>
            <input
              type="text"
              name="name"
              value={shippingInfo.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black font-serif"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#157a94] font-serif">Address</label>
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black font-serif"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#157a94] font-serif">City</label>
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black font-serif"
                required
              />
            </div>
            <div>
              <label className="block text-[#157a94] font-serif">Zip Code</label>
              <input
                type="text"
                name="zip"
                value={shippingInfo.zip}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black font-serif"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[#157a94] font-serif">Country</label>
            <input
              type="text"
              name="country"
              value={shippingInfo.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black font-serif"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-[#157a94] font-serif mb-2">Payment Method</label>
            <select
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black font-serif"
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
            className="w-full bg-[#157a94] text-white py-2 rounded-lg hover:bg-[#106b82] transition-transform transform hover:scale-105 font-serif"
          >
            Place Order
          </button>
        </form>

        {/* Return to Cart */}
        <p className="mt-4 text-center text-sm font-serif">
          <Link href="/cart" className="text-[#157a94] underline hover:text-blue-700">
            Back to Cart
          </Link>
        </p>
      </div>
    </div>
  );
}
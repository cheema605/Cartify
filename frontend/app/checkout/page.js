"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    paymentMethod: "credit_card",
  });

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await fetch("http://localhost:5000/api/shoppping-cart/get-cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    // Pass formData as JSON string in query parameter
    const encodedFormData = encodeURIComponent(JSON.stringify(formData));
    router.push(`/confirm?formData=${encodedFormData}`);
  };

  if (loadingCart) {
    return <div className="p-6 text-center">Loading cart...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  if (cartItems.length === 0) {
    return <div className="p-6 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirm();
        }}
      >
        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1" htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="postalCode">
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              required
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1" htmlFor="paymentMethod">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 transition"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}

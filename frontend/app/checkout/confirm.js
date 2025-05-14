"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Retrieve formData from query param
    const formDataString = searchParams.get("formData");
    if (!formDataString) {
      setError("Missing form data");
      setLoading(false);
      return;
    }
    try {
      const parsedFormData = JSON.parse(formDataString);
      setFormData(parsedFormData);
    } catch {
      setError("Invalid form data");
      setLoading(false);
      return;
    }

    // Fetch cart items
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
        setLoading(false);
      }
    };
    fetchCart();
  }, [router, searchParams]);

  const handleLooksGood = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        router.push("/login");
        return;
      }
      // Prepare order data payload
      const orderPayload = {
        customer_name: formData.fullName,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        payment_method: formData.paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // Call backend API to create order and payment method
      const res = await fetch("http://localhost:5000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      // Clear cart or handle post-order logic as needed

      // Navigate to order confirmation or orders page
      router.push("/myorders");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleModify = () => {
    // Navigate back to explore page with cart slider open
    router.push("/explore?cartOpen=true");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  import { useState } from "react";

  if (error) {
    // Show modal popup for order creation failure
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-red-600">Failed to create order</h2>
          <button
            onClick={() => router.push("/explore")}
            className="mt-4 px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Confirm Your Order</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
        <p><strong>Name:</strong> {formData.fullName}</p>
        <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.postalCode}, {formData.country}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Payment Method:</strong> {formData.paymentMethod.replace(/_/g, " ")}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cart Items</h2>
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li key={item.product_id} className="py-2 flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleLooksGood}
          disabled={submitting}
          className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          {submitting ? "Submitting..." : "Looks Good"}
        </button>
        <button
          onClick={handleModify}
          className="flex-1 bg-gray-300 py-3 rounded hover:bg-gray-400 transition"
        >
          Modify
        </button>
      </div>
    </div>
  );
}

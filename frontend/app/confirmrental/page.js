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
    console.log("useEffect triggered");
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

    // Retrieve rental details from query param
    const rentalDetailsString = searchParams.get("rentalDetails");
    if (!rentalDetailsString) {
      setError("Missing rental details");
      setLoading(false);
      return;
    }
    try {
      const parsedRentalDetails = JSON.parse(rentalDetailsString);
      setCartItems([{
        product_id: parsedRentalDetails.product_id,
        quantity: parsedRentalDetails.quantity,
        total_rent: parsedRentalDetails.totalRent,
        price: parsedRentalDetails.price || 0, // Ensure price is included
      }]);
    } catch {
      setError("Invalid rental details");
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [router, searchParams]);

  const handleLooksGood = async () => {
    console.log("handleLooksGood called");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        router.push("/login");
        return;
      }
      
      // Decode buyer_id from token or get from localStorage (assuming stored)
      // const buyer_id = localStorage.getItem("buyer_id");
      // if (!buyer_id) {
      //   setError("User ID not found");
      //   setSubmitting(false);
      //   return;
      // }
      console.log("handleLooksGood called");

      // Calculate total price
      const total_price = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      console.log("handleLooksGood called2");

      // Prepare order data payload matching backend expectations
      const orderPayload = {
        products: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_price,
        payment_method: formData.paymentMethod,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
      };
      console.log("handleLooksGood called3");
      console.log("Order payload:", orderPayload);

      // Call backend API to create rental and payment
      const res = await fetch("http://localhost:5000/api/rental-order/create-rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rentalDetails: {
            product_id: cartItems[0].product_id, // Assuming single product rental
            quantity: cartItems[0].quantity,
            rent_days: cartItems[0].rent_days || 1, // Ensure rent_days is included
            total_rent: cartItems[0].total_rent,
          },
          paymentDetails: {
            amount: cartItems[0].total_rent,
            payment_method: formData.paymentMethod,
          },
          addressDetails: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create rental");
      }

      // Navigate to rental confirmation page
      router.push("/myrentals");
    } catch (err) {
      console.error("Error in handleLooksGood:", err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleModify = () => {
    console.log("handleModify called");
    // Navigate back to explore page with cart slider open
    router.push("/explore?cartOpen=true");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
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

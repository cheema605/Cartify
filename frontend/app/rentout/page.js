"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RentoutPage() {
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

  const [quantity, setQuantity] = useState(1);
  const [rentDays, setRentDays] = useState(1);
  const [totalRent, setTotalRent] = useState(0);
  const [productRentPrice, setProductRentPrice] = useState(0);

  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductRent = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const product_id = new URLSearchParams(window.location.search).get("product_id");
        if (!product_id) {
          throw new Error("Product ID is missing in the URL");
        }

        const res = await fetch(`http://localhost:5000/api/products/products/?product_id=${product_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch product rent price");
        }

        const product = await res.json();
        setProductRentPrice(product.rent);
        setTotalRent(product.rent * quantity * rentDays);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchProductRent();
  }, []);

  useEffect(() => {
    setTotalRent(productRentPrice * quantity * rentDays);
  }, [productRentPrice, quantity, rentDays]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    const rentalDetails = {
      product_id: new URLSearchParams(window.location.search).get("product_id"), // Include product_id
      quantity,
      rentDays,
      totalRent,
      price: productRentPrice, // Use productRentPrice
    };
    const encodedFormData = encodeURIComponent(JSON.stringify(formData));
    const encodedRentalDetails = encodeURIComponent(JSON.stringify(rentalDetails));
    router.push(`/confirmrental?formData=${encodedFormData}&rentalDetails=${encodedRentalDetails}`);
  };

  if (loadingCart) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Rental Details</h1>

      <div className="mb-6">
        <label className="block font-semibold mb-1" htmlFor="quantity">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1" htmlFor="rentDays">
          Rent Days
        </label>
        <input
          id="rentDays"
          name="rentDays"
          type="number"
          min="1"
          value={rentDays}
          onChange={(e) => setRentDays(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1" htmlFor="totalRent">
          Total Rent
        </label>
        <input
          id="totalRent"
          name="totalRent"
          type="text"
          value={`Rs ${totalRent.toFixed(2)}`}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100"
        />
      </div>

      <h2 className="text-xl font-bold mb-6">Checkout</h2>

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
            onChange={handleFormChange}
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
            onChange={handleFormChange}
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
              onChange={handleFormChange}
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
              onChange={handleFormChange}
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
            onChange={handleFormChange}
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
            onChange={handleFormChange}
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
            onChange={handleFormChange}
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

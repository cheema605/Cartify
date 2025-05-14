"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RentalOrdersPage() {
  const router = useRouter();
  const [rentalOrders, setRentalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentalOrders = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/rental-order/my-rental-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch rental orders");
        }
        const data = await response.json();
        setRentalOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalOrders();
  }, []);

  const handleRentalOrderClick = (rentalOrderId) => {
    router.push(`/rental-order-status?rental_order_id=${rentalOrderId}`);
  };

  if (loading) {
    return <div className="p-6 text-center text-lg font-semibold">Loading rental orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-lg font-semibold text-red-600">{error}</div>;
  }

  if (rentalOrders.length === 0) {
    return <div className="p-6 text-center text-lg font-semibold">No rental orders found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-32">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 border-b-2 border-indigo-600 pb-2">
        My Rental Orders
      </h1>
      <ul className="space-y-4">
        {rentalOrders.map((order) => (
          <li
            key={order.rental_order_id}
            className="cursor-pointer border rounded p-4 hover:bg-gray-100"
            onClick={() => handleRentalOrderClick(order.rental_order_id)}
          >
            <p><span className="font-semibold">Rental Order ID:</span> {order.rental_order_id}</p>
            <p><span className="font-semibold">Rental Start Date:</span> {order.rental_start_date ? new Date(order.rental_start_date).toLocaleDateString() : "N/A"}</p>
            <p><span className="font-semibold">Rental Period (days):</span> {order.rental_period_days}</p>
            <p><span className="font-semibold">Status:</span> {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

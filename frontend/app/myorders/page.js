"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/order/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log("Fetched orders:", data); // Debug print
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleOrderClick = (orderId) => {
    router.push(`/order-status?order_id=${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="pt-16"> {/* Added padding to prevent content from hiding below the navbar */}
      <div className="min-h-screen max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.order_id}
              className="cursor-pointer border rounded-lg p-4 shadow hover:bg-gray-100 transition"
              onClick={() => handleOrderClick(order.order_id)}
            >
              <div className="flex justify-between">
                <span className="font-semibold">Order ID: {order.order_id}</span>
                <span className="text-gray-600">{new Date(order.order_date).toLocaleDateString()}</span>
              </div>
              <div className="mt-1 text-gray-700">
                Total: Rs. {order.total_price !== undefined && order.total_price !== null ? order.total_price.toFixed(2) : "0.00"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

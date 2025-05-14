"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, Truck, Package, Home } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OrderStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/order/get-order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        const orderData = data.order || data;
        const itemsData = data.items || [];
        setOrder({ ...orderData, items: itemsData });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="p-6 text-center text-lg font-semibold">Loading order status...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-lg font-semibold text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="p-6 text-center text-lg font-semibold">Order not found.</div>;
  }

  // Calculate estimated delivery as order_date + 15 days
  const estimatedDeliveryDate = order.order_date
    ? new Date(new Date(order.order_date).getTime() + 15 * 24 * 60 * 60 * 1000)
    : null;

  // Define the steps in order
  const steps = [
    { step: "Order Placed", icon: Home },
    { step: "Processing", icon: Clock },
    { step: "Shipped", icon: Truck },
    { step: "Out for Delivery", icon: Package },
    { step: "Delivered", icon: CheckCircle },
  ];

  // Determine completed steps based on order.status safely
  const currentStepIndex = order.status
    ? steps.findIndex(s => s.step.toLowerCase() === order.status.toLowerCase())
    : -1;

  const handleProductClick = (productId) => {
    router.push(`/productpage?product_id=${productId}`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-lg relative z-50 mt-32">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 border-b-2 border-indigo-600 pb-2">
        Order Status
      </h1>
      <div className="mb-4 space-y-2 text-gray-700 text-lg">
        <p><span className="font-semibold">Order ID:</span> {order.order_id || order.id}</p>
        <p><span className="font-semibold">Current Status:</span> {order.status || "N/A"}</p>
        <p><span className="font-semibold">Order Date:</span> {order.order_date ? new Date(order.order_date).toLocaleDateString() : "N/A"}</p>
        <p><span className="font-semibold">Estimated Delivery:</span> {estimatedDeliveryDate ? estimatedDeliveryDate.toLocaleDateString() : "N/A"}</p>
      </div>

      {/* Order details below estimated delivery */}
      <div className="mb-8 space-y-2 text-gray-700 text-lg border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        {order.items && order.items.length > 0 ? (
          <ul className="space-y-2">
            {order.items.map((product) => (
              <li
                key={product.product_id}
                className="flex items-center justify-between border-b pb-1 cursor-pointer hover:bg-gray-100"
                onClick={() => handleProductClick(product.product_id)}
              >
                <div className="flex items-center space-x-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name || "Product Image"}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <span>{product.name || "Unnamed Product"}</span>
                </div>
                <div className="flex space-x-6">
                  <span>Qty: {product.quantity}</span>
                  <span>Rs. {product.price.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found for this order.</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-blue-700">Tracking Progress</h2>
      <div className="relative flex items-center justify-center space-x-4">
        {/* Continuous connecting line */}
        <div className="absolute top-12 left-4 right-4 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-blue-700 rounded-full z-0"></div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const completed = index <= currentStepIndex;
          return (
            <div key={index} className="flex flex-col items-center w-1/5 relative z-10">
              <div
                className={`p-4 rounded-full shadow-md transition-colors duration-500 ease-in-out ${
                  completed
                    ? "bg-gradient-to-r from-green-500 via-blue-500 to-blue-700 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Icon size={28} className={completed ? "drop-shadow-lg" : ""} />
              </div>
              <p
                className={`mt-3 text-center text-sm font-semibold transition-colors duration-500 ${
                  completed ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.step}
              </p>
              {completed && order.status_dates && order.status_dates[step.step.toLowerCase()] && (
                <p className="text-xs text-gray-500 mt-1">{new Date(order.status_dates[step.step.toLowerCase()]).toLocaleDateString()}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

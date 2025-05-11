"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, Truck, Package, Home } from "lucide-react";

const sampleOrder = {
  id: "ORD-12345",
  product: "Premium Widget",
  status: "Shipped",
  estimatedDelivery: "2024-02-10",
  trackingSteps: [
    { step: "Order Placed", completed: true, date: "2024-01-20", icon: Home },
    { step: "Processing", completed: true, date: "2024-01-21", icon: Clock },
    { step: "Shipped", completed: true, date: "2024-01-25", icon: Truck },
    { step: "Out for Delivery", completed: false, date: null, icon: Package },
    { step: "Delivered", completed: false, date: null, icon: CheckCircle }
  ]
};

export default function OrderStatusPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Placeholder for fetching real order data from API
    setOrder(sampleOrder);
  }, []);

  if (!order) {
    return <div className="p-6 text-center text-lg font-semibold">Loading order status...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-lg relative z-50 mt-32">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 border-b-2 border-indigo-600 pb-2">
        Order Status
      </h1>
      <div className="mb-8 space-y-2 text-gray-700 text-lg">
        <p><span className="font-semibold">Order ID:</span> {order.id}</p>
        <p><span className="font-semibold">Product:</span> {order.product}</p>
        <p><span className="font-semibold">Current Status:</span> {order.status}</p>
        <p><span className="font-semibold">Estimated Delivery:</span> {order.estimatedDelivery}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-blue-700">Tracking Progress</h2>
      <div className="relative flex items-center justify-center space-x-4">
        {/* Continuous connecting line */}
        <div className="absolute top-12 left-4 right-4 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-blue-700 rounded-full z-0"></div>

        {order.trackingSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex flex-col items-center w-1/5 relative z-10">
              <div
                className={`p-4 rounded-full shadow-md transition-colors duration-500 ease-in-out ${
                  step.completed
                    ? "bg-gradient-to-r from-green-500 via-blue-500 to-blue-700 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Icon size={28} className={step.completed ? "drop-shadow-lg" : ""} />
              </div>
              <p
                className={`mt-3 text-center text-sm font-semibold transition-colors duration-500 ${
                  step.completed ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.step}
              </p>
              {step.completed && step.date && (
                <p className="text-xs text-gray-500 mt-1">{step.date}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

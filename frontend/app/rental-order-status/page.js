"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, Truck, Package, Home } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function RentalOrderStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rentalOrderId = searchParams.get("rental_order_id");

  const [rentalOrder, setRentalOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rentalOrderId) {
      setError("Rental Order ID is missing");
      setLoading(false);
      return;
    }

    const fetchRentalOrder = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/rental-order/get-rental-order/${rentalOrderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch rental order details");
        }
        const data = await response.json();
        const rentalOrderData = data.rentalOrder || data;
        const itemsData = data.items || [];
        setRentalOrder({ ...rentalOrderData, items: itemsData });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalOrder();
  }, [rentalOrderId]);

  if (loading) {
    return <div className="p-6 text-center text-lg font-semibold">Loading rental order status...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-lg font-semibold text-red-600">{error}</div>;
  }

  if (!rentalOrder) {
    return <div className="p-6 text-center text-lg font-semibold">Rental order not found.</div>;
  }

  // Calculate estimated return date as rental_start_date + rental_period_days
  const estimatedReturnDate = rentalOrder.rental_start_date && rentalOrder.rental_period_days
    ? new Date(new Date(rentalOrder.rental_start_date).getTime() + rentalOrder.rental_period_days * 24 * 60 * 60 * 1000)
    : null;

  // Define the steps in rental order status
  const steps = [
    { step: "Order Placed", icon: Home },
    { step: "Processing", icon: Clock },
    { step: "Shipped", icon: Truck },
    { step: "Out for Delivery", icon: Package },
    { step: "Delivered", icon: CheckCircle },
    { step: "Returned", icon: CheckCircle },
  ];

  // Determine completed steps based on rentalOrder.status safely
  const currentStepIndex = rentalOrder.status
    ? steps.findIndex(s => s.step.toLowerCase() === rentalOrder.status.toLowerCase())
    : -1;

  const handleProductClick = (productId) => {
    router.push(`/productpage?product_id=${productId}`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-lg relative z-50 mt-32">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 border-b-2 border-indigo-600 pb-2">
        Rental Order Status
      </h1>
      <div className="mb-4 space-y-2 text-gray-700 text-lg">
        <p><span className="font-semibold">Rental Order ID:</span> {rentalOrder.rental_order_id || rentalOrder.id}</p>
        <p><span className="font-semibold">Current Status:</span> {rentalOrder.status || "N/A"}</p>
        <p><span className="font-semibold">Rental Start Date:</span> {rentalOrder.rental_start_date ? new Date(rentalOrder.rental_start_date).toLocaleDateString() : "N/A"}</p>
        <p><span className="font-semibold">Estimated Return Date:</span> {estimatedReturnDate ? estimatedReturnDate.toLocaleDateString() : "N/A"}</p>
      </div>

      {/* Rental order details below estimated return date */}
      <div className="mb-8 space-y-2 text-gray-700 text-lg border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Rental Order Details</h2>
        {rentalOrder.items && rentalOrder.items.length > 0 ? (
          <ul className="space-y-2">
            {rentalOrder.items.map((product) => (
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
          <p>No rental products found for this order.</p>
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
            <div key={index} className="flex flex-col items-center w-1/6 relative z-10">
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
              {completed && rentalOrder.status_dates && rentalOrder.status_dates[step.step.toLowerCase()] && (
                <p className="text-xs text-gray-500 mt-1">{new Date(rentalOrder.status_dates[step.step.toLowerCase()]).toLocaleDateString()}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

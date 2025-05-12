"use client";

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartSlidingPanel({ isOpen, onClose, userId, disableOverlay = false }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
      if (isOpen) {
        const token = localStorage.getItem("jwt_token");
        fetch("http://localhost:5000/api/shoppping-cart/get-cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res.status === 401 || res.status === 403) {
              window.location.href = "/login";
              return Promise.reject("Unauthorized");
            }
            return res.json();
          })
          .then((data) => {
            setCartItems(data);
          })
          .catch((err) => {
            if (err !== "Unauthorized") {
              console.error("Failed to fetch cart items:", err);
            }
          });
      }
  }, [isOpen, userId]);

  const removeFromCart = (productId) => {
    const token = localStorage.getItem("jwt_token");
    fetch("http://localhost:5000/api/shoppping-cart/remove-from-cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/login";
          return Promise.reject("Unauthorized");
        }
        if (!res.ok) throw new Error("Failed to remove item from cart");
        return res.json();
      })
      .then(() => {
        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
      })
      .catch((err) => {
        if (err !== "Unauthorized") {
          console.error("Error removing item from cart:", err);
          alert("Failed to remove item from cart");
        }
      });
  };

  return (
    <>
      {/* Overlay with blur */}
      {!disableOverlay && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-40 transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        ></div>
      )}

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-70 flex flex-col transform transition-transform duration-[1500ms] ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-teal-700">Shopping Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.cart_id} className="flex items-center mb-4 border-b pb-2">
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : "/placeholder.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-teal-600 font-bold">Rs. {item.price}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                      className="w-12 text-center border rounded"
                      aria-label={`Quantity of ${item.name}`}
                    />
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-300 rounded"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="ml-4 p-1 rounded bg-red-100 hover:bg-red-200 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Continue Shopping
          </button>
          <Link href="/checkout" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );

  function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("jwt_token");
    fetch("http://localhost:5000/api/shoppping-cart/edit-cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, new_quantity: newQuantity }),
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/login";
          return Promise.reject("Unauthorized");
        }
        if (!res.ok) throw new Error("Failed to update quantity");
        return res.json();
      })
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((err) => {
        if (err !== "Unauthorized") {
          console.error("Error updating quantity:", err);
          alert("Failed to update quantity");
        }
      });
  }
}

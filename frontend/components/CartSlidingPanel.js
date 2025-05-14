'use client';

import React, { useState, useEffect } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from "next/navigation";

export default function CartSlidingPanel({ isOpen, onClose, userId, disableOverlay }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      fetchCartItems()
    }
  }, [isOpen])

  const handleUnauthorized = (status) => {
    if (status === 401 || status === 403) {
      router.push('/login')
      return true
    }
    return false
  }

  const fetchCartItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        router.push('/login')
        return
      }
      const res = await fetch('http://localhost:5000/api/shoppping-cart/get-cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (handleUnauthorized(res.status)) return
      if (!res.ok) {
        throw new Error('Failed to fetch cart items')
      }
      const data = await res.json()
      setCartItems(data)
    } catch (err) {
      setError(err.message)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      const token = localStorage.getItem('jwt_token')
      const res = await fetch('http://localhost:5000/api/shoppping-cart/edit-cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, new_quantity: newQuantity }),
      })
      if (handleUnauthorized(res.status)) return
      if (!res.ok) {
        throw new Error('Failed to update quantity')
      }
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    } catch (err) {
      setError('Failed to update quantity')
    }
  }

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('jwt_token')
      const res = await fetch('http://localhost:5000/api/shoppping-cart/remove-from-cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      })
      if (handleUnauthorized(res.status)) return
      if (!res.ok) {
        throw new Error('Failed to remove item')
      }
      setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId))
    } catch (err) {
      setError('Failed to remove item')
    }
  }

  const handleCheckout = () => {
    console.log("handleCheckout called");
    onClose()
    router.push('/checkout')
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {!disableOverlay && (
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
          </Transition.Child>
        )}

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping Cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <p className="text-center text-gray-500">Your cart is empty</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <button
                        type="button"
                        className="w-full bg-teal-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-teal-700 focus:outline-none"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

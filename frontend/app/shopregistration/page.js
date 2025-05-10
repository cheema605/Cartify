"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { User, Mail, Lock, Phone, Home, Store as StoreIcon, FileText } from 'lucide-react';
import Logo from '../../components/Logo';

export default function SellerRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    storeName: "",
    description: "",
    logoUrl: "",
    isSeller: true, // Default true for seller registration
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.logoUrl) {
      setLogoPreview(formData.logoUrl);
    } else {
      setLogoPreview("");
    }
  }, [formData.logoUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if ((name === "password" || name === "confirmPassword") && formData.confirmPassword) {
      if (name === "password" && value !== formData.confirmPassword) {
        setPasswordMatchError("Passwords do not match");
      } else if (name === "confirmPassword" && value !== formData.password) {
        setPasswordMatchError("Passwords do not match");
      } else {
        setPasswordMatchError("");
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setError('Please log in to register as a seller');
        setIsSubmitting(false);
        return;
      }

      // Create store
      const response = await fetch('http://localhost:5000/api/seller/create-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          store_name: formData.storeName,
          store_description: formData.description
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store created successfully
        router.push('/dashboard');
      } else {
        setError(data.message || 'Failed to create store');
      }
    } catch (err) {
      console.error('Error creating store:', err);
      setError('Failed to create store. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] via-[#10102a] to-[#1a1a2e] font-sans px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 animate-fadeIn flex flex-col items-center mt-32">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h2 className="text-3xl md:text-4xl font-extrabold text-teal-700 mt-2 mb-1 tracking-tight">Seller Registration</h2>
          <p className="text-gray-500 text-center text-base md:text-lg">Join Cartify as a seller and grow your business!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* Personal Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-2 flex items-center gap-2"><User className="w-5 h-5" /> Personal Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full text-gray-900"
                  placeholder="First Name"
                  required
                />
              </div>
              {/* Last Name */}
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full text-gray-900"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            {/* Email */}
            <label htmlFor="email" className="block text-gray-800 font-semibold mb-1 ml-1 mt-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full text-gray-900"
                placeholder="Email Address"
                required
              />
            </div>
            {/* Phone Number */}
            <label htmlFor="phoneNumber" className="block text-gray-800 font-semibold mb-1 ml-1 mt-4">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full text-gray-900"
                placeholder="Phone Number"
                required
              />
            </div>
            {/* Address */}
            <label htmlFor="address" className="block text-gray-800 font-semibold mb-1 ml-1 mt-4">Address</label>
            <div className="relative">
              <Home className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full text-gray-900"
                placeholder="Address"
                required
              />
            </div>
          </div>

          {/* Store Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-2 flex items-center gap-2"><StoreIcon className="w-5 h-5" /> Store Info</h3>
            {/* Store Name */}
            <label htmlFor="storeName" className="block text-gray-800 font-semibold mb-1 ml-1 mt-4">Store Name</label>
            <div className="relative">
              <StoreIcon className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full text-gray-900"
                placeholder="Store Name"
                required
              />
            </div>
            {/* Store Description */}
            <label htmlFor="description" className="block text-gray-800 font-semibold mb-1 ml-1 mt-4">Store Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full text-gray-900"
                placeholder="Store Description"
                rows="3"
                required
              />
            </div>
          </div>

          {/* Password Section */}
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-2 flex items-center gap-2"><Lock className="w-5 h-5" /> Set Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full ${passwordMatchError ? "border-red-500" : ""} text-gray-900`}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-3.5 text-sm text-teal-600 hover:text-teal-800 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-teal-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-full ${passwordMatchError ? "border-red-500" : ""} text-gray-900`}
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-3.5 text-sm text-teal-600 hover:text-teal-800 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {passwordMatchError && (
              <p className="text-red-600 text-sm mt-1">{passwordMatchError}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-10 py-3 bg-gradient-to-r from-teal-600 to-blue-500 text-white font-bold rounded-lg shadow-lg transition text-lg flex items-center gap-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-teal-700 hover:to-blue-600'
              }`}
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              )}
              {isSubmitting ? 'Creating Store...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}

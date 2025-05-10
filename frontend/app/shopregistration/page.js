"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }
    // Add form submission logic here (e.g., API integration with Users and Stores table)
    console.log("Form submitted", formData);
    router.push("/success"); // Navigate to success page
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <div className="fixed top-0 left-1/2 z-50 -translate-x-1/2 w-[98vw] max-w-7xl">
        <Navbar />
      </div>

      {/* Form Container */}
      <div className="pt-24 pb-16 px-4 flex justify-center">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 animate-fadeIn">
          <h2 className="text-3xl font-extrabold text-center text-teal-700 mb-8">
            Seller Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div className="flex flex-col">
              <label htmlFor="firstName" className="text-gray-700 font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label htmlFor="lastName" className="text-gray-700 font-semibold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label htmlFor="password" className="text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                  passwordMatchError ? "border-red-500" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-9 text-sm text-teal-600 hover:text-teal-800 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col relative">
              <label htmlFor="confirmPassword" className="text-gray-700 font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                  passwordMatchError ? "border-red-500" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-9 text-sm text-teal-600 hover:text-teal-800 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {passwordMatchError && (
                <p className="text-red-600 text-sm mt-1">{passwordMatchError}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label htmlFor="address" className="text-gray-700 font-semibold mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </div>

            {/* Store Name */}
            <div className="flex flex-col">
              <label htmlFor="storeName" className="text-gray-700 font-semibold mb-2">
                Store Name
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </div>

            {/* Store Description */}
            <div className="flex flex-col">
              <label htmlFor="description" className="text-gray-700 font-semibold mb-2">
                Store Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                rows="3"
                required
              />
            </div>

            {/* Logo URL */}
            <div className="flex flex-col">
              <label htmlFor="logoUrl" className="text-gray-700 font-semibold mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="mt-2 w-32 h-32 object-contain rounded-md border border-gray-300"
                />
              )}
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-teal-700 text-white py-4 text-center">
        <p className="text-sm">© 2025 Cartify. All Rights Reserved.</p>
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

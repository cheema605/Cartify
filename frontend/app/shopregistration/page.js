"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here (e.g., API integration with Users and Stores table)
    console.log("Form submitted", formData);
    router.push("/success"); // Navigate to success page
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#f9f9f9]" style={{ fontFamily: "Times New Roman, Times, serif" }}>
      {/* Fixed Top Task Bar */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-8 md:px-16 py-4 bg-[#106b82] shadow-md z-50">
        <span className="text-2xl font-bold italic tracking-wide">Cartify</span>
        <nav className="hidden md:flex gap-6 text-lg font-medium">
          <a href="#" className="hover:text-gray-300 transition">Home</a>
          <a href="#" className="hover:text-gray-300 transition">Shop</a>
          <a href="#" className="hover:text-gray-300 transition">Rent</a>
          <a href="#" className="hover:text-gray-300 transition">More</a>
        </nav>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-black transition font-medium">
            Help
          </button>
          <button
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>

      {/* Scrollable Form Section */}
      <div
        className="w-full h-full pt-24 pb-16 overflow-y-auto bg-white flex flex-col items-center"
        style={{
          scrollbarWidth: "thin", // Customizes scrollbar width for modern browsers
          scrollbarColor: "#106b82 #f9f9f9", // Optional custom scrollbar colors
        }}
      >
        <div className="w-11/12 max-w-3xl bg-[#157a94] text-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-extrabold text-center tracking-wide mb-6">Seller Registration</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div className="flex flex-col">
              <label htmlFor="firstName" className="text-lg font-medium mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label htmlFor="lastName" className="text-lg font-medium mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-lg font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="text-lg font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-lg font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="text-lg font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                required
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label htmlFor="address" className="text-lg font-medium mb-2">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                required
              />
            </div>

            {/* Store Name */}
            <div className="flex flex-col">
              <label htmlFor="storeName" className="text-lg font-medium mb-2">Store Name</label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                required
              />
            </div>

            {/* Store Description */}
            <div className="flex flex-col">
              <label htmlFor="description" className="text-lg font-medium mb-2">Store Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
                rows="3"
                required
              />
            </div>

            {/* Logo URL */}
            <div className="flex flex-col">
              <label htmlFor="logoUrl" className="text-lg font-medium mb-2">Logo URL</label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300"
              />
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-[#106b82] text-white font-bold rounded-lg hover:bg-[#0e5a6d] transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-[#106b82] text-white py-4 text-center">
        <p className="text-sm">© 2025 Cartify. All Rights Reserved.</p>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        setEmail("");
        setPassword("");

        // Redirect to mode selection page after login
        setTimeout(() => router.push("/mode-selection"), 2000);
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f5f5]">
      {/* Left side - Illustration */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#0e5a6d] to-[#157a94] flex flex-col justify-center items-center p-8 text-white text-center mt-16">
        <h1 className="text-4xl font-bold mb-4">Welcome Back to Cartify!</h1>
        <p className="text-xl mb-8 max-w-md">
          Log in to access your account and continue shopping with ease.
        </p>
        <div className="relative w-full max-w-md h-64">
          <img
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
            alt="Shopping Illustration"
            className="object-contain w-full h-full"
          />
        </div>
        <p className="mt-8 text-sm opacity-80">
          Don't have an account?{' '}
          <Link href="/signup" className="underline font-semibold hover:opacity-90 text-white">
            Sign up here
          </Link>
        </p>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 mt-16">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#0F1516] mb-6">Login to Cartify</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#157a94] mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#157a94] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-[#157a94] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-[#157a94] hover:text-[#0F1516]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label htmlFor="showPassword" className="text-[#157a94] text-sm">
                  Show Password
                </label>
              </div>
              <Link href="/signup" className="text-[#157a94] underline text-sm hover:opacity-90">
                Create a new account
              </Link>
            </div>

            <button
              type="submit"
              disabled={false}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#157a94] to-[#0e5a6d] text-white font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-70"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            © 2025 Cartify Pvt Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

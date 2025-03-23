"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

        // Redirect to homepage or dashboard
        setTimeout(() => router.push("/"), 2000);
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#7F8C94]">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full sm:w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login to Cartify</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black"
              required
            />
          </div>

          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-gray-700 text-sm">Show Password</label>
            </div>
            <Link href="/signup" className="text-blue-500 underline text-sm hover:text-blue-700">
              Create a new account
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-lg hover:from-green-500 hover:to-blue-500 transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-center text-xs">© 2025 Cartify Pvt Ltd. All rights reserved.</p>
      </div>
    </div>
  );
}
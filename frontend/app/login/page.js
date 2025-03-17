"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-green-500 to-blue-400">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full sm:w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login to Cartify</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 absolute top-2 left-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H6m0 0l6 6m-6-6l6-6" />
              </svg>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 absolute top-2 left-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c.64 0 1.268-.122 1.854-.342C15.15 10.333 16 9.315 16 8c0-1.105-.895-2-2-2s-2 .895-2 2c0 1.315.85 2.333 2.146 2.658C13.732 10.878 13.36 11 12 11z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 17c-.74 0-1.435-.153-2.06-.432C8.86 15.944 8 14.663 8 13s.86-2.944 1.94-3.568C11.065 8.608 11.825 8 12 8c.175 0 .935.608 2.06 1.432C15.14 10.056 16 11.337 16 13s-.86 2.944-1.94 3.568C13.435 16.847 12.74 17 12 17z"
                />
              </svg>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 px-3 py-2 border rounded focus:ring focus:ring-blue-200 text-black"
                required
              />
            </div>
          </div>

          <div className="mb-6 text-right">
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

        <p className="mt-6 text-gray-400 text-center text-xs">
          © 2025 Cartify Pvt Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}

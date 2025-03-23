"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoPage() {
  const router = useRouter();

  // Redirect to the signup page after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/signup/page.js");
    }, 3000);

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
      <div className="text-center">
        <img
          src="/images/Cartifylogo.png" // Path to your logo in the public directory
          alt="Cartify Logo"
          className="w-48 h-48 mx-auto"
        />
        <p className="text-white text-xl font-semibold mt-4">Welcome to Cartify!</p>
      </div>
    </div>
  );
}

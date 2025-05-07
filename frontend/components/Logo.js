"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard');

  return (
    <div className="flex items-center cursor-pointer" aria-label="Cartify Logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-8 w-8 ${isDashboardRoute ? 'text-teal-600' : 'text-white'} mr-2`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span className={`text-2xl font-bold tracking-wide select-none ${isDashboardRoute ? 'text-gray-900' : 'text-white'}`}>
        Cartify
      </span>
    </div>
  );
}

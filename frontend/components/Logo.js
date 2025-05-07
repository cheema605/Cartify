"use client";

import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center cursor-pointer" aria-label="Cartify Logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
        />
      </svg>
      <span className="text-white text-2xl font-bold italic tracking-wide select-none">
        Cartify
      </span>
    </div>
  );
}

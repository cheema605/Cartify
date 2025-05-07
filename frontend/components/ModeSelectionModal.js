"use client";

import { useState } from "react";

export default function ModeSelectionModal({ onSelect }) {
  const [selectedMode, setSelectedMode] = useState(null);

  const handleSelect = (mode) => {
    setSelectedMode(mode);
    onSelect(mode);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 font-serif">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#157a94]">Choose Your Mode</h2>
        <div className="flex gap-6 justify-center">
          <div
            onClick={() => handleSelect("buyer")}
            className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 rounded-lg shadow-md transition-transform hover:scale-105 ${
              selectedMode === "buyer" ? "border-[#157a94] bg-[#d0e9f2]" : "border-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4 text-[#157a94]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7V7z" />
            </svg>
            <span className="text-lg font-semibold text-[#157a94]">Buyer</span>
          </div>
          <div
            onClick={() => handleSelect("seller")}
            className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 rounded-lg shadow-md transition-transform hover:scale-105 ${
              selectedMode === "seller" ? "border-[#0e5a6d] bg-[#c6dfe8]" : "border-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4 text-[#0e5a6d]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
            </svg>
            <span className="text-lg font-semibold text-[#0e5a6d]">Seller</span>
          </div>
        </div>
      </div>
    </div>
  );
}

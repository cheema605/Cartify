"use client";

import React, { useEffect, useState } from "react";

export default function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <div className="text-center">
      <span className="text-4xl font-extrabold text-[#157a94]">
        {prefix}{count}{suffix}
      </span>
    </div>
  );
}

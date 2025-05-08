"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import NavbarComponent from "./Navbar";
import CartSlidingPanel from "./CartSlidingPanel";

export default function LayoutWrapper({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const userId = 1; // TODO: Replace with actual logged-in user ID
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isExplorePage = pathname === '/explore';

  useEffect(() => {
    const cartOpenParam = searchParams.get("cartOpen");
    if (cartOpenParam === "true") {
      setCartOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (pathname === "/checkout") {
      setCartOpen(false);
    }
  }, [pathname]);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  return (
    <>
      {!isDashboardRoute && !isExplorePage && <NavbarComponent cartOpen={cartOpen} toggleCart={toggleCart} />}
      <CartSlidingPanel isOpen={cartOpen} onClose={closeCart} userId={userId} disableOverlay={true} />
      {children}
    </>
  );
}

"use client";
import React, { createContext, useContext, useState } from 'react';

const DashboardModeContext = createContext();

export function DashboardModeProvider({ children }) {
  // true = seller mode, false = buyer mode
  const [isSellerMode, setIsSellerMode] = useState(false);

  return (
    <DashboardModeContext.Provider value={{ isSellerMode, setIsSellerMode }}>
      {children}
    </DashboardModeContext.Provider>
  );
}

export function useDashboardMode() {
  const context = useContext(DashboardModeContext);
  if (context === undefined) {
    throw new Error('useDashboardMode must be used within a DashboardModeProvider');
  }
  return context;
} 
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create theme context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // State for theme (light/dark) and accent color
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#3B82F6'); // Default blue

  // Load saved preferences on mount
  useEffect(() => {
    // Only load theme settings if we're in the dashboard
    if (typeof window !== 'undefined' && window.location.pathname.includes('/dashboard')) {
      const savedTheme = localStorage.getItem('dashboard-theme');
      const savedAccent = localStorage.getItem('dashboard-accent-color');
      
      if (savedTheme) setTheme(savedTheme);
      if (savedAccent) setAccentColor(savedAccent);
      
      // Apply theme to dashboard container
      applyTheme(savedTheme || theme, savedAccent || accentColor);
    }
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
    applyTheme(newTheme, accentColor);
  };

  // Function to change accent color
  const changeAccentColor = (color) => {
    setAccentColor(color);
    localStorage.setItem('dashboard-accent-color', color);
    applyTheme(theme, color);
  };

  // Function to apply theme and accent color to dashboard
  const applyTheme = (currentTheme, currentAccent) => {
    // Find dashboard container to apply theme
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (!dashboardContainer) return;

    // Remove existing theme classes
    dashboardContainer.classList.remove('theme-light', 'theme-dark');
    
    // Add current theme class
    dashboardContainer.classList.add(`theme-${currentTheme}`);
    
    // Apply CSS variables for theme colors
    dashboardContainer.style.setProperty('--accent-color', currentAccent);
    
    if (currentTheme === 'dark') {
      dashboardContainer.style.setProperty('--bg-primary', '#121212');
      dashboardContainer.style.setProperty('--bg-secondary', '#1e1e1e');
      dashboardContainer.style.setProperty('--text-primary', '#ffffff');
      dashboardContainer.style.setProperty('--text-secondary', '#a0a0a0');
      dashboardContainer.style.setProperty('--border-color', '#333333');
      dashboardContainer.style.setProperty('--card-bg', '#1e1e1e');
    } else {
      dashboardContainer.style.setProperty('--bg-primary', '#ffffff');
      dashboardContainer.style.setProperty('--bg-secondary', '#f9fafb');
      dashboardContainer.style.setProperty('--text-primary', '#000000');
      dashboardContainer.style.setProperty('--text-secondary', '#4b5563');
      dashboardContainer.style.setProperty('--border-color', '#e5e7eb');
      dashboardContainer.style.setProperty('--card-bg', '#ffffff');
    }
  };

  // Return provider with theme context
  return (
    <ThemeContext.Provider value={{ theme, accentColor, toggleTheme, changeAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 
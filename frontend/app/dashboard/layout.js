'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  BarChart3,
  Package,
  Settings,
  Users,
  ShoppingCart,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardToggle from '@/components/DashboardToggle';
import Navbar from '@/components/Navbar';
import { Sidebar } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/context/ThemeContext";

const sidebarItems = [
  { icon: Store, label: 'Overview', href: '/dashboard' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: BarChart3, label: 'Discounts', href: '/dashboard/discounts' },
  { icon: ShoppingCart, label: 'Orders', href: '/dashboard/orders' },
  { icon: Users, label: 'Customers', href: '/dashboard/customers' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ThemeProvider>
      <div className="dashboard-container min-h-screen">
        <Navbar />
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b z-40 flex items-center justify-between px-4" 
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-opacity-80"
            style={{ color: 'var(--text-primary)' }}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        </div>
        
        {/* Sidebar for mobile and desktop (always fixed below navbar) */}
        <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 transition-transform duration-300 transform
  ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0 lg:top-16 lg:left-0 lg:h-[calc(100vh-4rem)] lg:w-64 lg:fixed`}>
          <Sidebar />
        </div>
        
        {/* Main content - aligned with sidebar and navbar */}
        <main className="pt-24 lg:ml-64">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

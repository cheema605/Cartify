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

const sidebarItems = [
  { icon: Store, label: 'Overview', href: '/dashboard' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/dashboard/orders' },
  { icon: Users, label: 'Customers', href: '/dashboard/customers' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [toggleChecked, setToggleChecked] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <div>
          {pathname === '/dashboard' && (
            <div className="mt-4">
              <DashboardToggle
                checked={toggleChecked}
                onToggle={(checked) => {
                  setToggleChecked(checked);
                  if (!checked) {
                    setTimeout(() => (window.location.href = '/'), 300);
                  }
                }}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-screen bg-white border-r transition-all duration-300',
          'lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1
            className={cn(
              'font-semibold text-xl text-gray-900',
              collapsed ? 'hidden' : 'block'
            )}
          >
            Dashboard
          </h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2.5 transition-colors',
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-teal-600' : 'text-gray-400'
                  )}
                />
                <span
                  className={cn('text-sm font-medium', collapsed ? 'hidden' : 'block')}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          collapsed ? 'lg:ml-20' : 'lg:ml-64',
          'pt-16 lg:pt-0'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

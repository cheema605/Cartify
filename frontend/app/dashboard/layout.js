'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, BarChart3, Package, Settings, Users, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-white shadow-sm transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className={cn('font-bold text-xl', collapsed ? 'hidden' : 'block')}>
            <div className='text-black'>Dashboard</div>
          </h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 hover:bg-gray-100 text-black"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="space-y-1 p-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors',
                  isActive 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-black hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-gray-900' : 'text-gray-400')} />
                <span className={cn('text-sm font-medium', collapsed ? 'hidden' : 'block')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}
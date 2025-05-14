'use client'

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  Percent,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Products', icon: Package, href: '/dashboard/products' },
  { label: 'Orders', icon: ShoppingCart, href: '/dashboard/orders' },
  { label: 'Discounts', icon: Percent, href: '/dashboard/discounts' },
  { label: 'Analytics', icon: BarChart, href: '/dashboard/analytics' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-full border-r px-4 py-6" style={{ 
      backgroundColor: 'var(--bg-primary)', 
      borderColor: 'var(--border-color)'
    }}>
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Seller Dashboard
      </h2>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'font-semibold'
                  : 'hover:opacity-80'
              )}
              style={{ 
                backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-primary)'
              }}
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
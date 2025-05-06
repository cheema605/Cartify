'use client'

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Products', icon: Package, href: '/dashboard/products' },
  { label: 'Orders', icon: ShoppingCart, href: '/dashboard/orders' },
  { label: 'Customers', icon: Users, href: '/dashboard/customers' },
  { label: 'Analytics', icon: BarChart, href: '/dashboard/analytics' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-full bg-white border-r px-4 py-6">
      {/* Suggestion: Make the title darker for better visibility */}
      <h2 className="text-xl font-bold mb-6 text-black">Seller Dashboard</h2>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors', // Base styles + smooth transition
                isActive
                  ? 'bg-gray-100 text-gray-900 font-semibold' // Active state: light bg, dark text, bold
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Inactive state: medium gray text, hover changes bg/text
              )}
            >
              {/* Icon color will inherit from the Link's text color (currentColor) */}
              <item.icon className="h-5 w-5" />
              {/* Span color will inherit from the Link */}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
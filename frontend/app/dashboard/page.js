'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { useState } from 'react';
import DashboardToggle from '@/components/DashboardToggle';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    icon: DollarSign,
    trend: '+20.1% from last month',
    trendUp: true,
  },
  {
    title: 'Products',
    value: '356',
    icon: Package,
    trend: '+12 new products',
    trendUp: true,
  },
  {
    title: 'Orders',
    value: '2,345',
    icon: ShoppingCart,
    trend: '+8.1% from last week',
    trendUp: true,
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    icon: TrendingUp,
    trend: '+2.4% from last week',
    trendUp: true,
  },
];

export default function DashboardPage() {
  const [toggleChecked, setToggleChecked] = useState(true);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      <div className="flex justify-end mb-1 -mt-7">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h2 className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</h2>
                <div className="mt-2 flex items-center text-sm">
                  <span className={`flex items-center ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-teal-50 p-3">
                <stat.icon className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500">Monthly revenue performance</p>
            </div>
            <div className="rounded-full bg-teal-50 p-2">
              <BarChart3 className="h-5 w-5 text-teal-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <div className="flex h-full items-center justify-center text-gray-500">
              Chart placeholder
            </div>
          </div>
        </Card>

        <Card className="col-span-3 p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500">Latest customer orders</p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div
                key={order}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-gray-900">Order #{order}</p>
                  <p className="text-sm text-gray-500">2 items • $59.99</p>
                </div>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                  Processing
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
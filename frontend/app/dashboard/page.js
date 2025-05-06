'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    icon: DollarSign,
    trend: '+20.1% from last month',
  },
  {
    title: 'Products',
    value: '356',
    icon: Package,
    trend: '+12 new products',
  },
  {
    title: 'Orders',
    value: '2,345',
    icon: ShoppingCart,
    trend: '+8.1% from last week',
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    icon: TrendingUp,
    trend: '+2.4% from last week',
  },
];

export default function DashboardPage() {
  return (
    
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 bg-white">
            <div className="flex items-center justify-between text-black">
              <div>
              <p className="text-sm text-black">{stat.title}</p>
                <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
                <p className="mt-2 text-xs text-black">{stat.trend}</p>
              </div>
              <div className="rounded-full bg-gray-200 p-3">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
        <Card className="col-span-4 p-6 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-black">Revenue Overview</h3>
            <BarChart3 className=" h-4 w-4 text-black bg-gray-200 rounded-full" />
          </div>
          <div className="mt-4 h-[240px]">
            <div className="flex h-full items-center justify-center text-black">
              Chart placeholder
            </div>
          </div>
        </Card>

        <Card className="col-span-3 p-6 bg-white">
          <h3 className="text-lg font-medium text-black">Recent Orders</h3>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((order) => (
              <div
                key={order}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 "
              >
                <div>
                  <p className="font-medium text-black">Order #{order}</p>
                  <p className="text-sm text-black ">2 items • $59.99</p>
                </div>
                <span className="rounded-full bg-secondary px-2 py-1 text-xs text-black">
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
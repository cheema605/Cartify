"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, Activity, Users, DollarSign, ShoppingCart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pt-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-black">Analytics Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$45,231.89</div>
            <p className="text-xs text-green-500">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-black">Active Users</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">2,350</div>
            <p className="text-xs text-green-500">+180 new users</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-black">Sales</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">12,234</div>
            <p className="text-xs text-green-500">+19% conversion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-black">Active Sessions</CardTitle>
            <Activity className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">573</div>
            <p className="text-xs text-green-500">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-black" />
              <div className="text-black">Revenue Over Time</div>
            </CardTitle>
            <CardDescription className="text-gray-500">Daily revenue for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              Revenue Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-black" />
              <div className="text-black">Top Products</div>
            </CardTitle>
            <CardDescription className="text-gray-500">Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              Products Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
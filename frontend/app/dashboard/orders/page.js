"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package2, ShoppingCart, Truck } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    product: "Premium Widget",
    status: "Delivered",
    date: "2024-01-15",
    amount: "$129.99"
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    product: "Deluxe Package",
    status: "Processing",
    date: "2024-01-16",
    amount: "$249.99"
  },
  {
    id: "ORD-003",
    customer: "Michael Brown",
    product: "Basic Bundle",
    status: "Shipped",
    date: "2024-01-16",
    amount: "$89.99"
  }
];

const statusIcons = {
  Processing: ShoppingCart,
  Shipped: Truck,
  Delivered: Package2
};

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">156</div>
            <p className="text-xs text-black">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Processing</CardTitle>
            <Package2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">23</div>
            <p className="text-xs text-black">Current active orders</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Delivered</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">124</div>
            <p className="text-xs text-black">Completed this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-black">Recent Orders</CardTitle>
          <CardDescription className="text-gray-500">A list of recent orders from your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Order ID</TableHead>
                <TableHead className="text-black">Customer</TableHead>
                <TableHead className="text-black">Product</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Date</TableHead>
                <TableHead className="text-right text-black">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const StatusIcon = statusIcons[order.status];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-black">{order.id}</TableCell>
                    <TableCell className="text-black">{order.customer}</TableCell>
                    <TableCell className="text-black">{order.product}</TableCell>
                    <TableCell className="flex items-center gap-2 text-black">
                      <StatusIcon className="h-4 w-4 text-gray-500" />
                      {order.status}
                    </TableCell>
                    <TableCell className="text-black">{order.date}</TableCell>
                    <TableCell className="text-right text-black">{order.amount}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

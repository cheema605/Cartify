"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, UserCheck, Search } from "lucide-react";

const customers = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@example.com",
    orders: 12,
    spent: "$1,234.56",
    lastOrder: "2024-01-15",
    status: "Active"
  },
  {
    id: "CUST-002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    orders: 8,
    spent: "$876.32",
    lastOrder: "2024-01-14",
    status: "Active"
  },
  {
    id: "CUST-003",
    name: "Michael Brown",
    email: "m.brown@example.com",
    orders: 5,
    spent: "$432.10",
    lastOrder: "2024-01-10",
    status: "Inactive"
  }
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 pt-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-black">Customers</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium text-black">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">2,345</div>
            <p className="text-xs text-gray-500">+180 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">New Customers</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">145</div>
            <p className="text-xs text-gray-500">+22% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">1,892</div>
            <p className="text-xs text-gray-500">80% of total</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-black">Customer List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers..."
                className="pl-8 bg-white text-black border border-gray-300 focus:border-gray-300 focus:ring-transparent focus:outline-none shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                
                <TableHead className="text-gray-500">Customer ID</TableHead>
                <TableHead className="text-gray-500">Name</TableHead>
                <TableHead className="text-gray-500">Email</TableHead>
                <TableHead className="text-gray-500">Orders</TableHead>
                <TableHead className="text-gray-500">Total Spent</TableHead>
                <TableHead className="text-gray-500">Last Order</TableHead>
                <TableHead className="text-gray-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers
                .filter(
                  (customer) =>
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium text-black">{customer.id}</TableCell>
                    <TableCell className="font-medium text-black">{customer.name}</TableCell>
                    <TableCell className="font-medium text-black">{customer.email}</TableCell>
                    <TableCell className="font-medium text-black">{customer.orders}</TableCell>
                    <TableCell className="font-medium text-black">{customer.spent}</TableCell>
                    <TableCell className="font-medium text-black">{customer.lastOrder}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          customer.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
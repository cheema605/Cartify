"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package2, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';

const statusIcons = {
  Processing: ShoppingCart,
  Shipped: Truck,
  Delivered: Package2
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          setError('Not logged in');
          setLoading(false);
          return;
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user_id = payload.id;
        const response = await fetch('http://localhost:5000/api/sellerStore/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id }),
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (order_id) => {
    setDetailsLoading(true);
    setOrderDetails(null);
    setDetailsOpen(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:5000/api/order/get-order/${order_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      } else {
        setOrderDetails({ error: 'Failed to fetch order details' });
      }
    } catch (err) {
      setOrderDetails({ error: 'Error fetching order details' });
    }
    setDetailsLoading(false);
  };

  const totalOrders = orders.length;
  const processingOrders = orders.filter(order => order.status?.toLowerCase() === 'processing').length;
  const deliveredOrders = orders.filter(order => order.status?.toLowerCase() === 'delivered').length;

  return (
    <div className="space-y-6 pt-24">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalOrders}</div>
            <p className="text-xs text-black">Total orders placed</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Processing</CardTitle>
            <Package2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{processingOrders}</div>
            <p className="text-xs text-black">Current active orders</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Delivered</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{deliveredOrders}</div>
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
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">Order ID</TableHead>
                  <TableHead className="text-black">Buyer Name</TableHead>
                  <TableHead className="text-black">Total Price</TableHead>
                  <TableHead className="text-black">Status</TableHead>
                  <TableHead className="text-black">Order Date</TableHead>
                  <TableHead className="text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">No orders found.</TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-medium text-black">{order.order_id}</TableCell>
                      <TableCell className="text-black">{order.buyer_name}</TableCell>
                      <TableCell className="text-black">{order.total_price}</TableCell>
                      <TableCell className="text-black">{order.status}</TableCell>
                      <TableCell className="text-black">{order.order_date ? new Date(order.order_date).toLocaleDateString() : ''}</TableCell>
                      <TableCell>
                        <button
                          className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                          onClick={() => fetchOrderDetails(order.order_id)}
                        >
                          View Details
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setDetailsOpen(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-black">Order Details</h2>
            {detailsLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : orderDetails && orderDetails.error ? (
              <div className="text-red-500">{orderDetails.error}</div>
            ) : orderDetails ? (
              <>
                <div className="mb-2 text-black">Order ID: {orderDetails.order?.order_id}</div>
                <div className="mb-2 text-black">Buyer ID: {orderDetails.order?.buyer_id}</div>
                <div className="mb-2 text-black">Total Price: {orderDetails.order?.total_price}</div>
                <div className="mb-2 text-black">Status: {orderDetails.order?.status}</div>
                <div className="mb-2 text-black">Order Date: {orderDetails.order?.order_date ? new Date(orderDetails.order.order_date).toLocaleDateString() : ''}</div>
                <div className="mt-4">
                  <h3 className="font-semibold text-black mb-2">Products</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Product ID</TableHead>
                        <TableHead className="text-black">Quantity</TableHead>
                        <TableHead className="text-black">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetails.items?.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-black">{item.product_id}</TableCell>
                          <TableCell className="text-black">{item.quantity}</TableCell>
                          <TableCell className="text-black">{item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  ArrowUpRight,
} from "lucide-react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user_id = payload.id;
        // Fetch products
        const productsRes = await fetch("http://localhost:5000/api/seller/create-store/products", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id }),
        });
        let productsData = [];
        if (productsRes.ok) {
          const data = await productsRes.json();
          productsData = data.products || [];
          setProducts(productsData);
        }
        // Fetch orders
        const ordersRes = await fetch("http://localhost:5000/api/seller/create-store/orders", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id }),
        });
        let ordersData = [];
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          ordersData = data.orders || [];
          setOrders(ordersData);
        }
        // Fetch category sales
        const catSalesRes = await fetch("http://localhost:5000/api/seller/create-store/category-sales", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id }),
        });
        if (catSalesRes.ok) {
          const data = await catSalesRes.json();
          setCategorySales(data || []);
        }
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Calculate total sales
  const totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);

  // Prepare stats
  const stats = [
    {
      title: "Total Sales",
      value: loading ? "..." : `PKR ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
    {
      title: "Products",
      value: loading ? "..." : products.length,
      icon: Package,
    },
    {
      title: "Orders",
      value: loading ? "..." : orders.length,
      icon: ShoppingCart,
    },
  ];

  // Get latest 3 orders
  const recentOrders = orders.slice(0, 3);

  // Prepare bar chart data
  const barData = {
    labels: categorySales.map(cs => cs.category),
    datasets: [
      {
        label: 'Total Sales',
        data: categorySales.map(cs => cs.total_sales),
        backgroundColor: 'rgba(13, 148, 136, 0.7)',
        borderRadius: 6,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { callbacks: { label: ctx => `PKR ${parseFloat(ctx.raw).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` } }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `PKR ${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 0 })}`
        }
      }
    }
  };

  return (
    <div className="space-y-6 ">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h2 className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</h2>
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
              <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
              <p className="text-sm text-gray-500">Total sales per product category</p>
            </div>
            <div className="rounded-full bg-teal-50 p-2">
              <BarChart3 className="h-5 w-5 text-teal-600" />
            </div>
          </div>
          <div className="h-[300px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-gray-500">Loading chart...</div>
            ) : categorySales.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">No sales data.</div>
            ) : (
              <Bar data={barData} options={barOptions} />
            )}
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
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-gray-500">No recent orders.</div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.order_id}</p>
                    <p className="text-sm text-gray-500">{order.total_price ? `Total: PKR ${parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    {order.status || "Processing"}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

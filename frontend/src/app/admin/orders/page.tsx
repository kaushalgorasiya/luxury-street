"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";

interface Order {
  _id: string;
  user: { name: string; email: string };
  products: Array<{ product: { title: string; price: number }; quantity: number }>;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}`, { orderStatus: status });
      alert("Order status updated successfully!");
      fetchOrders();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to update order status"));
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-heading font-bold mb-8">Order Management</h2>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Items</th>
                  <th className="text-left p-4 font-semibold">Total</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-primary">#{order._id.substring(18).toUpperCase()}</td>
                      <td className="p-4">
                        <p className="font-medium">{order.user?.name || "Guest"}</p>
                        <p className="text-xs text-muted-foreground">{order.user?.email || "N/A"}</p>
                      </td>
                      <td className="p-4">{order.products?.length || 0}</td>
                      <td className="p-4 font-bold text-accent">${order.totalAmount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100"}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No orders found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

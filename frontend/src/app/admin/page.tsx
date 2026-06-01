"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import api from "@/lib/axios";

interface DashboardData {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setData(res.data);
      } catch (err: any) {
        setError("Failed to fetch dashboard statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 font-medium text-center p-8">{error}</div>;
  }

  const stats = [
    { title: "Total Revenue", value: `$${data?.totalRevenue.toLocaleString() || "0"}`, icon: <DollarSign className="w-6 h-6 text-accent" /> },
    { title: "Total Orders", value: `${data?.totalOrders || "0"}`, icon: <ShoppingBag className="w-6 h-6 text-primary" /> },
    { title: "Total Products", value: `${data?.totalProducts || "0"}`, icon: <Package className="w-6 h-6 text-blue-500" /> },
    { title: "Total Users", value: `${data?.totalUsers || "0"}`, icon: <Users className="w-6 h-6 text-purple-500" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-heading font-bold mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold font-sans">{stat.value}</h3>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h3 className="text-xl font-bold font-heading mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              data.recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold">Order #{order._id.substring(18).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">{order.user?.name || "Guest"} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${order.totalAmount.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      order.orderStatus === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      order.orderStatus === "Delivered" ? "bg-green-100 text-green-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No recent orders yet</p>
            )}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h3 className="text-xl font-bold font-heading mb-4">Trending Products</h3>
          <div className="space-y-4">
            {data?.topProducts && data.topProducts.length > 0 ? (
              data.topProducts.map((product: any) => (
                <div key={product._id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img src={product.images[0] || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200&auto=format&fit=crop"} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{product.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{product.brand?.name || "Luxury Brand"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Stock: {product.inStock ? "In Stock" : "Out of Stock"}</p>
                    <p className="text-sm font-bold text-accent">${product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

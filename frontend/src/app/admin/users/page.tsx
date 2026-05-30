"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ban, Trash2 } from "lucide-react";
import api from "@/lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to delete user"));
    }
  };

  const handleToggleBlock = async (id: string) => {
    try {
      await api.put(`/users/${id}`);
      alert("User block status updated!");
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to update block status"));
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-heading font-bold mb-8">User Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <h3 className="text-3xl font-bold mt-1">{users.length}</h3>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Status</p>
          <h3 className="text-3xl font-bold mt-1 text-green-600">Active</h3>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Verified</p>
          <h3 className="text-3xl font-bold mt-1 text-accent">100%</h3>
        </div>
      </div>

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
                  <th className="text-left p-4 font-semibold">User</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Role</th>
                  <th className="text-left p-4 font-semibold">Joined</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{user.email}</td>
                      <td className="p-4 uppercase text-xs font-semibold text-accent">{user.role}</td>
                      <td className="p-4 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleToggleBlock(user._id)} className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600 transition-colors cursor-pointer" title="Block User">
                            <Ban className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer" title="Delete User">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No users found.
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

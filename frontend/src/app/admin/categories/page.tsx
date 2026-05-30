"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  image?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name, image });
      alert("Category created successfully!");
      setName("");
      setImage("");
      fetchCategories();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to create category"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to delete category"));
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-heading font-bold mb-8">Category Management</h2>

      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-xl border border-border mb-8 shadow-sm"
      >
        <h3 className="text-xl font-bold font-heading mb-6">Add New Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bags, Clothing, Watches"
              className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        <button type="submit" className="mt-6 flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
          <Plus className="w-5 h-5" /> Create Category
        </button>
      </motion.form>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-xl font-bold font-heading mb-4">All Categories</h3>
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/20">
                <div className="flex items-center gap-3">
                  {c.image && (
                    <img src={c.image} alt={c.name} className="w-10 h-10 object-cover rounded" />
                  )}
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {c._id}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(c._id)} className="p-2 hover:bg-red-50 rounded text-red-500 transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No categories created yet.</p>
        )}
      </div>
    </div>
  );
}

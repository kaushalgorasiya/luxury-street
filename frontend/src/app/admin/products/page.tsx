"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "@/lib/axios";

interface Product {
  _id: string;
  title: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: { _id: string; name: string };
  brand: { _id: string; name: string };
  images: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", price: "", salePrice: "", stock: "", sizes: "", colors: "", tags: "",
    images: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    category: "", brand: ""
  });

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/brands")
      ]);
      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (err) {
      console.error("Failed to load products/categories/brands", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/products", {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock: Number(form.stock),
        images: form.images.split(",").map((s) => s.trim()),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      });
      alert("Product added successfully!");
      setShowForm(false);
      setForm({ title: "", description: "", price: "", salePrice: "", stock: "", sizes: "", colors: "", tags: "", images: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop", category: "", brand: "" });
      fetchData();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to add product"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      alert("Product deleted!");
      fetchData();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to delete product"));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-heading font-bold">Product Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-card p-8 rounded-xl border border-border mb-8 shadow-sm"
        >
          <h3 className="text-xl font-bold font-heading mb-6">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($) *</label>
              <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sale Price ($)</label>
              <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand *</label>
              <select required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
              <input type="text" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
              <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="S, M, L, XL"
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Colors (comma separated)</label>
              <input type="text" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })}
                placeholder="Red, Black, White"
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="luxury, trending, new"
                className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
              Save Product
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Products Table */}
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
                  <th className="text-left p-4 font-semibold">Image</th>
                  <th className="text-left p-4 font-semibold">Product</th>
                  <th className="text-left p-4 font-semibold">Brand</th>
                  <th className="text-left p-4 font-semibold">Category</th>
                  <th className="text-left p-4 font-semibold">Price</th>
                  <th className="text-left p-4 font-semibold">Stock</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded" />
                      </td>
                      <td className="p-4 font-medium">{product.title}</td>
                      <td className="p-4 text-muted-foreground">{product.brand?.name || "N/A"}</td>
                      <td className="p-4 text-muted-foreground">{product.category?.name || "N/A"}</td>
                      <td className="p-4 font-bold text-accent">
                        {product.salePrice ? (
                          <div className="flex gap-2">
                            <span>${product.salePrice}</span>
                            <span className="line-through text-xs text-muted-foreground">${product.price}</span>
                          </div>
                        ) : (
                          <span>${product.price}</span>
                        )}
                      </td>
                      <td className="p-4 font-medium">{product.stock}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer" title="Delete Product">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No products in database yet. Click &quot;Add Product&quot; to create your first product.
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

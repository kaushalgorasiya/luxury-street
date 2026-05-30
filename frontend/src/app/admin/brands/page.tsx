"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";

interface Brand {
  _id: string;
  name: string;
  logo?: string;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data || []);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/brands", { name, logo });
      alert("Brand created successfully!");
      setName("");
      setLogo("");
      fetchBrands();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to create brand"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await api.delete(`/brands/${id}`);
      alert("Brand deleted successfully!");
      fetchBrands();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to delete brand"));
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-heading font-bold mb-8">Brand Management</h2>

      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-xl border border-border mb-8 shadow-sm"
      >
        <h3 className="text-xl font-bold font-heading mb-6">Add New Brand</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gucci, Prada, Louis Vuitton"
              className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.jpg"
              className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        <button type="submit" className="mt-6 flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
          <Plus className="w-5 h-5" /> Create Brand
        </button>
      </motion.form>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-xl font-bold font-heading mb-4">All Brands</h3>
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : brands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((b) => (
              <div key={b._id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/20">
                <div className="flex items-center gap-3">
                  {b.logo && (
                    <img src={b.logo} alt={b.name} className="w-10 h-10 object-cover rounded" />
                  )}
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {b._id}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(b._id)} className="p-2 hover:bg-red-50 rounded text-red-500 transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No brands created yet.</p>
        )}
      </div>
    </div>
  );
}

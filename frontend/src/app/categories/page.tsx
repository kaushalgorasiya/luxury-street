"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const categoriesData = [
  { name: "Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop", count: 85 },
  { name: "Clothing", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", count: 124 },
  { name: "Shoes", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", count: 67 },
  { name: "Watches", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop", count: 43 },
  { name: "Jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop", count: 56 },
  { name: "Perfume", image: "https://images.unsplash.com/photo-1594035910387-fea47714263f?q=80&w=800&auto=format&fit=crop", count: 38 },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop", count: 92 },
  { name: "Sunglasses", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop", count: 31 },
];

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Shop by Category</h1>
          <p className="text-lg opacity-80">Browse our curated collections of luxury fashion</p>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoriesData.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                className="relative h-72 rounded-xl overflow-hidden cursor-pointer group"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-6">
                  <h3 className="text-2xl font-heading font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-white/80 text-sm">{cat.count} Products</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-12 text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-heading font-bold mb-4 text-accent">LUXURY STREET</h3>
          <p className="text-sm opacity-60">&copy; {new Date().getFullYear()} Luxury Street. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

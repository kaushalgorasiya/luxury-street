"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const collections = [
  { name: "Summer 2026", desc: "Breezy elegance for warm days", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop", count: 42 },
  { name: "Evening Wear", desc: "Dazzle at every occasion", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop", count: 28 },
  { name: "Street Luxury", desc: "Casual meets couture", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop", count: 36 },
  { name: "Timeless Classics", desc: "Pieces that never go out of style", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", count: 55 },
  { name: "Accessories Edit", desc: "The finishing touches", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop", count: 64 },
  { name: "Limited Edition", desc: "Exclusive and rare finds", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop", count: 12 },
];

export default function CollectionsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Curated Collections</h1>
          <p className="text-lg opacity-80">Handpicked luxury selections for every occasion</p>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((col, index) => (
              <motion.div
                key={col.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href="/shop" className="block relative h-80 rounded-xl overflow-hidden group cursor-pointer">
                  <img src={col.image} alt={col.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-8">
                    <h3 className="text-2xl font-heading font-bold text-white mb-1">{col.name}</h3>
                    <p className="text-white/70 text-sm mb-2">{col.desc}</p>
                    <span className="text-accent font-medium text-sm">{col.count} Products</span>
                  </div>
                </Link>
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

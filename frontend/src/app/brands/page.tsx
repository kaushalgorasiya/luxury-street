"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const brandsData = [
  { name: "Gucci", logo: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop", products: 45 },
  { name: "Prada", logo: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400&auto=format&fit=crop", products: 38 },
  { name: "Louis Vuitton", logo: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop", products: 52 },
  { name: "Rolex", logo: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=400&auto=format&fit=crop", products: 28 },
  { name: "Cartier", logo: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop", products: 35 },
  { name: "Hermès", logo: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=400&auto=format&fit=crop", products: 41 },
  { name: "Valentino", logo: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=400&auto=format&fit=crop", products: 33 },
  { name: "Saint Laurent", logo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop", products: 29 },
];

export default function BrandsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Luxury Brands</h1>
          <p className="text-lg opacity-80">Shop from the world&apos;s most prestigious fashion houses</p>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {brandsData.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="h-56 relative overflow-hidden">
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-3xl font-heading font-bold text-white tracking-widest">{brand.name.toUpperCase()}</h3>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <p className="text-muted-foreground text-sm">{brand.products} Products</p>
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

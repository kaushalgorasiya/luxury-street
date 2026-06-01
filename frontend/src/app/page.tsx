"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";


interface Product {
  _id: string;
  title: string;
  price: number;
  salePrice?: number;
  brand: { name: string };
  images: string[];
}

const dummyProducts = [
  { _id: "1", title: "Gucci Marmont Velvet Bag", price: 2450, images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"], brand: { name: "Gucci" } },
  { _id: "2", title: "Prada Monochrome Bag", price: 3100, images: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop"], brand: { name: "Prada" } },
  { _id: "3", title: "Classic Trench Coat", price: 1890, images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"], brand: { name: "Burberry" } },
  { _id: "4", title: "Rolex Submariner Date", price: 14500, images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"], brand: { name: "Rolex" } },
  { _id: "5", title: "Silk Evening Gown", price: 4200, images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop"], brand: { name: "Valentino" } },
  { _id: "6", title: "Oud Wood Eau de Parfum", price: 395, images: ["https://images.unsplash.com/photo-1594035910387-fea47714263f?q=80&w=800&auto=format&fit=crop"], brand: { name: "Tom Ford" } },
  { _id: "7", title: "Crystal Embellished Heels", price: 1150, images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"], brand: { name: "Jimmy Choo" } },
  { _id: "8", title: "Classic Leather Loafers", price: 850, images: ["https://images.unsplash.com/photo-1614252339460-e17635c064ee?q=80&w=800&auto=format&fit=crop"], brand: { name: "Ferragamo" } },
  { _id: "9", title: "Diamond Tennis Bracelet", price: 8500, images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"], brand: { name: "Cartier" } },
  { _id: "10", title: "Aviator Classic Sunglasses", price: 250, images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"], brand: { name: "Ray-Ban" } },
  { _id: "11", title: "Leather Moto Jacket", price: 3450, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"], brand: { name: "Saint Laurent" } },
  { _id: "12", title: "Cashmere Scarf", price: 520, images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop"], brand: { name: "Hermès" } },
];

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const items = res.data?.products || [];
        if (items.length > 0) {
          setProducts(items.slice(0, 12));
        } else {
          setProducts(dummyProducts as any);
        }
      } catch (err) {
        console.error("Failed to load products from database, using fallback products.");
        setProducts(dummyProducts as any);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Featured Brands */}
        <section className="py-20 bg-background text-center">
          <h2 className="text-3xl font-heading font-bold mb-10 text-primary uppercase tracking-widest">Featured Brands</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-60">
            <span className="text-2xl font-bold font-heading hover:opacity-100 transition-opacity cursor-pointer">GUCCI</span>
            <span className="text-2xl font-bold font-heading hover:opacity-100 transition-opacity cursor-pointer">PRADA</span>
            <span className="text-2xl font-bold font-heading hover:opacity-100 transition-opacity cursor-pointer">LOUIS VUITTON</span>
            <span className="text-2xl font-bold font-heading hover:opacity-100 transition-opacity cursor-pointer">CHANEL</span>
            <span className="text-2xl font-bold font-heading hover:opacity-100 transition-opacity cursor-pointer">ROLEX</span>
          </div>
        </section>

        {/* Trending Products Grid (12 Items) */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
              <h2 className="text-3xl font-heading font-bold text-primary uppercase tracking-widest text-center sm:text-left w-full sm:w-auto">Trending Collection</h2>
              <Link href="/shop" className="text-accent font-medium hover:underline mx-auto sm:mx-0">View All Products</Link>
            </div>
            
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => router.push(`/product/${item._id}`)}
                    className="bg-card rounded-lg overflow-hidden shadow-sm group border border-border hover:shadow-xl transition-all duration-300 cursor-pointer relative"
                  >
                    <div className="h-80 bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Heart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist({
                            _id: item._id,
                            title: item.title,
                            price: item.price,
                            salePrice: item.salePrice,
                            images: item.images,
                            brand: item.brand,
                          });
                          router.push("/favorites");
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors cursor-pointer z-10"
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(item._id) ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"}`} />
                      </button>

                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart({
                              id: item._id,
                              name: item.title,
                              brand: item.brand?.name || "Luxury Brand",
                              price: item.price,
                              image: item.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
                              size: "One Size"
                            }, 1);
                            router.push("/cart");
                          }}
                          className="bg-accent text-white px-6 py-2 rounded font-medium hover:bg-accent/90 transition-colors cursor-pointer"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>
                    <div className="p-5 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{item.brand?.name || "Luxury Brand"}</p>
                      <h3 className="font-bold text-lg font-heading mb-1 truncate">{item.title}</h3>
                      
                      {(() => {
                        const currentPrice = item.salePrice || item.price;
                        const originalPrice = item.salePrice ? item.price : item.price * 2.7;
                        return (
                          <div className="flex justify-center items-baseline gap-2 mb-4">
                            <span className="font-bold text-accent text-lg">₹ {currentPrice.toLocaleString('en-IN')}</span>
                            <span className="text-sm text-muted-foreground line-through text-gray-400">₹ {Math.round(originalPrice).toLocaleString('en-IN')}</span>
                          </div>
                        );
                      })()}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(`https://wa.me/919274014911?text=Hi, I am interested in buying "${encodeURIComponent(item.title)}". Price: ₹ ${(item.salePrice || item.price).toLocaleString('en-IN')}. Please provide details.`, "_blank");
                        }}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-2 px-4 rounded text-sm font-bold hover:bg-[#20ba5c] transition-all cursor-pointer shadow-sm"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437 0 9.862-4.413 9.865-9.85.001-2.636-1.02-5.115-2.875-6.973C16.408 1.924 13.937.904 11.3.903c-5.438 0-9.863 4.414-9.866 9.852-.001 1.962.509 3.878 1.479 5.551L1.93 22.07l6.027-1.581c-1.63 1.1-2.03.9-1.31-.336z" />
                        </svg>
                        Inquiry On WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

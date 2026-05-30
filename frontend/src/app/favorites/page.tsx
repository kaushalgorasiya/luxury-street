"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function FavoritesPage() {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item._id,
      name: item.title,
      brand: item.brand?.name || "Luxury Brand",
      price: item.salePrice || item.price,
      image: item.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
      size: "One Size"
    }, 1);
    router.push("/cart");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-12 text-center">
          <h1 className="text-4xl font-heading font-bold mb-2">My Favorites</h1>
          <p className="text-sm opacity-80">Your curated collection of premium luxury items</p>
        </section>

        <div className="container mx-auto px-4 py-10">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-heading font-bold mb-2">Your favorites list is empty</h2>
              <p className="text-muted-foreground mb-6">Explore our collections to add items you love.</p>
              <Link href="/shop" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors uppercase tracking-wider text-sm">
                Explore Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl overflow-hidden shadow-sm group border border-border hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
                >
                  <div className="h-80 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={item.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => router.push(`/product/${item._id}`)}
                    />
                    <button 
                      onClick={() => removeFromWishlist(item._id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer"
                      title="Remove from Favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 justify-center">
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                      <Link 
                        href={`/product/${item._id}`} 
                        className="bg-white/95 text-primary px-4 py-2 rounded font-medium hover:bg-white transition-colors text-sm"
                      >
                        View Info
                      </Link>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.brand?.name || "Luxury Brand"}</p>
                      <h3 className="font-bold text-base font-heading mb-2 truncate cursor-pointer hover:text-accent" onClick={() => router.push(`/product/${item._id}`)}>{item.title}</h3>
                    </div>
                    <div className="flex justify-between items-baseline gap-2 mb-3 mt-2">
                      {(() => {
                        const currentPrice = item.salePrice || item.price;
                        const originalPrice = item.salePrice ? item.price : item.price * 2.7;
                        return (
                          <>
                            <span className="font-bold text-accent text-lg">₹ {currentPrice.toLocaleString('en-IN')}</span>
                            <span className="text-sm text-muted-foreground line-through text-gray-400">₹ {Math.round(originalPrice).toLocaleString('en-IN')}</span>
                          </>
                        );
                      })()}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`https://wa.me/919274014911?text=Hi, I am interested in buying "${encodeURIComponent(item.title)}". Price: ₹ ${(item.salePrice || item.price).toLocaleString('en-IN')}. Please provide details.`, "_blank");
                      }}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-2 px-4 rounded text-sm font-bold hover:bg-[#20ba5c] transition-all cursor-pointer shadow-sm mt-2"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437 0 9.862-4.413 9.865-9.85.001-2.636-1.02-5.115-2.875-6.973C16.408 1.924 13.937.904 11.3.903c-5.438 0-9.863 4.414-9.866 9.852-.001 1.962.509 3.878 1.479 5.551L1.93 22.07l6.027-1.581c-1.63 1.1-2.03.9-1.31-.336z" />
                      </svg>
                      Inquiry On WhatsApp
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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

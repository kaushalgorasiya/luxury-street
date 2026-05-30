"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";


interface Product {
  _id: string;
  title: string;
  price: number;
  salePrice?: number;
  images: string[];
  brand?: { name: string };
  category?: { name: string };
}

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>(["All"]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/brands")
        ]);
        
        setProducts(productsRes.data?.products || []);
        
        if (categoriesRes.data) {
          setCategories(["All", ...categoriesRes.data.map((c: any) => c.name)]);
        }
        if (brandsRes.data) {
          setBrands(["All", ...brandsRes.data.map((b: any) => b.name)]);
        }
      } catch (err) {
        console.error("Failed to load shop data from server", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  let filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBrand = selectedBrand === "All" || p.brand?.name === selectedBrand;
    const matchCat = selectedCategory === "All" || p.category?.name === selectedCategory;
    return matchSearch && matchBrand && matchCat;
  });

  if (sortBy === "price_asc") filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  if (sortBy === "price_desc") filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Shop Collection</h1>
          <p className="text-lg opacity-80">Discover our exclusive range of luxury products</p>
        </section>

        <div className="container mx-auto px-4 py-10">
          {/* Search & Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search luxury products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg bg-card hover:bg-secondary transition-colors cursor-pointer">
              <SlidersHorizontal className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mb-8 p-6 bg-card border border-border rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3 text-primary">Brand</h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((b) => (
                      <button key={b} onClick={() => setSelectedBrand(b)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${selectedBrand === b ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-primary">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button key={c} onClick={() => setSelectedCategory(c)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${selectedCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} products found</p>

          {/* Product Grid */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filtered.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl overflow-hidden shadow-sm group border border-border hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-80 bg-gray-100 relative overflow-hidden">
                    <img src={item.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {item.salePrice && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        SALE
                      </span>
                    )}
                    <button
                      onClick={() => {
                        toggleWishlist({
                          _id: item._id,
                          title: item.title,
                          price: item.price,
                          salePrice: item.salePrice,
                          images: item.images,
                          brand: item.brand,
                          category: item.category
                        });
                        router.push("/favorites");
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors cursor-pointer z-10"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(item._id) ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"}`} />
                    </button>
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                      <Link href={`/product/${item._id}`} className="bg-accent text-white px-6 py-2 rounded font-medium hover:bg-accent/90 transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.brand?.name || "Luxury Brand"}</p>
                    <h3 className="font-bold text-base font-heading mb-2 truncate">{item.title}</h3>
                    <div className="flex justify-between items-baseline gap-2 mb-3">
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
      <Footer />
    </>
  );
}

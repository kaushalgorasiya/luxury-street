"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import api from "@/lib/axios";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";


interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  brand?: { name: string };
  category?: { name: string };
}

const dummyProducts = [
  { _id: "1", title: "Gucci Marmont Velvet Bag", price: 2450, images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"], brand: { name: "Gucci" }, description: "Experience Italian elegance with the iconic Gucci Marmont Velvet Bag, featuring luxurious quilting and signature GG hardware.", stock: 10, sizes: ["One Size"], colors: ["#000000", "#7B1FA2"] },
  { _id: "2", title: "Prada Monochrome Bag", price: 3100, images: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop"], brand: { name: "Prada" }, description: "Sleek and sophisticated, the Prada Monochrome Bag represents modern luxury. Made with durable Saffiano leather.", stock: 5, sizes: ["One Size"], colors: ["#000000", "#FFFFFF"] },
  { _id: "3", title: "Classic Trench Coat", price: 1890, images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"], brand: { name: "Burberry" }, description: "The ultimate wardrobe staple: a classic double-breasted trench coat by Burberry, crafted in heritage cotton gabardine.", stock: 8, sizes: ["S", "M", "L", "XL"], colors: ["#D2B48C", "#000000"] },
  { _id: "4", title: "Rolex Submariner Date", price: 14500, images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"], brand: { name: "Rolex" }, description: "The quintessential divers' watch, the Rolex Submariner Date features a robust Oyster case, a ceramic bezel, and chronometer precision.", stock: 2, sizes: ["41mm"], colors: ["#C0C0C0", "#005B41"] },
  { _id: "5", title: "Silk Evening Gown", price: 4200, images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop"], brand: { name: "Valentino" }, description: "A breathtaking Valentino silk evening gown, flowing gracefully to create a dramatic silhouette.", stock: 3, sizes: ["38", "40", "42"], colors: ["#E60000", "#000000"] },
  { _id: "6", title: "Oud Wood Eau de Parfum", price: 395, images: ["https://images.unsplash.com/photo-1594035910387-fea47714263f?q=80&w=800&auto=format&fit=crop"], brand: { name: "Tom Ford" }, description: "One of the most rare, precious, and expensive ingredients in a perfumer's arsenal, oud wood is often burned in incense-filled temples.", stock: 25, sizes: ["50ml", "100ml"], colors: ["#3E2723"] },
  { _id: "7", title: "Crystal Embellished Heels", price: 1150, images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"], brand: { name: "Jimmy Choo" }, description: "Sparkle with every step in these crystal-embellished heels by Jimmy Choo. Expertly made in Italy.", stock: 6, sizes: ["36", "37", "38", "39"], colors: ["#E0F7FA", "#FFFFFF"] },
  { _id: "8", title: "Classic Leather Loafers", price: 850, images: ["https://images.unsplash.com/photo-1614252339460-e17635c064ee?q=80&w=800&auto=format&fit=crop"], brand: { name: "Ferragamo" }, description: "Timeless style and comfort. Ferragamo loafers are crafted from supple calfskin leather and finished with iconic Gancini hardware.", stock: 12, sizes: ["40", "41", "42", "43", "44"], colors: ["#5D4037", "#000000"] },
  { _id: "9", title: "Diamond Tennis Bracelet", price: 8500, images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"], brand: { name: "Cartier" }, description: "A symbol of elegance, this tennis bracelet from Cartier features brilliant-cut diamonds claw-set in 18k white gold.", stock: 1, sizes: ["16cm", "17cm", "18cm"], colors: ["#E0E0E0"] },
  { _id: "10", title: "Aviator Classic Sunglasses", price: 250, images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"], brand: { name: "Ray-Ban" }, description: "One of the most iconic sunglass models in the world. Originally designed for U.S. aviators in 1937.", stock: 50, sizes: ["Standard"], colors: ["#C0C0C0", "#FFD700"] },
  { _id: "11", title: "Leather Moto Jacket", price: 3450, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"], brand: { name: "Saint Laurent" }, description: "Cut from buttery lambskin, this Saint Laurent moto jacket features asymmetric zippers, epaulets, and a belted waist.", stock: 4, sizes: ["S", "M", "L"], colors: ["#000000"] },
  { _id: "12", title: "Cashmere Scarf", price: 520, images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop"], brand: { name: "Hermès" }, description: "Woven in premium cashmere, this Hermès scarf offers unparalleled softness, warmth, and iconic status.", stock: 15, sizes: ["One Size"], colors: ["#FF7A00", "#7B3F00"] }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      name: product.title,
      brand: product.brand?.name || "Luxury Brand",
      price: product.salePrice || product.price,
      image: product.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
      size: selectedSize || "One Size"
    }, quantity);
    router.push("/cart");
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist({
      _id: product._id,
      title: product.title,
      price: product.price,
      salePrice: product.salePrice,
      images: product.images,
      brand: product.brand,
      category: product.category
    });
    router.push("/favorites");
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        if (res.data?.sizes?.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
      } catch (err) {
        console.error("Failed to load product details from API, trying fallback to dummy data", err);
        const fallback = dummyProducts.find((p) => p._id === id);
        if (fallback) {
          setProduct(fallback as any);
          if (fallback.sizes && fallback.sizes.length > 0) {
            setSelectedSize(fallback.sizes[0]);
          }
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-20">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link href="/shop" className="text-accent underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-accent">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto py-6">
            {/* Product Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
              <div className="relative aspect-square w-full bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-4">
                <img
                  src={product.images[selectedImage] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain"
                />
                {product.images.length > 1 && (
                  <>
                    <button onClick={() => setSelectedImage((p) => (p > 0 ? p - 1 : product.images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:bg-white transition-colors cursor-pointer">
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button onClick={() => setSelectedImage((p) => (p < product.images.length - 1 ? p + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:bg-white transition-colors cursor-pointer">
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded border overflow-hidden transition-all cursor-pointer ${selectedImage === i ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Price section */}
              {(() => {
                const currentPrice = product.salePrice || product.price;
                const originalPrice = product.salePrice ? product.price : product.price * 2.7;
                const discountPercentage = product.salePrice 
                  ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                  : 63;
                return (
                  <div className="flex items-baseline gap-2.5 mb-4 mt-2">
                    <span className="text-3xl font-bold text-blue-600">
                      ₹ {currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-400 line-through text-lg font-medium">
                      ₹ {Math.round(originalPrice).toLocaleString('en-IN')}
                    </span>
                    <span className="text-blue-500 font-semibold text-sm">
                      ({discountPercentage}% off)
                    </span>
                  </div>
                );
              })()}

              {/* Availability & Wishlist */}
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4 mt-1">
                <div className="text-sm">
                  <span className="text-gray-500">Availibility</span>
                  <span className="text-blue-600 font-semibold ml-2">: In Stock</span>
                </div>
                <button
                  onClick={handleToggleWishlist}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-blue-600"}`} />
                  Add to wishlist
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Inquiry on WhatsApp */}
              <div className="mb-6">
                <a
                  href={`https://wa.me/919274014911?text=Hi,%20I%20am%20interested%20in%20buying%20"${encodeURIComponent(product.title)}".%20Please%20provide%20more%20details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded text-sm font-bold hover:bg-[#20ba5c] transition-all shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437 0 9.862-4.413 9.865-9.85.001-2.636-1.02-5.115-2.875-6.973C16.408 1.924 13.937.904 11.3.903c-5.438 0-9.863 4.414-9.866 9.852-.001 1.962.509 3.878 1.479 5.551L1.93 22.07l6.027-1.581c-1.63 1.1-2.03.9-1.31-.336z" />
                  </svg>
                  Inquiry On Whatsapp
                </a>
              </div>

              {/* Quantity input */}
              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex items-center border border-gray-300 rounded overflow-hidden h-9">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-12 px-2 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm font-semibold h-full"
                  />
                  <div className="flex flex-col border-l border-gray-300 h-full w-5 justify-between bg-gray-50">
                    <button onClick={() => setQuantity(quantity + 1)} className="hover:bg-gray-200 border-b border-gray-300 text-[8px] flex items-center justify-center flex-1 font-bold">▲</button>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:bg-gray-200 text-[8px] flex items-center justify-center flex-1 font-bold">▼</button>
                  </div>
                </div>
              </div>

              {/* Size Selection (Subtle) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-2">Size</h4>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 text-xs border rounded transition-all cursor-pointer font-medium ${selectedSize === size ? "bg-black text-white border-black" : "border-gray-200 hover:border-gray-400"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-3 rounded font-bold hover:bg-blue-700 transition-all uppercase tracking-wider text-sm cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  Add to Cart
                </button>
                
                <button
                  onClick={() => {
                    handleAddToCart();
                    router.push("/checkout");
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded font-bold hover:bg-neutral-900 transition-all uppercase tracking-wider text-sm cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  Buy Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-12 text-center mt-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-heading font-bold mb-4 text-accent">LUXURY STREET</h3>
          <p className="text-sm opacity-60">&copy; {new Date().getFullYear()} Luxury Street. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User, LogOut, Settings, Heart, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-heading font-bold tracking-wider text-primary">
            <img src="/logo.png" alt="Luxury Street Logo" className="w-10 h-10 object-contain rounded-full" />
            <span className="text-xl font-bold tracking-widest text-[#005B41] font-heading">LUXURY STREET</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
            <Link href="/brands" className="hover:text-accent transition-colors">Brands</Link>
            <Link href="/categories" className="hover:text-accent transition-colors">Categories</Link>
            <Link href="/collections" className="hover:text-accent transition-colors">Collections</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center bg-background border border-border rounded-full px-2 py-1 shadow-sm w-48 md:w-64 absolute right-0 z-10">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-sm px-2 py-1"
                  autoFocus
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="p-1 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:text-accent transition-colors" title="Search">
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Wishlist Link */}
          <Link href="/favorites" className="p-2 hover:text-accent transition-colors relative" title="Favorites">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link href="/cart" className="p-2 hover:text-accent transition-colors relative" title="Shopping Cart">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link href="/admin" className="p-2 hover:text-accent transition-colors flex items-center gap-1 text-xs font-semibold text-accent uppercase tracking-wider bg-accent/10 rounded px-2" title="Admin Panel">
                  <Settings className="w-4 h-4" /> Admin
                </Link>
              )}
              <span className="text-sm font-semibold hidden md:inline text-primary">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button onClick={logout} className="p-2 hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="p-2 hover:text-accent transition-colors" title="Login">
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


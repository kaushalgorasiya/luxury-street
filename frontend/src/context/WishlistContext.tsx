"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WishlistItem {
  _id: string;
  title: string;
  price: number;
  salePrice?: number;
  images: string[];
  brand?: { name: string };
  category?: { name: string };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  toggleWishlist: (product: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("luxury_wishlist");
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist items", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("luxury_wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  const toggleWishlist = (product: WishlistItem) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => item._id === product._id);
      if (exists) {
        return prevItems.filter((item) => item._id !== product._id);
      } else {
        return [...prevItems, product];
      }
    });
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item._id === id);
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

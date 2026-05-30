"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState("");

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 50;
  const total = subtotal + shipping;

  const handleWhatsAppCheckout = () => {
    const number = "919274014911";
    let message = `*New Order from Luxury Street*\n`;
    message += `-----------------------------\n`;
    message += `*Items:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (Size: ${item.size})\n`;
      message += `   Qty: ${item.quantity} - Price: ₹ ${(item.price * item.quantity).toLocaleString('en-IN')}\n\n`;
    });
    
    message += `-----------------------------\n`;
    message += `*Subtotal:* ₹ ${subtotal.toLocaleString('en-IN')}\n`;
    message += `*Shipping:* ${shipping === 0 ? "Free" : `₹ ${shipping}`}\n`;
    message += `*Total Amount:* *₹ ${total.toLocaleString('en-IN')}*\n`;
    message += `-----------------------------\n`;
    message += `Please confirm my order. Thank you!`;

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-12 text-center">
          <h1 className="text-4xl font-heading font-bold">Shopping Cart</h1>
        </section>

        <div className="container mx-auto px-4 py-10">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything yet.</p>
              <Link href="/shop" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 bg-card p-6 rounded-xl border border-border"
                  >
                    <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.brand}</p>
                      <h3 className="font-bold text-lg font-heading">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button onClick={() => updateCartQuantity(item.id, item.size, -1)} className="p-2 hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.size, 1)} className="p-2 hover:bg-secondary transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-accent">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-card p-8 rounded-xl border border-border h-fit sticky top-24">
                <h3 className="text-xl font-heading font-bold mb-6">Order Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹ {subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : `₹ ${shipping}`}</span></div>
                  <div className="border-t border-border pt-4 flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold text-accent">₹ {total.toLocaleString('en-IN')}</span></div>
                </div>

                {/* Coupon */}
                <div className="mt-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button className="px-4 py-2 bg-secondary text-foreground rounded-lg font-medium text-sm hover:bg-secondary/80 transition-colors">Apply</button>
                </div>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Proceed to Checkout
                </button>
                <Link href="/shop" className="mt-3 block text-center text-sm text-muted-foreground hover:text-accent transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

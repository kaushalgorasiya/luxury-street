"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-12 text-center">
          <h1 className="text-4xl font-heading font-bold">Checkout</h1>
        </section>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Shipping Address */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card p-8 rounded-xl border border-border">
              <h3 className="text-xl font-heading font-bold mb-6">Shipping Address</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input type="text" className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input type="text" className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input type="text" className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input type="text" className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input type="text" className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Zip Code</label>
                    <input type="text" className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input type="text" className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-heading font-bold mt-10 mb-6">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input type="radio" name="payment" value="cod" defaultChecked className="text-accent" />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input type="radio" name="payment" value="razorpay" className="text-accent" />
                  <span className="font-medium">Razorpay</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input type="radio" name="payment" value="stripe" className="text-accent" />
                  <span className="font-medium">Stripe</span>
                </label>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card p-8 rounded-xl border border-border h-fit sticky top-24">
              <h3 className="text-xl font-heading font-bold mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex gap-4 border-b border-border pb-4">
                  <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=200&auto=format&fit=crop" alt="Product" className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold">Gucci Marmont Velvet Bag</p>
                    <p className="text-sm text-muted-foreground">Qty: 1</p>
                  </div>
                  <p className="font-bold text-accent">$1,999</p>
                </div>
                <div className="flex gap-4 border-b border-border pb-4">
                  <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200&auto=format&fit=crop" alt="Product" className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold">Crystal Embellished Heels</p>
                    <p className="text-sm text-muted-foreground">Qty: 1</p>
                  </div>
                  <p className="font-bold text-accent">$1,150</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">$3,149</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold text-green-600">Free</span></div>
                <div className="border-t border-border pt-4 flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold text-accent">$3,149</span></div>
              </div>
              <button className="mt-6 w-full py-4 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors uppercase tracking-wider text-lg">
                Place Order
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}

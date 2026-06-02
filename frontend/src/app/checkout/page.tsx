"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user ? user.name.split(" ")[0] : "",
    lastName: user && user.name.split(" ").length > 1 ? user.name.split(" ")[1] : "",
    email: user ? user.email : "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "cod"
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0; // Free shipping
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user: user ? user._id || (user as any).id : undefined,
        guestName: !user ? `${formData.firstName} ${formData.lastName}` : undefined,
        guestEmail: !user ? formData.email : undefined,
        products: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentStatus: formData.paymentMethod === "cod" ? "Pending" : "Paid",
        orderStatus: "Pending"
      };

      await api.post("/orders", orderData);
      
      alert("Order placed successfully!");
      clearCart();
      router.push("/");
    } catch (err: any) {
      alert("Error placing order: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold font-heading mb-4">Your cart is empty</h2>
          <button onClick={() => router.push("/shop")} className="px-6 py-2 bg-primary text-white rounded">
            Return to Shop
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-20">
        <section className="bg-primary text-primary-foreground py-12 text-center">
          <h1 className="text-4xl font-heading font-bold">Checkout</h1>
        </section>

        <div className="container mx-auto px-4 py-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Shipping Address */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card p-8 rounded-xl border border-border">
              <h3 className="text-xl font-heading font-bold mb-6">Contact & Shipping</h3>
              <div className="space-y-4">
                {!user && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address *</label>
                  <input type="text" name="street" required value={formData.street} onChange={handleInputChange} className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Zip Code *</label>
                    <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country *</label>
                    <input type="text" name="country" required value={formData.country} onChange={handleInputChange} className="w-full px-3 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-heading font-bold mt-10 mb-6">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleInputChange} className="text-accent" />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input type="radio" name="paymentMethod" value="razorpay" checked={formData.paymentMethod === "razorpay"} onChange={handleInputChange} className="text-accent" />
                  <span className="font-medium">Razorpay (Demo)</span>
                </label>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card p-8 rounded-xl border border-border h-fit sticky top-24">
              <h3 className="text-xl font-heading font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-border pb-4 last:border-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-accent">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">${subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold text-green-600">Free</span></div>
                <div className="border-t border-border pt-4 flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold text-accent">${total.toLocaleString()}</span></div>
              </div>
              <button disabled={loading} type="submit" className="mt-6 w-full py-4 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors uppercase tracking-wider text-lg disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Processing..." : "Place Order"}
              </button>
            </motion.div>
          </form>
        </div>
      </main>
    </>
  );
}

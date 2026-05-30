"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[90vh] flex items-center justify-center bg-secondary py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-card p-10 rounded-xl shadow-lg border border-border"
        >
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold font-heading text-primary">
              Create an Account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Join Luxury Street for an exclusive experience
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-accent hover:text-accent/80">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}

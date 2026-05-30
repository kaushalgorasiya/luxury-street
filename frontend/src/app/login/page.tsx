"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
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
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Sign in to access your luxury account
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-accent focus:ring-accent border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-accent hover:text-accent/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-accent hover:text-accent/80">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}

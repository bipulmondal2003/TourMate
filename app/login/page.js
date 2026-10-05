"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/shared/AuthShell";

function dashboardPathFor(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "GUIDE") return "/guide-dashboard";
  return "/dashboard";
}

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = await login(form.email, form.password);
    setLoading(false);
    if (!data.success) {
      setError(data.message);
      return;
    }
    router.push(next || dashboardPathFor(data.user.role));
  };

  return (
    <AuthShell>
      <div className="card p-8">
        <h1 className="text-2xl font-extrabold mb-1">Welcome back</h1>
        <p className="text-sm text-charcoal/60 dark:text-white/60 mb-6">Log in to continue to TourMate.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          <div className="text-right -mt-2">
            <Link href="/forgot-password" className="text-xs text-gold-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Log In
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-charcoal/60 dark:text-white/60">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 text-xs text-charcoal/50 dark:text-white/50">
          <p className="font-semibold mb-1">Demo accounts:</p>
          <p>Admin: admin@example.com</p>
          <p>Guide: guide@example.com</p>
          <p>Tourist: tourist@example.com</p>
          <p>Password: Demo@1234</p>
        </div>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-sm text-charcoal/50">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/shared/AuthShell";

function dashboardPathFor(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "GUIDE") return "/guide-dashboard";
  return "/dashboard";
}

function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "GUIDE" ? "GUIDE" : "TOURIST";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
    location: "",
    pricePerDay: "",
    pricePerHour: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = await register(form);
    setLoading(false);
    if (!data.success) {
      setError(data.message);
      return;
    }
    router.push(dashboardPathFor(data.user.role));
  };

  return (
    <AuthShell>
      <div className="card p-8">
        <h1 className="text-2xl font-extrabold mb-1">Create your account</h1>
        <p className="text-sm text-charcoal/60 dark:text-white/60 mb-6">Join TourMate as a tourist or a guide.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="I want to join as" value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value="TOURIST">Tourist — I want to book guides</option>
            <option value="GUIDE">Guide — I want to offer tours</option>
          </Select>

          <Input label="Full Name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />

          {form.role === "GUIDE" && (
            <>
              <Input
                label="Primary Location"
                required
                placeholder="e.g. Amritsar, Punjab"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Price / Day (₹)"
                  type="number"
                  required
                  value={form.pricePerDay}
                  onChange={(e) => update("pricePerDay", e.target.value)}
                />
                <Input
                  label="Price / Hour (₹)"
                  type="number"
                  required
                  value={form.pricePerHour}
                  onChange={(e) => update("pricePerHour", e.target.value)}
                />
              </div>
              <p className="text-xs text-charcoal/50 dark:text-white/50">
                Your guide profile will be reviewed by an admin before you can accept bookings.
              </p>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-charcoal/60 dark:text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-sm text-charcoal/50">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

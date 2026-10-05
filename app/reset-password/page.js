"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthShell from "@/components/shared/AuthShell";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) {
      setError(data.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <AuthShell>
      <div className="card p-8">
        <h1 className="text-2xl font-extrabold mb-1">Reset password</h1>
        <p className="text-sm text-charcoal/60 dark:text-white/60 mb-6">Enter your reset token and a new password.</p>
        {success ? (
          <p className="text-green-600 font-semibold">Password reset! Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Reset Token" required value={token} onChange={(e) => setToken(e.target.value)} />
            <Input
              label="New Password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" loading={loading} className="w-full">
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-sm text-charcoal/50">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

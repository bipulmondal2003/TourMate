"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthShell from "@/components/shared/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [demoToken, setDemoToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message);
    if (data.demoResetToken) setDemoToken(data.demoResetToken);
  };

  return (
    <AuthShell>
      <div className="card p-8">
        <h1 className="text-2xl font-extrabold mb-1">Forgot password</h1>
        <p className="text-sm text-charcoal/60 dark:text-white/60 mb-6">
          Enter your email and we&apos;ll help you reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" loading={loading} className="w-full">
            Send reset link
          </Button>
        </form>
        {message && <p className="text-sm mt-4 text-charcoal/70 dark:text-white/70">{message}</p>}
        {demoToken && (
          <div className="mt-4 p-3 rounded-lg bg-gold-500/10 text-sm">
            <p className="font-semibold mb-1">Demo mode token:</p>
            <p className="break-all font-mono text-xs">{demoToken}</p>
            <Link href={`/reset-password?token=${demoToken}`} className="text-gold-600 font-semibold hover:underline block mt-2">
              Continue to reset password →
            </Link>
          </div>
        )}
      </div>
    </AuthShell>
  );
}

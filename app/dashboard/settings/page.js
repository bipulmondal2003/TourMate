"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function TouristSettingsPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/users/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) {
      setError(data.message);
      return;
    }
    setMessage(data.message);
    setForm({ currentPassword: "", newPassword: "" });
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-extrabold mb-6">Settings</h1>
      <div className="card p-6">
        <h2 className="font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            required
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
          <Input
            type="password"
            label="New Password"
            required
            minLength={6}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <Button type="submit" loading={loading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}

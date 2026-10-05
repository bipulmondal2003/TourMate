"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import { useAuth } from "@/context/AuthContext";

export default function TouristProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", avatar: user?.avatar || "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    const res = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setSaved(true);
      await refreshUser();
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-extrabold mb-6">My Profile</h1>
      <div className="card p-6 space-y-5">
        <div>
          <p className="font-bold">{user?.name}</p>
          <p className="text-sm text-charcoal/60 dark:text-white/60">{user?.email}</p>
        </div>

        <ImageUpload
          label="Profile Photo"
          value={form.avatar}
          onChange={(url) => setForm({ ...form, avatar: url })}
          folder="tourmate/avatars"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {saved && <p className="text-sm text-green-600">Profile updated!</p>}
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}

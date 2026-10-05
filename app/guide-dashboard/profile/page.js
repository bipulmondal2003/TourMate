"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

const LANGUAGE_OPTIONS = ["English", "Hindi", "Punjabi", "French", "Spanish", "German"];
const SPECIALTY_OPTIONS = ["Heritage", "Adventure", "Food", "Wildlife", "Spiritual", "Nightlife"];

export default function GuideProfilePage() {
  const { user, refreshUser } = useAuth();
  const [guide, setGuide] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/guides/me");
      const data = await res.json();
      if (data.success) {
        setGuide(data.guide);
        setForm({
          name: data.guide.user?.name || "",
          avatar: data.guide.user?.avatar || "",
          coverImage: data.guide.coverImage || "",
          bio: data.guide.bio || "",
          location: data.guide.location || "",
          experience: data.guide.experience || 0,
          pricePerDay: data.guide.pricePerDay || 0,
          pricePerHour: data.guide.pricePerHour || 0,
          languages: data.guide.languages || [],
          specialties: data.guide.specialties || [],
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const toggleArrayField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const { name, avatar, coverImage, ...guideFields } = form;
    const res = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar, guideFields: { ...guideFields, coverImage } }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setSaved(true);
      await refreshUser();
    }
  };

  if (loading || !form) return <LoadingSpinner full />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold mb-6">Guide Profile</h1>
      <div className="card p-6 space-y-5">
        <div>
          <p className="font-bold">{user?.name}</p>
          <p className="text-sm text-charcoal/60 dark:text-white/60">{user?.email}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <ImageUpload
            label="Profile Photo"
            value={form.avatar}
            onChange={(url) => setForm({ ...form, avatar: url })}
            folder="tourmate/avatars"
          />
          <ImageUpload
            label="Cover Photo"
            round={false}
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            folder="tourmate/covers"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

          <div className="grid grid-cols-3 gap-3">
            <Input
              type="number"
              label="Experience (yrs)"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />
            <Input
              type="number"
              label="Price / Day"
              value={form.pricePerDay}
              onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
            />
            <Input
              type="number"
              label="Price / Hour"
              value={form.pricePerHour}
              onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
            />
          </div>

          <div>
            <label className="label-field">Languages</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => toggleArrayField("languages", l)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    form.languages.includes(l)
                      ? "bg-navy-900 text-white border-navy-900 dark:bg-gold-500 dark:text-navy-950 dark:border-gold-500"
                      : "border-black/10 dark:border-white/10"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-field">Specialties / Categories</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleArrayField("specialties", s)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    form.specialties.includes(s)
                      ? "bg-navy-900 text-white border-navy-900 dark:bg-gold-500 dark:text-navy-950 dark:border-gold-500"
                      : "border-black/10 dark:border-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {saved && <p className="text-sm text-green-600">Profile updated!</p>}
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}

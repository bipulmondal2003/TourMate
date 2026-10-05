"use client";

import { useEffect, useState } from "react";
import { Tag, Trash2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (data.success) setCategories(data.categories);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setSaving(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    await load();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="card p-5 flex gap-3 mb-8">
        <Input label="Category Name" required value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
        <Button type="submit" loading={saving} className="self-end">
          Add
        </Button>
      </form>

      {loading ? (
        <LoadingSpinner full />
      ) : categories.length === 0 ? (
        <EmptyState icon={Tag} title="No categories yet" />
      ) : (
        <div className="card divide-y divide-black/5 dark:divide-white/5">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-4">
              <p className="font-semibold text-sm">{c.name}</p>
              <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-full">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

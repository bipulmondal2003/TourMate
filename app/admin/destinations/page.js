"use client";

import { useEffect, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({ name: "", state: "", description: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/destinations");
    const data = await res.json();
    if (data.success) setDestinations(data.destinations);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    await fetch("/api/admin/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", state: "", description: "", image: "" });
    await load();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/destinations?id=${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Manage Destinations</h1>

      <form onSubmit={handleSubmit} className="card p-5 grid sm:grid-cols-2 gap-3 mb-8">
        <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <div className="sm:col-span-2">
          <ImageUpload
            label="Destination Photo"
            round={false}
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="tourmate/destinations"
          />
        </div>
        <Input
          label="Description"
          className="sm:col-span-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button type="submit" loading={saving} className="sm:col-span-2">
          Add Destination
        </Button>
      </form>

      {loading ? (
        <LoadingSpinner full />
      ) : destinations.length === 0 ? (
        <EmptyState icon={MapPin} title="No destinations yet" />
      ) : (
        <div className="card divide-y divide-black/5 dark:divide-white/5">
          {destinations.map((d) => (
            <div key={d._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-sm">{d.name}</p>
                <p className="text-xs text-charcoal/50 dark:text-white/50">{d.state}</p>
              </div>
              <button onClick={() => handleDelete(d._id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-full">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

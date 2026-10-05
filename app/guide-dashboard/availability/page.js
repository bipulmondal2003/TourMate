"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { CalendarClock } from "lucide-react";
import { formatDate } from "@/utils/format";

export default function AvailabilityPage() {
  const [guideId, setGuideId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const guideRes = await fetch("/api/guides/me").then((r) => r.json());
      if (guideRes.success) {
        setGuideId(guideRes.guide._id);
        const availRes = await fetch(`/api/guides/${guideRes.guide._id}/availability`).then((r) => r.json());
        if (availRes.success) setAvailability(availRes.availability);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !guideId) return;
    setSaving(true);
    const res = await fetch(`/api/guides/${guideId}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, isAvailable }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setAvailability((prev) => {
        const others = prev.filter((a) => a.date !== data.availability.date);
        return [...others, data.availability].sort((a, b) => new Date(a.date) - new Date(b.date));
      });
      setDate("");
    }
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold mb-6">Manage Availability</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 mb-8">
        <Input
          type="date"
          label="Date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={isAvailable} onChange={() => setIsAvailable(true)} /> Available
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={!isAvailable} onChange={() => setIsAvailable(false)} /> Blocked
          </label>
        </div>
        <Button type="submit" loading={saving}>
          Save
        </Button>
      </form>

      <h2 className="font-bold mb-3">Upcoming Availability</h2>
      {availability.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No availability set" message="Add dates above to let tourists know when you're free." />
      ) : (
        <div className="card divide-y divide-black/5 dark:divide-white/5">
          {availability.map((a) => (
            <div key={a._id} className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">{formatDate(a.date)}</span>
              <span className={`text-xs font-semibold ${a.isAvailable ? "text-green-600" : "text-red-600"}`}>
                {a.isAvailable ? "Available" : "Blocked"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, MapPin, Clock } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/utils/format";

const INTEREST_OPTIONS = ["Heritage", "Adventure", "Food", "Wildlife", "Spiritual", "Nightlife"];

export default function TripPlannerPage() {
  const [form, setForm] = useState({
    destination: "",
    days: 3,
    budget: 15000,
    people: 2,
    interests: [],
    travelStyle: "Balanced",
  });
  const [plan, setPlan] = useState(null);
  const [planNote, setPlanNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPlan(null);
    try {
      const res = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPlan(data.plan);
      setPlanNote(data.note || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold flex items-center justify-center gap-2">
          <Sparkles className="text-gold-500" /> AI Trip Planner
        </h1>
        <p className="text-charcoal/60 dark:text-white/60 mt-1">Get a personalized day-by-day itinerary in seconds.</p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4 h-fit">
          <Input
            label="Destination"
            required
            placeholder="e.g. Manali, Himachal Pradesh"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label="Number of Days"
              min={1}
              max={14}
              value={form.days}
              onChange={(e) => setForm({ ...form, days: e.target.value })}
            />
            <Input
              type="number"
              label="Number of People"
              min={1}
              value={form.people}
              onChange={(e) => setForm({ ...form, people: e.target.value })}
            />
          </div>
          <Input
            type="number"
            label="Total Budget (₹)"
            min={1000}
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />
          <Select label="Travel Style" value={form.travelStyle} onChange={(e) => setForm({ ...form, travelStyle: e.target.value })}>
            {["Relaxed", "Balanced", "Packed"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <div>
            <label className="label-field">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    form.interests.includes(i)
                      ? "bg-navy-900 text-white border-navy-900 dark:bg-gold-500 dark:text-navy-950 dark:border-gold-500"
                      : "border-black/10 dark:border-white/10"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Generate Itinerary
          </Button>
        </form>

        <div>
          {loading && <LoadingSpinner full />}
          {!loading && !plan && (
            <div className="card p-10 text-center text-charcoal/50 dark:text-white/50">
              Fill in the form to generate your personalized itinerary.
            </div>
          )}
          {plan && (
            <div className="space-y-6">
              {plan.source === "gemini" ? (
                <div className="text-xs px-3 py-2 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 inline-block">
                  Generated live by Gemini
                </div>
              ) : (
                <div className="text-xs px-3 py-2 rounded-lg bg-gold-500/10 text-gold-700 dark:text-gold-400 inline-block">
                  {planNote || "Demo itinerary generator (no Gemini API key configured)"}
                </div>
              )}
              <div className="card p-5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg flex items-center gap-1">
                    <MapPin size={16} /> {plan.destination}
                  </p>
                  <p className="text-sm text-charcoal/60 dark:text-white/60">
                    {plan.days} days · {plan.people} people
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-charcoal/50 dark:text-white/50">Estimated total</p>
                  <p className="font-bold text-xl">{formatCurrency(plan.totalEstimatedCost)}</p>
                </div>
              </div>

              {plan.itinerary.map((day) => (
                <div key={day.day} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">
                      Day {day.day}: {day.theme}
                    </h3>
                    <span className="text-sm font-semibold">{formatCurrency(day.estimatedDayCost)}</span>
                  </div>
                  <div className="space-y-2">
                    {day.activities.map((act, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm border-b border-black/5 dark:border-white/5 pb-2 last:border-0">
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="text-gold-600" /> {act.time} — {act.activity}
                        </span>
                        <span className="text-charcoal/50 dark:text-white/50">{formatCurrency(act.estimatedCost)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Link href={`/guides?search=${encodeURIComponent(plan.destination)}`} className="btn-secondary w-full">
                Find a Guide for This Trip
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

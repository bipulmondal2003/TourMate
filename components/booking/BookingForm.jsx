"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/format";

/**
 * Fully controlled React form. Local state holds every field;
 * the estimated total shown here is for UX only — the server
 * recalculates and enforces the real price.
 */
export default function BookingForm({ guide }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    durationHours: 4,
    numberOfPeople: 1,
    category: "General",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const estimatedTotal = useMemo(() => {
    const hours = Number(form.durationHours) || 0;
    const people = Number(form.numberOfPeople) || 1;
    const base =
      hours >= 8 ? Math.ceil(hours / 8) * guide.pricePerDay : hours * guide.pricePerHour;
    const surcharge = base * 0.1 * Math.max(0, people - 1);
    return Math.round(base + surcharge);
  }, [form.durationHours, form.numberOfPeople, guide]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      router.push(`/login?next=/booking/${guide._id}`);
      return;
    }
    if (!form.date || !form.startTime) {
      setError("Please select a date and start time.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideId: guide._id, ...form }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/bookings/${data.booking._id}`), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
          className="h-14 w-14 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4"
        >
          <CheckCircle2 size={28} className="text-green-600" />
        </motion.div>
        <h3 className="font-bold text-lg text-green-600 mb-1">Booking request sent!</h3>
        <p className="text-sm text-charcoal/60 dark:text-white/60">Redirecting to your booking...</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-7 space-y-4 shadow-glow">
      <h3 className="font-bold text-lg tracking-tight">Book {guide.user?.name}</h3>

      <Input
        type="date"
        name="date"
        label="Date"
        value={form.date}
        min={new Date().toISOString().split("T")[0]}
        onChange={handleChange}
        required
      />
      <Input type="time" name="startTime" label="Start Time" value={form.startTime} onChange={handleChange} required />

      <div className="grid grid-cols-2 gap-3">
        <Select name="durationHours" label="Duration (hours)" value={form.durationHours} onChange={handleChange}>
          {[2, 4, 6, 8, 12].map((h) => (
            <option key={h} value={h}>
              {h} hours
            </option>
          ))}
        </Select>
        <Input
          type="number"
          name="numberOfPeople"
          label="Number of People"
          min={1}
          value={form.numberOfPeople}
          onChange={handleChange}
        />
      </div>

      <Select name="category" label="Tour Category" value={form.category} onChange={handleChange}>
        {["General", "Heritage", "Adventure", "Food", "Wildlife", "Spiritual", "Nightlife"].map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <div>
        <label className="label-field" htmlFor="notes">
          Notes for the guide (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="input-field min-h-[80px]"
          placeholder="Anything the guide should know..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
        <div>
          <p className="text-xs text-charcoal/50 dark:text-white/50">Estimated total</p>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={estimatedTotal}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-xl text-gradient"
            >
              {formatCurrency(estimatedTotal)}
            </motion.p>
          </AnimatePresence>
        </div>
        <Button type="submit" loading={submitting}>
          {isAuthenticated ? "Request Booking" : "Login to Book"}
        </Button>
      </div>
      <p className="text-xs text-charcoal/40 dark:text-white/40">
        Final price is confirmed by the server and may include applicable surcharges.
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo contact form — no backend persistence required for this endpoint.
    setSubmitted(true);
  };

  return (
    <div className="container-page py-16 max-w-lg">
      <h1 className="text-3xl font-extrabold mb-2">Contact Us</h1>
      <p className="text-charcoal/60 dark:text-white/60 mb-8">Have a question? Send us a message.</p>

      {submitted ? (
        <div className="card p-6 text-center text-green-600 font-semibold">
          Thanks for reaching out! We&apos;ll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Textarea
            label="Message"
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      )}
    </div>
  );
}

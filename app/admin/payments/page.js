"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/utils/format";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) setPayments(data.payments);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Payments</h1>
      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-charcoal/50 dark:text-white/50 border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="p-3">Tourist</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-black/5 dark:border-white/5 last:border-0">
                  <td className="p-3">{p.tourist?.name}</td>
                  <td className="p-3 capitalize">{p.provider}</td>
                  <td className="p-3 font-mono text-xs">{p.orderId}</td>
                  <td className="p-3">
                    <Badge status={p.status} />
                  </td>
                  <td className="p-3 font-semibold">{formatCurrency(p.amount)}</td>
                  <td className="p-3">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

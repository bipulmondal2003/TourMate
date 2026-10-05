"use client";

import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/format";

const TABS = ["pending", "approved", "rejected", "suspended", "all"];

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = async (status) => {
    setLoading(true);
    const params = status !== "all" ? `?status=${status}` : "";
    const res = await fetch(`/api/admin/guides${params}`);
    const data = await res.json();
    if (data.success) setGuides(data.guides);
    setLoading(false);
  };

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const updateStatus = async (guideId, status) => {
    setActionId(guideId);
    await fetch("/api/admin/guides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guideId, status }),
    });
    await load(tab);
    setActionId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4">Manage Guides</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap ${
              tab === t ? "bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-950" : "bg-black/5 dark:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner full />
      ) : guides.length === 0 ? (
        <EmptyState icon={UserCheck} title="No guides here" />
      ) : (
        <div className="card divide-y divide-black/5 dark:divide-white/5">
          {guides.map((g) => (
            <div key={g._id} className="flex items-center gap-3 p-4 flex-wrap">
              <Avatar name={g.user?.name} src={g.user?.avatar} size={40} />
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-sm">{g.user?.name}</p>
                <p className="text-xs text-charcoal/50 dark:text-white/50">
                  {g.location} · {formatCurrency(g.pricePerDay)}/day
                </p>
              </div>
              <Badge status={g.status} />
              {g.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" loading={actionId === g._id} onClick={() => updateStatus(g._id, "approved")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" loading={actionId === g._id} onClick={() => updateStatus(g._id, "rejected")}>
                    Reject
                  </Button>
                </div>
              )}
              {g.status === "approved" && (
                <Button size="sm" variant="danger" loading={actionId === g._id} onClick={() => updateStatus(g._id, "suspended")}>
                  Suspend
                </Button>
              )}
              {(g.status === "suspended" || g.status === "rejected") && (
                <Button size="sm" variant="outline" loading={actionId === g._id} onClick={() => updateStatus(g._id, "approved")}>
                  Reinstate
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

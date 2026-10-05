"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.success) setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSuspend = async (user) => {
    setActionId(user._id);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, isSuspended: !user.isSuspended }),
    });
    await load();
    setActionId(null);
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Manage Users</h1>
      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <div className="card divide-y divide-black/5 dark:divide-white/5">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-3 p-4 flex-wrap">
              <Avatar name={u.name} src={u.avatar} size={40} />
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-sm">{u.name}</p>
                <p className="text-xs text-charcoal/50 dark:text-white/50">{u.email}</p>
              </div>
              <Badge status="default">{u.role}</Badge>
              {u.isSuspended && <Badge status="rejected">Suspended</Badge>}
              <Button
                size="sm"
                variant={u.isSuspended ? "outline" : "danger"}
                loading={actionId === u._id}
                onClick={() => toggleSuspend(u)}
              >
                {u.isSuspended ? "Unsuspend" : "Suspend"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

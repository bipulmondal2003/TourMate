"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import NotificationItem from "@/components/dashboard/NotificationItem";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function GuideNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
      setLoading(false);
    }
    load();
  }, []);

  const handleClick = async (n) => {
    if (!n.isRead) await fetch(`/api/notifications/${n._id}`, { method: "PATCH" });
    if (n.link) router.push(n.link);
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" />
      ) : (
        <div className="card divide-y divide-black/5 dark:divide-white/5">
          {notifications.map((n) => (
            <NotificationItem key={n._id} {...n} onClick={() => handleClick(n)} />
          ))}
        </div>
      )}
    </div>
  );
}

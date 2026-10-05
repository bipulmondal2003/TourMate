import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl" />
        <div className="relative h-16 w-16 rounded-2xl card flex items-center justify-center">
          <Icon size={26} className="text-gold-600" />
        </div>
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-1">{title}</h3>
      {message && <p className="text-sm text-charcoal/60 dark:text-white/60 max-w-sm mb-5 leading-relaxed">{message}</p>}
      {action}
    </div>
  );
}

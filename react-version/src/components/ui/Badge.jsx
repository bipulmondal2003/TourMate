const COLORS = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60",
  refunded: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60",
  default: "bg-navy-900/10 text-navy-900 dark:bg-white/10 dark:text-white",
};

export default function Badge({ status, children }) {
  const colorClass = COLORS[status] || COLORS.default;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${colorClass}`}>
      {children || status}
    </span>
  );
}

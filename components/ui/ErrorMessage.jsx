import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message = "Something went wrong. Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Something went wrong</h3>
      <p className="text-sm text-charcoal/60 dark:text-white/60 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline">
          Try again
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24 text-center max-w-lg mx-auto">
      <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
        <AlertTriangle size={30} className="text-red-600" />
      </div>
      <h1 className="text-3xl font-extrabold mb-2">Something went wrong</h1>
      <p className="text-charcoal/60 dark:text-white/60 mb-8">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => reset()} className="btn-primary">Try again</button>
        <Link href="/" className="btn-secondary">Back to home</Link>
      </div>
    </div>
  );
}

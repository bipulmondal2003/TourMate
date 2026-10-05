import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata = { title: "Page not found | TourMate" };

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center max-w-lg mx-auto">
      <div className="h-16 w-16 mx-auto rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
        <Compass size={30} className="text-gold-600" />
      </div>
      <h1 className="text-4xl font-extrabold mb-2">Lost your way?</h1>
      <p className="text-charcoal/60 dark:text-white/60 mb-8">
        We couldn&apos;t find the page you were looking for. It may have moved, or the link may be wrong.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/guides" className="btn-secondary">Browse guides</Link>
      </div>
    </div>
  );
}

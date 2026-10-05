export default function TermsPage() {
  return (
    <div className="container-page py-16 max-w-3xl prose-sm">
      <h1 className="text-3xl font-extrabold mb-6">Terms of Service</h1>
      <div className="space-y-4 text-sm text-charcoal/70 dark:text-white/70">
        <p>TourMate is provided as an academic demonstration project. All guides, bookings, payments and reviews in the seeded/demo dataset are fictional.</p>
        <p><strong>Bookings:</strong> Booking requests are subject to guide confirmation. Prices are calculated server-side and are final upon confirmation.</p>
        <p><strong>Payments:</strong> When Razorpay is not configured, the platform runs in Demo Payment Mode and no real transaction occurs.</p>
        <p><strong>Conduct:</strong> Users must not submit false information, harassing messages, or fraudulent reviews.</p>
        <p>This document is for demonstration purposes only and is not a legally binding agreement.</p>
      </div>
    </div>
  );
}

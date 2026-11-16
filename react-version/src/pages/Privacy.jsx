export default function PrivacyPage() {
  return (
    <div className="container-page py-16 max-w-3xl prose-sm">
      <h1 className="text-3xl font-extrabold mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-charcoal/70 dark:text-white/70">
        <p>This is an academic demo project. No real personal data collection or third-party sharing occurs in production use of this codebase beyond what is necessary to run the demo (account credentials, booking details).</p>
        <p><strong>Data we store:</strong> name, email, hashed password, bookings, reviews and messages you create while using the demo.</p>
        <p><strong>Data we never store:</strong> plaintext passwords, real payment card details, or Razorpay secrets on the client.</p>
        <p><strong>Cookies:</strong> a single httpOnly session cookie is used to keep you signed in.</p>
        <p>For a real production deployment, this page should be replaced with a policy reviewed by legal counsel.</p>
      </div>
    </div>
  );
}

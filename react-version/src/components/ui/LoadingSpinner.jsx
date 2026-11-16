export default function LoadingSpinner({ size = 32, full = false }) {
  const spinner = (
    <div
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className="spinner-ring"
    />
  );
  if (!full) return spinner;
  return <div className="flex items-center justify-center py-20">{spinner}</div>;
}

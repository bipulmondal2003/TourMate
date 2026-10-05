"use client";

export default function Textarea({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-field">
          {label}
        </label>
      )}
      <textarea id={inputId} className={`input-field min-h-[100px] ${error ? "border-red-500" : ""} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

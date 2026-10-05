"use client";

export default function Input({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-field">
          {label}
        </label>
      )}
      <input id={inputId} className={`input-field ${error ? "border-red-500" : ""} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

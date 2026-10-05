"use client";

export default function Select({ label, error, className = "", id, children, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-field">
          {label}
        </label>
      )}
      <select id={inputId} className={`input-field ${error ? "border-red-500" : ""} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

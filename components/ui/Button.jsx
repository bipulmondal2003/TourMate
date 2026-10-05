"use client";

import { useRef, useCallback } from "react";

const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
  danger: "inline-flex items-center justify-center gap-2 rounded-full bg-red-600 text-white px-5 py-2.5 font-medium hover:bg-red-700 transition-colors disabled:opacity-50",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  icon: Icon,
  magnetic = true,
  ...props
}) {
  const ref = useRef(null);
  const sizeClass = size === "sm" ? "text-sm px-4 py-2" : size === "lg" ? "text-base px-6 py-3" : "";

  const onMouseMove = useCallback(
    (e) => {
      if (!magnetic || loading || props.disabled) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.2}px, ${dy * 0.25}px)`;
    },
    [magnetic, loading, props.disabled]
  );

  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`magnetic ${VARIANTS[variant]} ${sizeClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, X, ImageOff } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

/**
 * Uploads directly to Cloudinary via /api/upload. Shows a graceful
 * disabled state if Cloudinary isn't configured on the server, instead
 * of letting every user hit a failing upload.
 */
export default function ImageUpload({ value, onChange, label, round = true, folder = "tourmate" }) {
  const inputRef = useRef(null);
  const [configured, setConfigured] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/upload/status")
      .then((r) => r.json())
      .then((d) => setConfigured(Boolean(d.configured)))
      .catch(() => setConfigured(false));
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (configured === false) {
    return (
      <div className="flex items-center gap-3">
        {value ? (
          <Avatar name="Image" src={value} size={56} />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-charcoal/40 dark:text-white/40">
            <ImageOff size={18} />
          </div>
        )}
        <p className="text-xs text-charcoal/50 dark:text-white/50">
          {label || "Image uploads"} aren&apos;t available — Cloudinary isn&apos;t configured on this server.
        </p>
      </div>
    );
  }

  return (
    <div>
      {label && <label className="label-field">{label}</label>}
      <div className="flex items-center gap-4">
        <div className={`relative h-16 w-16 shrink-0 overflow-hidden ${round ? "rounded-full" : "rounded-xl"} bg-black/5 dark:bg-white/10`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-charcoal/30 dark:text-white/30">
              <Upload size={18} />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || configured === null}
              className="btn-outline text-xs px-3 py-1.5 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : value ? "Change" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-red-600 flex items-center gap-1 px-2 hover:underline"
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

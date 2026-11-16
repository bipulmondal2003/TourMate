import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The React app has NO backend of its own. Every `fetch("/api/...")` is forwarded to the
// existing Next.js app, so the browser only ever talks to one origin (no CORS, and the
// httpOnly login cookie keeps working exactly like in the Next.js version).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const api = {
    "/api": {
      target: env.VITE_API_PROXY_TARGET || "http://localhost:3000",
      changeOrigin: true,
    },
  };

  return {
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(__dirname, "src") } },
    server: { port: 5173, proxy: api },
    preview: { port: 4173, proxy: api },
  };
});

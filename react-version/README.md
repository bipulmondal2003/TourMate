# TourMate - React + Vite frontend

A second, standalone frontend for TourMate built with **React 18 + Vite + React Router**.
It has **no backend of its own**: it consumes the JSON API of the Next.js app in the repo root,
so both frontends share one backend and one MongoDB database.

```
React (Vite)  ──fetch('/api/...')──►  Next.js Route Handlers (app/api)  ──►  MongoDB
Next.js UI    ──fetch('/api/...')──►  (same API)
```

| | Next.js version (repo root) | React version (`react-version/`) |
|---|---|---|
| Rendering | Server + Client Components, SSR | Client-side rendering (SPA) |
| Routing | App Router (`app/**/page.js`) | React Router (`src/App.jsx`) |
| Backend | Next.js Route Handlers | The same Next.js API (via proxy) |
| Dev port | 3000 | 5173 |

## Run locally

Two terminals:

```bash
# 1) backend + Next.js app (repo root)
npm install
cp .env.example .env.local     # set MONGODB_URI and AUTH_SECRET
npm run seed
npm run dev                    # http://localhost:3000

# 2) React app
cd react-version
npm install
npm run dev                    # http://localhost:5173
```

Demo logins are the same as the Next.js app (`admin@`, `guide@`, `tourist@example.com` / `Demo@1234`).

### How the API connection works

`vite.config.js` proxies every `/api/*` request to `http://localhost:3000`. The browser therefore
only talks to the React origin, which means no CORS setup and the `httpOnly` login cookie works
unchanged. To develop against the deployed backend instead, create `react-version/.env.local`:

```
VITE_API_PROXY_TARGET=https://tour-mate-beta.vercel.app
```

## Build and deploy (Vercel)

1. Create a **second Vercel project** from the same GitHub repo.
2. Set **Root Directory** to `react-version` (framework preset: Vite).
3. `vercel.json` rewrites `/api/*` to the deployed Next.js app and everything else to `index.html`
   (SPA fallback). If your Next.js deployment URL differs from `https://tour-mate-beta.vercel.app`,
   edit it in `react-version/vercel.json`.
4. No environment variables are required (optional: `VITE_GOOGLE_MAPS_API_KEY`).

The original Next.js Vercel project keeps Root Directory = repo root and is unaffected.

## Project structure

```
react-version/
├── index.html            # fonts, meta tags, theme bootstrap (replaces app/layout.js <head>)
├── vite.config.js        # alias @ -> src, /api proxy
├── vercel.json           # production API rewrite + SPA fallback
└── src/
    ├── main.jsx          # providers: Router, Theme, Auth
    ├── App.jsx           # every route in one place
    ├── layouts/          # MainLayout (navbar/footer), Tourist/Guide/Admin dashboard layouts
    ├── pages/            # one file per route (dashboard/, guide/, admin/ sub-folders)
    ├── components/       # same UI components as the Next version
    ├── context/          # AuthContext, ThemeContext
    ├── hooks/            # useFetch, useFavorites, ...
    └── utils/            # format.js, loadRazorpayScript.js
```

## What changed compared with the Next.js code

| Next.js | React + Vite |
|---|---|
| `app/**/page.js` | `src/pages/**.jsx` + `<Route>` in `App.jsx` |
| `app/**/layout.js` | `src/layouts/*.jsx` using `<Outlet />` |
| `"use client"` | removed (everything is client-side) |
| `next/link` `<Link href>` | `react-router-dom` `<Link to>` |
| `useRouter().push/replace/back` | `useNavigate()` |
| `usePathname()` | `useLocation().pathname` |
| `useParams`, `useSearchParams` | same names from `react-router-dom` |
| Server Components querying Mongoose (`/`, `/destinations`, `/destinations/[id]`) | client pages calling `/api/destinations`, `/api/guides` |
| `notFound()` / `not-found.js` / `error.js` | `*` route + `pages/NotFound.jsx` + `ErrorBoundary` |
| `process.env.NEXT_PUBLIC_*` | `import.meta.env.VITE_*` |
| `<Suspense>` around `useSearchParams` | not needed, removed |
| scroll-to-top on navigation (built in) | `components/shared/ScrollToTop.jsx` |

UI components, Tailwind theme, animations and all API calls are unchanged.

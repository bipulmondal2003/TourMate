# TourMate

**"Explore the World With Someone Who Knows It Best."**

TourMate is a full-stack tour guide booking platform built with **Next.js (App Router)** and **MongoDB**. It connects tourists with verified local guides and supports search, booking with server-calculated pricing, in-app chat, reviews, favorites, an admin panel, and an AI trip planner.

## Overview

TourMate is a three-sided marketplace:

- **Tourists** discover and filter guides, book tours, chat with guides, pay for confirmed bookings, and leave reviews.
- **Guides** register, get approved by an admin, manage availability, handle bookings, and track earnings and reviews.
- **Admins** approve guides, moderate reviews, manage destinations and categories, and monitor bookings, payments and reports.

## Features

- **Authentication**: register (Tourist/Guide), login, logout, password reset, profile management
- **Guide discovery**: search, filter (language, category, price, rating), sort, pagination
- **Guide profiles**: bio, experience, languages, specialties, price, rating, reviews, availability
- **Booking**: server-side price calculation, double-booking prevention, full status lifecycle (pending → confirmed/rejected → completed/cancelled)
- **Payments**: Razorpay integration with a Demo Payment Mode fallback
- **Reviews**: only after a completed booking; admin moderation
- **Favorites**: save and manage favorite guides
- **Chat**: polling-based messaging between tourist and guide
- **Notifications**: booking, payment, message, review and approval events
- **Dashboards**: separate Tourist, Guide and Admin dashboards
- **AI Trip Planner**: day-by-day itineraries via Gemini, with a local rule-based fallback
- **UI/UX**: responsive layout, light/dark mode, water/glass visual theme, Framer Motion animations, custom cursor (desktop only), and full `prefers-reduced-motion` support

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide React |
| Backend | Next.js Route Handlers |
| Database | MongoDB with Mongoose |
| Auth | JWT in httpOnly cookies, bcryptjs |
| Payments | Razorpay (optional) |
| Images | Cloudinary (optional) |
| Maps | Google Maps (optional) |
| AI | Google Gemini (optional) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local install or a free MongoDB Atlas cluster)

### Installation

```bash
git clone <your-repo-url>
cd tourmate
npm install
cp .env.example .env.local
```

### Environment Variables

Only `MONGODB_URI` and `AUTH_SECRET` are required. Missing integrations automatically fall back to demo mode.

```env
MONGODB_URI=mongodb://localhost:27017/tourmate
AUTH_SECRET=replace-with-a-long-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

| Integration | With keys | Without keys |
|---|---|---|
| Cloudinary | Real image uploads | Upload control is hidden |
| Razorpay | Real orders and signature verification | Labeled Demo Payment Mode |
| Google Maps | Live embedded map | Plain location card |
| Gemini | AI-generated itinerary | Local rule-based itinerary |

### Seed the Database

```bash
npm run seed
```

Clears existing data and inserts destinations, categories, 12 demo guides (2 left `pending` to demo approval), sample bookings/reviews, and the demo accounts below.

### Run

```bash
npm run dev        # development at http://localhost:3000
npm run build      # production build
npm start          # run production build
```

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel (framework preset: Next.js, no custom build settings needed).
2. In **Vercel → Project → Settings → Environment Variables** add (for Production, and Preview if you use it):

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `MONGODB_URI` | Yes | Atlas connection string. **Include the database name** (`.../tourmate?...`). Server-only. |
| `AUTH_SECRET` | Yes | Long random string. The app refuses to sign/verify logins in production without it. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Your deployed URL, e.g. `https://tour-mate-beta.vercel.app` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Optional | Image uploads |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Optional | Real payments (demo mode otherwise) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | Baked in at build time, so redeploy after changing it |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Optional | AI trip planner (local fallback otherwise) |

3. In **MongoDB Atlas → Network Access** allow `0.0.0.0/0` (Vercel's outbound IPs are not fixed).
4. Redeploy after changing any environment variable. Runtime errors appear in **Vercel → Project → Logs**.

> `npm run seed` ERASES existing data. It refuses to run against a non-localhost database unless you pass `npm run seed -- --yes`.

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | `Demo@1234` |
| Guide | guide@example.com | `Demo@1234` |
| Tourist | tourist@example.com | `Demo@1234` |

## Project Structure

```text
tourmate/
├── app/                  # Pages and API routes (App Router)
│   ├── api/              # Route Handlers (backend)
│   ├── dashboard/        # Tourist dashboard
│   ├── guide-dashboard/  # Guide dashboard
│   ├── admin/            # Admin panel
│   ├── layout.js         # Root layout
│   └── globals.css       # Tailwind base + design tokens
├── components/
│   ├── ui/               # Reusable primitives (Button, Modal, Badge, ...)
│   ├── navbar/, shared/  # Navbar, Footer, ProtectedRoute
│   ├── guides/, booking/ # Domain components
│   ├── dashboard/, admin/
│   ├── chat/
│   ├── home/             # Homepage sections
│   ├── effects/, motion/ # Background, cursor and animation components
├── context/              # AuthContext, ThemeContext
├── hooks/                # useFetch, useDebounce, useFavorites, useMouseGlow
├── models/               # 13 Mongoose schemas
├── lib/                  # db, auth, API response helpers, admin guard
├── services/             # Notification service
├── utils/                # pricing, validators, formatting
├── scripts/seed.js       # Demo data seeder
└── public/
```

## Architecture

```text
React UI (Client & Server Components)
   ↓  fetch('/api/...')  /  direct Mongoose queries in Server Components
Next.js Route Handlers (app/api/**/route.js)
   ↓
Mongoose Models (models/*.js)
   ↓
MongoDB
```

Interactive pages talk to the backend through the JSON API under `app/api/`. A few read-heavy public pages (`/`, `/destinations`) are Server Components that query MongoDB directly for fast first paint.

## Booking Flow

1. Tourist fills the booking form (date, time, duration, people, category).
2. Server verifies the guide is approved, checks for conflicting bookings, and computes the price from the guide's stored rates.
3. Booking is created as `pending` and the guide is notified.
4. Guide accepts or rejects it.
5. Tourist pays for a confirmed booking (Razorpay or Demo mode).
6. Guide marks the tour completed, which unlocks the review form.

## API Reference

All endpoints return `{ success: boolean, message?, ...data }`. 🔒 = authentication required.

### Auth
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | 🔒 |
| GET | `/api/auth/me` | 🔒 |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password` | Public |

### Guides
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/guides` | Public |
| GET | `/api/guides/[id]` | Public |
| GET | `/api/guides/me` | 🔒 Guide |
| GET/POST | `/api/guides/[id]/availability` | Public / 🔒 Guide |
| GET | `/api/guides/[id]/reviews` | Public |

### Bookings
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/bookings` | 🔒 Tourist |
| GET | `/api/bookings` | 🔒 |
| GET | `/api/bookings/[id]` | 🔒 Owner/Admin |
| POST | `/api/bookings/[id]/accept` | 🔒 Guide |
| POST | `/api/bookings/[id]/reject` | 🔒 Guide |
| POST | `/api/bookings/[id]/cancel` | 🔒 Owner |
| POST | `/api/bookings/[id]/complete` | 🔒 Guide |

### Reviews, Favorites, Payments, Notifications, Chat
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/reviews` | 🔒 Tourist |
| PATCH/DELETE | `/api/reviews/[id]` | 🔒 Admin |
| GET/POST | `/api/favorites`, `/api/favorites/[guideId]` | 🔒 Tourist |
| POST | `/api/payments/create-order` | 🔒 |
| POST | `/api/payments/verify` | 🔒 |
| GET | `/api/notifications` | 🔒 |
| PATCH | `/api/notifications/[id]` | 🔒 |
| GET/POST | `/api/conversations` | 🔒 |
| GET/POST | `/api/messages` | 🔒 |

### Destinations, Categories, Trip Planner
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/destinations`, `/api/destinations/[id]` | Public |
| GET | `/api/categories` | Public |
| POST | `/api/trip-planner` | Public |

### Admin (all protected by `requireAdmin()`)
| Method | Endpoint |
|---|---|
| GET/PATCH | `/api/admin/users` |
| GET/PATCH | `/api/admin/guides` |
| GET | `/api/admin/bookings` |
| GET | `/api/admin/reviews` |
| GET/POST/PATCH/DELETE | `/api/admin/destinations` |
| GET/POST/DELETE | `/api/admin/categories` |
| GET | `/api/admin/payments` |
| GET | `/api/admin/reports` |

## Database Models

`User`, `Guide`, `Booking`, `Availability`, `Review`, `Payment`, `Favorite`, `Conversation`, `Message`, `Notification`, `Destination`, `TourCategory`, `Report`

Relationships use Mongoose `ObjectId` references (e.g. `Booking.guide → Guide`, `Guide.user → User`).

## Security

- Passwords hashed with `bcryptjs`; hashes are excluded from queries by default.
- Signed JWT stored in an `httpOnly`, `sameSite=lax` cookie.
- Roles are always read from the verified JWT on the server (`requireAuth`, `requireRole`, `requireAdmin`), never from request bodies.
- Ownership checks on booking actions, availability and profile edits.
- Server-side double-booking prevention and price calculation; client totals are never trusted.
- Razorpay payment signatures are verified server-side with HMAC.
- Secrets are read only from `process.env` in server code; `.env.local` is git-ignored.

## Known Limitations

- Chat uses 4-second polling, not WebSockets.
- Razorpay supports INR only.
- Cloudinary, Razorpay, Google Maps and Gemini are implemented but should be tested with your own sandbox credentials before production use.
- Seed data is entirely fictional.

## Roadmap

- Real-time chat via WebSockets
- Email notifications and password reset emails
- Guide payout automation and multi-currency support
- Automated tests (Jest, React Testing Library, API integration tests)

## License

This project is for demonstration purposes. All guides, bookings and reviews in the seed data are fictional.

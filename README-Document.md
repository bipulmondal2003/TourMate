# TourMate

**"Explore the World With Someone Who Knows It Best."**

TourMate is a full-stack **ReactJS (Next.js App Router)** tour guide booking platform built as an
academic project for a ReactJS subject. It connects tourists with local tour guides — supporting
search & filtering, booking with server-calculated pricing, in-app messaging, reviews, favorites,
a role-based admin panel, and an AI-style trip planner with a local demo fallback.

---

## 1. Project Overview

TourMate is a three-sided marketplace:

- **Tourists** discover, filter, and book verified local guides, chat with them, pay for
  confirmed bookings, and leave reviews after their tour.
- **Guides** register, get approved by an admin, manage their availability, accept/reject/complete
  bookings, and track their earnings and reviews.
- **Admins** approve or reject guide applications, moderate reviews, manage destinations and
  categories, and monitor platform-wide bookings, payments and reports.

While the app is a complete full-stack product (Next.js Route Handlers + MongoDB), the **primary
academic focus is ReactJS** — every page is built from small, reusable, prop-driven components
using hooks, context, controlled forms, and conditional rendering, as detailed in Section 7 below.

## 2. Problem Statement

Independent local tour guides have no easy way to reach travelers online, and travelers have no
single trusted place to discover, compare and book local guides with transparent pricing. TourMate
solves this by providing a marketplace with guide verification, transparent server-calculated
pricing, secure booking/payment flows, and a review system that builds trust on both sides.

## 3. Objectives

- Build a role-based (Tourist / Guide / Admin) booking platform end-to-end.
- Demonstrate strong, idiomatic use of core React concepts (components, props, hooks, context,
  forms, conditional rendering) throughout a real application.
- Implement secure authentication, authorization, and server-side price/booking validation.
- Provide graceful demo/fallback modes for every optional third-party integration (payments,
  images, maps, AI) so the whole app is fully demonstrable without any paid API keys.

## 4. Features

- **Authentication** — register (Tourist/Guide), login, logout, forgot/reset password (demo flow),
  profile management, secure password hashing.
- **Guide discovery** — search, filter (language, category, price, rating), sort, pagination.
- **Guide profiles** — bio, experience, languages, specialties, price, rating, reviews, availability.
- **Booking** — controlled multi-field form, server-side price calculation, double-booking
  prevention, full status lifecycle (pending → confirmed/rejected → completed/cancelled).
- **Payments** — Razorpay integration structure with a clearly labeled **Demo Payment Mode**
  fallback when no credentials are configured.
- **Reviews** — tourists can review a guide only after a completed booking; admins can moderate.
- **Favorites** — save/remove/view favorite guides.
- **Chat** — polling-based in-app messaging between tourist and guide.
- **Notifications** — booking, payment, message, review and guide-approval events.
- **Dashboards** — separate Tourist, Guide and Admin dashboards with role-specific sub-pages.
- **Admin panel** — user suspension, guide approval, destination/category management, payments and
  platform-wide reports.
- **AI Trip Planner** — generates a day-by-day itinerary; falls back to a local rule-based
  generator when no AI API key is configured.
- **UI/UX** — responsive, light/dark mode, loading/empty/error states, accessible forms.
- **Liquid Glass design system** — frosted translucent cards (`backdrop-filter: blur + saturate`),
  an aurora background of slowly-drifting gradient blobs with mouse parallax, a cursor spotlight
  that eases toward the pointer, magnetic hover on buttons/CTAs, and hover-triggered glass sheen —
  all built with a single `requestAnimationFrame` mouse listener (`hooks/useMouseGlow.js`) and
  respecting `prefers-reduced-motion`. See Section 8a below.

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Next.js 14 (App Router), JavaScript, Tailwind CSS, Framer Motion, Lucide React icons |
| Backend | Next.js Route Handlers (no separate Express server) |
| Database | MongoDB with Mongoose ODM |
| Authentication | Custom JWT + httpOnly cookie sessions, bcrypt password hashing |
| Payments | Razorpay (optional) with a built-in Demo Payment Mode |
| Images | Cloudinary (optional) with placeholder/demo image fallback |
| Maps | Google Maps (optional) with a location-card fallback |
| AI | Pluggable AI API (optional) with a local demo itinerary generator fallback |

## 6. Why React?

React was chosen because it is the subject of this academic project and because its component
model maps naturally onto a marketplace UI made of many repeating, data-driven pieces (guide
cards, booking cards, review cards, dashboard cards, notification items). React's hooks
(`useState`, `useEffect`, `useContext`) let the UI stay reactive to server data and user
interaction without manual DOM manipulation, and the App Router's mix of Server and Client
Components lets fast, data-heavy pages (like the homepage) render on the server while
interactive pages (search, booking, dashboards) run fully client-side.

## 7. React Concepts Demonstrated

| React Concept | Implementation |
|---|---|
| Functional Components | Every UI piece — `Navbar`, `GuideCard`, `BookingForm`, etc. — `components/` |
| Props | `GuideCard`, `DestinationCard`, `ReviewCard`, `BookingCard`, `DashboardCard` all receive data purely via props |
| useState | Search input, filters, booking form, modal visibility, login/register forms, chat input — throughout `app/` |
| useEffect | Data fetching in every client page (`dashboard`, `guides`, `guide-dashboard`, `admin`), polling in `ChatWindow` |
| useContext | `AuthContext` (current user, login/logout/loading) and `ThemeContext` (dark mode) — `context/` |
| Custom Hooks | `useFetch`, `useDebounce`, `useFavorites`, `useMouseGlow` — `hooks/` |
| Event Handling | `onClick`, `onChange`, `onSubmit` across all forms and interactive components |
| Conditional Rendering | Auth vs guest navbar, role-based dashboards, loading/error/empty states, booking/payment status badges, favorite toggle |
| Controlled Forms | Login, Register, Booking, Review, Profile, Availability, Contact, Trip Planner — all form state lives in React state |
| API Integration | Client components call `fetch('/api/...')`; server components (`app/page.js`, `app/destinations/page.js`) query MongoDB directly for fast first paint |
| Component Composition | `HomePage` composes `HeroSection`, `PopularDestinations`, `FeaturedGuides`, etc.; dashboards compose a layout + page-specific content |
| Reusable Components | `Button`, `Input`, `Select`, `Textarea`, `Modal`, `Badge`, `Rating`, `Avatar`, `LoadingSpinner`, `EmptyState`, `ErrorMessage` — `components/ui/` |
| Routing | Next.js App Router file-based routing across ~45 pages |

## 8. React Component Architecture

```text
RootLayout (AuthProvider, ThemeProvider, Navbar, Footer)
│
├── HomePage
│    ├── HeroSection (search form)
│    ├── PopularDestinations → DestinationCard
│    ├── FeaturedGuides → GuideCard
│    ├── HowItWorks
│    ├── PopularExperiences
│    ├── Testimonials
│    ├── WhyChooseUs
│    └── CTASection
│
├── GuidesPage (search + FilterPanel + GuideCard grid + pagination)
├── GuideDetailPage (profile + Rating + ReviewCard list + booking CTA)
├── BookingPage → BookingForm (controlled form, server-priced)
│
├── DashboardLayout (role-guarded via ProtectedRoute)
│    └── Overview / Bookings / Favorites / Messages / Notifications / Profile / Settings
├── GuideDashboardLayout
│    └── Overview / Bookings / Availability / Earnings / Reviews / Messages / Profile / Settings
└── AdminLayout
     └── Overview / Users / Guides / Bookings / Reviews / Destinations / Categories / Payments / Reports / Settings
```

Shared UI primitives (`Button`, `Input`, `Modal`, `Badge`, `Rating`, `Avatar`, `LoadingSpinner`,
`EmptyState`, `ErrorMessage`) are composed into every domain component (`GuideCard`,
`BookingCard`, `NotificationItem`, `DashboardCard`) rather than being rebuilt per page.

## 8a. Liquid Glass Design System

An Apple-inspired "liquid glass" visual language sits underneath the whole app, implemented with
plain CSS custom properties + Tailwind utilities and a single shared mouse listener — no animation
library.

| Piece | File | What it does |
|---|---|---|
| `useMouseGlow` | `hooks/useMouseGlow.js` | One `requestAnimationFrame` loop eases two CSS variable pairs toward the cursor: `--mx/--my` (viewport %, for the spotlight) and `--px/--py` (-1..1 offset from center, for background parallax). Every glass surface and the aurora background read these — there's only ever one mouse listener on the page. |
| `GlassEffects` | `components/effects/GlassEffects.jsx` | Mounted once in `app/layout.js`. Renders the fixed **aurora background** (three blurred, independently-animated gradient blobs in the brand's gold/navy/teal palette, each nudged by `--px/--py` for parallax) and the **cursor spotlight** (a soft radial glow blended over the page with `mix-blend-mode`). |
| `.card` (glass) | `app/globals.css` | The app's base surface: layered translucent fill + `backdrop-filter: blur(20px) saturate(160%)`, a subtle border that brightens on hover, a soft layered shadow, and a diagonal light **sheen** that sweeps across on hover (`::after`, pure CSS, no extra markup) — this is what every `GuideCard`, `BookingCard`, dashboard panel, and `Modal` is built from. |
| `Button` | `components/ui/Button.jsx` | Built-in **magnetic hover**: on `mousemove` it translates toward the cursor within its bounds, then springs back with a cubic-bezier ease on `mouseleave`. Applies to every button in the app (forms, admin actions, modals) with no per-page code. |
| `Magnetic` | `components/ui/Magnetic.jsx` | The same magnetic behavior as a wrapper `<span>`, for `next/link` CTAs that can't be the `Button` component (nav Login/Sign Up, homepage CTAs, `GuideCard`'s "View Profile"). |
| `.animate-in` | `app/globals.css` | A short scale + fade entrance used on `Modal` and the navbar's account dropdown — a subtle micro-interaction rather than a hard pop-in. |

Design choices worth noting for the viva: the parallax and spotlight are driven by **CSS custom
properties**, not React state, so mouse movement never triggers a re-render — only a GPU-cheap
style recalculation. Everything backs off automatically under `prefers-reduced-motion: reduce`
(blob animation and the spotlight are disabled outright). The palette stays inside TourMate's
existing navy/gold brand rather than introducing new colors, and both light and dark mode get
their own glass token set (`:root` vs `.dark` in `globals.css`) so the effect holds up either way.

## 8b. Frontend Redesign (Motion & Visual System v2)

The UI layer was redesigned without touching any backend, API, model, routing, auth or booking
logic (`app/api`, `models`, `lib`, `services`, `utils`, `hooks`, `context` and `scripts` are
byte-identical to the pre-redesign version). Only JSX/styling changed; every fetch call, handler
and prop interface stayed the same.

| Area | What changed | Where |
|---|---|---|
| Scroll reveals | Sections and card grids fade/slide in once as they enter the viewport (`whileInView`, `once`) | `components/motion/Reveal.jsx` (`Reveal`, `RevealGroup`, `RevealItem`) |
| 3D card tilt | Guide, destination, step, testimonial and CTA cards tilt up to ~3-6deg toward the cursor with a spring return | `components/motion/TiltCard.jsx` |
| Hero | Cinematic dark hero with hero-local glow orbs, drifting particles, staggered entrance, scroll parallax (content drifts and fades, orbs move at a different speed) and a glass search bar | `components/home/HeroSection.jsx`, `components/effects/FloatingParticles.jsx` |
| Custom cursor | Dot + trailing ring on desktop only (`pointer: fine` and `hover: hover`), expands over interactive elements, hidden over text fields, disabled on touch and under reduced motion | `components/effects/CustomCursor.jsx` |
| Navbar | Shrinks and gains depth on scroll; the active link underline slides between routes (`layoutId`) | `components/navbar/Navbar.jsx` |
| Dashboards | One shared shell for Tourist, Guide and Admin with a sliding active pill and per-page entrance; each `layout.js` still supplies its own links and allowed role | `components/dashboard/DashboardShell.jsx` |
| Auth screens | Two-column layout with brand panel on desktop | `components/shared/AuthShell.jsx` |
| Micro-interactions | Count-up stats, animated price total in the booking form, animated booking success state, modal enter and exit animation | `DashboardCard`, `BookingForm`, `Modal` |
| Mobile | Filters, previously hidden below the `lg` breakpoint, now open in a modal from a filter button | `app/guides/page.js` |
| Typography | Plus Jakarta Sans is now actually loaded (it was configured in Tailwind but never loaded before) | `app/layout.js` |

**Libraries:** Framer Motion only. Three.js / React Three Fiber and GSAP were deliberately not
added: scroll, hover, tilt and layout animations are all covered by Framer Motion, and a WebGL
scene would add significant weight for a booking flow where speed matters.

**Accessibility & performance:** every animation respects `prefers-reduced-motion` (reveals render
instantly, tilt, particles, spotlight and cursor are disabled); native cursor is preserved on touch
devices and over text inputs; focus rings are untouched; decorative layers are `aria-hidden` and
`pointer-events: none`. Mouse-driven effects write CSS variables or element styles directly rather
than React state, so cursor movement never re-renders components.

## 8c. Water Theme (Light Mode Redesign v3)

Light mode was redesigned around a "clear water in sunlight" concept instead of a flat background;
dark mode was redesigned in parallel as its "deep ocean at night" counterpart, sharing the same
components and animation code — only the CSS custom property values differ per mode
(`:root` vs `.dark` in `app/globals.css`). No backend, API, model, route, or business logic file
changed for this pass either (`app/api`, `models`, `lib`, `services`, `utils`, `hooks`, `scripts`
and `context` are untouched).

| Layer | What it is | Where |
|---|---|---|
| Water stage | Fixed full-page background: a sunlit/moonlit glow with slow rotating light rays, five drifting colour blobs (parallax-nudged by the cursor), two layers of moving caustic light (an SVG turbulence tile thresholded into thin bright ridges, tiled and animated), three layered wavy shapes at the bottom, and rising bubble particles | `components/effects/GlassEffects.jsx`, `.water-*` classes in `globals.css` |
| Wave dividers | A drifting wavy edge dropped between homepage bands so tinted sections read as part of the same water surface rather than flat stripes | `components/effects/WaveDivider.jsx` |
| Water cursor | Desktop-only (fine pointer + hover-capable, disabled under reduced motion and on touch). A glowing dot + ring track the pointer; a circular "lens" softly refracts the page behind it via `backdrop-filter` (with an SVG turbulence + displacement filter layered on where supported); a lightweight 2D canvas draws wavy ripple rings that trail while moving and fade on their own once you stop, small bubbles that rise while moving, and a bigger double ripple on click | `components/effects/CustomCursor.jsx` |
| Glass surfaces | `.card` now reads as wet glass in light mode (very translucent white, cyan-tinted border/shadow) and deep-water glass in dark mode (cyan-edged, near-black fill) — same class, same usage everywhere, only the tokens change | `globals.css` (`--glass-*` tokens) |
| Colour | Buttons, gradient text and glow shadows moved off a single gold accent onto a cyan/sky/teal/indigo palette (`--glow-ring`, `--glow-color`, `.text-gradient`), with gold kept as a secondary warm accent (ratings, a couple of icon badges, the logo mark) rather than removed | `globals.css`, `tailwind.config.js` (`shadow-glow` now reads CSS vars), `WhyChooseUs.jsx`, `HowItWorks.jsx`, `Footer.jsx` |

**Performance:** the cursor's ripples/bubbles are drawn on one `<canvas>` in a single rAF loop — no
per-particle DOM nodes. Background blobs/waves animate `transform`/`opacity` only. The caustic
light layers are two repeating background-images (SVG data URIs), not JavaScript per-frame work.
On screens under 768px, half the blobs, the light rays, the second caustic layer and the whole
cursor system are dropped via a `@media` query — mobile gets the calmer water background with no
cursor tracking, since there's no mouse to track.

**Accessibility:** every animated layer (`prefers-reduced-motion: reduce`) either stops animating
or is removed outright (cursor canvas, lens, bubbles). All of it is `aria-hidden` and
`pointer-events: none`, so it never interferes with keyboard navigation, screen readers, or clicks.

## 8d. Cursor System (Premium Theme-Matched Redesign v4)

The desktop cursor was rebuilt from scratch around one rAF loop and a small set of DOM layers —
no per-frame React state, no heavy canvas work. No backend/API/model/route/logic file changed for
this pass either (verified the same way as the redesigns above: `app/api`, `models`, `lib`,
`services`, `utils`, `scripts` and `context` are byte-identical to the previous delivery).

| Layer | What it does | Where |
|---|---|---|
| Glass core | A small translucent, blurred dot that eases toward the pointer (inertia, not 1:1 tracking) and morphs — size, shape, glow — based on what's underneath it, via a `data-state` attribute and CSS transitions (no per-frame style writes for the morph itself) | `.cursor-core` in `globals.css` |
| Aurora glow | A blurred radial blob in the theme's cyan → blue → violet (dark) / cyan → blue → purple (light) gradient, trailing a half-step behind the core, growing and brightening with pointer velocity and settling back down once it stops | `.cursor-glow` |
| Fluid trail | One faint stroked path per frame through the last ~260ms of pointer positions (not per-point shapes) — the only canvas use in the system | `.cursor-trail-canvas` |
| Soft ripple | A single gentle expanding ring, throttled by both distance and time so it stays rare, plus one on click | `.cursor-ripple` |
| State detection | One `mouseover` listener classifies the target into `link` / `button` / `card` / `image` / `drag` / `text` / `normal` by priority, driving the core's morph | `classifyTarget()` in `CustomCursor.jsx` |
| Glass card reflection | Cards get a radial highlight that leans toward the cursor, a border that brightens on hover, and (already) a very small (2-4°) spring-based 3D tilt | `TiltCard.jsx` writes local `--lx/--ly`; `.card::before` in `globals.css` reads them |
| Ambient spotlight | The existing page-wide soft glow (from the earlier water-theme pass) now reads the spec's literal `--cursor-x`/`--cursor-y` variable names, aliased from the same eased position | `useMouseGlow.js`, `.cursor-spotlight` |

**Performance:** everything that moves every frame (core, glow, trail) is written directly to
`element.style` inside one `requestAnimationFrame` loop — never through React state, so pointer
movement never triggers a re-render. Only two React states exist (`visible`, `state`), and both
change rarely (on window enter/leave, and when the hovered element category changes), not on
every pixel of movement. The card highlight reuses `TiltCard`'s existing mousemove handler rather
than adding a second listener.

**Accessibility & responsiveness:** disabled entirely on touch devices and under
`prefers-reduced-motion` (checked once on mount via `matchMedia`, not per frame). Every layer is
`aria-hidden` and `pointer-events: none`. The native cursor returns automatically over text inputs
and textareas. Visual hierarchy stays content-first — nothing in this system uses colour or motion
strong enough to compete with page content; it only reacts to it.

## 9. Folder Structure

```text
tourmate/
├── app/                  # Next.js App Router — pages & API routes
│   ├── api/              # Route Handlers (backend)
│   ├── (public pages)/   # /, /guides, /destinations, /about, etc.
│   ├── dashboard/        # Tourist dashboard
│   ├── guide-dashboard/  # Guide dashboard
│   ├── admin/            # Admin panel
│   ├── layout.js         # Root layout (providers, Navbar, Footer)
│   └── globals.css       # Tailwind base + design tokens
├── components/
│   ├── ui/                # Reusable primitives (Button, Modal, Badge, ...)
│   ├── navbar/, shared/   # Navbar, Footer, ProtectedRoute
│   ├── guides/, booking/  # Domain components (GuideCard, BookingForm, ...)
│   ├── dashboard/, admin/ # Dashboard-specific components
│   ├── chat/              # ChatWindow, ConversationList
│   └── home/               # Homepage sections
├── context/               # AuthContext, ThemeContext
├── hooks/                 # useFetch, useDebounce, useFavorites
├── models/                # 13 Mongoose schemas
├── lib/                   # db.js, auth.js, apiResponse.js, adminGuard.js
├── services/               # notificationService.js
├── utils/                  # pricing.js, validators.js, format.js
├── scripts/seed.js         # Demo data seeder
├── public/
├── .env.example
└── package.json
```

## 10. Application Architecture

```text
React UI (Client & Server Components)
   ↓  fetch('/api/...')  /  direct Mongoose query in Server Components
Next.js Route Handlers (app/api/**/route.js)
   ↓
Mongoose Models (models/*.js)
   ↓
MongoDB
```

Client-interactive pages (search, dashboards, forms) talk to the backend exclusively through the
`fetch`-based JSON API under `app/api/`. A few read-heavy public pages (`/`, `/destinations`) are
Server Components that query MongoDB directly via Mongoose for a fast first paint — a standard
Next.js App Router pattern — while all mutations and authenticated actions always go through the
API layer with server-side authorization checks.

## 11. Database Models

| Model | Purpose |
|---|---|
| `User` | Account record (name, email, hashed password, role, suspension flag) |
| `Guide` | Guide profile linked 1:1 to a `User` (bio, rates, languages, status, rating) |
| `Booking` | A booking request/confirmation between a tourist and a guide, with server-calculated price |
| `Availability` | Per-date availability/blocked status for a guide |
| `Review` | Rating + text tied to one completed `Booking` (one review per booking) |
| `Payment` | Payment order/verification record for a booking (Razorpay or demo) |
| `Favorite` | Tourist ↔ Guide favorite mapping (unique pair) |
| `Conversation` | Two-participant chat thread |
| `Message` | A single chat message within a `Conversation` |
| `Notification` | In-app notification for a user (booking, payment, message, review events) |
| `Destination` | A city/region shown on the destinations page |
| `TourCategory` | A tour type/specialty (Heritage, Adventure, Food, ...) |
| `Report` | Admin moderation report record |

All relationships use Mongoose `ObjectId` references (e.g. `Booking.guide → Guide`,
`Guide.user → User`), and schema-level validation enforces required fields, enums (roles,
statuses) and numeric bounds.

## 12. Authentication Flow

1. **Register** (`POST /api/auth/register`) — validates input, hashes the password with `bcryptjs`,
   creates a `User` (and a pending `Guide` profile if `role: "GUIDE"`), signs a JWT, and sets it
   as an httpOnly cookie.
2. **Login** (`POST /api/auth/login`) — verifies the password hash, checks the account isn't
   suspended, and issues the same signed JWT cookie.
3. **Session** (`GET /api/auth/me`) — every page load, `AuthContext` calls this to hydrate the
   current user from the cookie; the JWT is verified server-side on every request, never trusted
   from the client.
4. **Authorization** — every mutating API route re-checks `role` from the verified JWT payload
   (not from any client-supplied field) before performing the action — see `requireAuth` /
   `requireRole` in `lib/apiResponse.js` and `requireAdmin` in `lib/adminGuard.js`.
5. **Logout** clears the cookie.

## 13. Booking Flow

1. Tourist opens a guide's profile and fills the controlled `BookingForm` (date, time, duration,
   people, category).
2. On submit, the client `fetch`es `POST /api/bookings` with the raw selections — **not** a
   pre-computed price.
3. The server re-validates the guide is `approved`, checks for a conflicting booking on the same
   guide/date/time (`Booking` unique query — prevents double-booking), and computes the final
   price itself via `utils/pricing.js` from the guide's stored rates.
4. The booking is created as `pending` and the guide is notified.
5. The guide **accepts** or **rejects** it from their dashboard (`/api/bookings/[id]/accept|reject`).
6. Once `confirmed`, the tourist can pay (`/api/payments/create-order` → `/api/payments/verify`,
   Razorpay or Demo Payment Mode).
7. The guide marks the tour **completed** after it happens, which unlocks the review form for the
   tourist.

## 14. API Documentation

All endpoints return `{ success: boolean, message?, ...data }`. 🔒 = authentication required.

### Authentication
| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create a Tourist or Guide account | Public |
| POST | `/api/auth/login` | Log in | Public |
| POST | `/api/auth/logout` | Log out | 🔒 |
| GET | `/api/auth/me` | Get current session user | 🔒 |
| POST | `/api/auth/forgot-password` | Request a reset token (demo: returned directly) | Public |
| POST | `/api/auth/reset-password` | Reset password with token | Public |

### Guides
| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/guides` | Search/filter/sort/paginate approved guides | Public |
| GET | `/api/guides/[id]` | Guide profile detail | Public |
| GET | `/api/guides/me` | The logged-in guide's own profile | 🔒 Guide |
| GET/POST | `/api/guides/[id]/availability` | View / set availability | Public / 🔒 Guide (owner) |
| GET | `/api/guides/[id]/reviews` | Reviews for a guide | Public |

### Bookings
| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/bookings` | Create a booking (server-priced) | 🔒 Tourist |
| GET | `/api/bookings` | List current user's bookings | 🔒 |
| GET | `/api/bookings/[id]` | Booking detail (owner or admin) | 🔒 |
| POST | `/api/bookings/[id]/accept` | Accept a pending booking | 🔒 Guide (owner) |
| POST | `/api/bookings/[id]/reject` | Reject a pending booking | 🔒 Guide (owner) |
| POST | `/api/bookings/[id]/cancel` | Cancel pending/confirmed booking | 🔒 Owner |
| POST | `/api/bookings/[id]/complete` | Mark a confirmed booking completed | 🔒 Guide (owner) |

### Reviews, Favorites, Payments, Notifications, Chat
| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/reviews` | Submit a review for a completed booking | 🔒 Tourist |
| PATCH/DELETE | `/api/reviews/[id]` | Hide/unhide or delete a review | 🔒 Admin |
| GET/POST | `/api/favorites` / `/api/favorites/[guideId]` | List / add / remove favorites | 🔒 Tourist |
| POST | `/api/payments/create-order` | Create a payment order (Razorpay or Demo) | 🔒 |
| POST | `/api/payments/verify` | Verify payment signature & mark paid | 🔒 |
| GET | `/api/notifications` | List current user's notifications | 🔒 |
| PATCH | `/api/notifications/[id]` | Mark a notification read | 🔒 |
| GET/POST | `/api/conversations` | List / start a chat conversation | 🔒 |
| GET/POST | `/api/messages` | List / send messages in a conversation | 🔒 |

### Destinations, Categories & Trip Planner
| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/destinations` / `/api/destinations/[id]` | List / detail destinations | Public |
| GET | `/api/categories` | List tour categories | Public |
| POST | `/api/trip-planner` | Generate an itinerary (AI or local demo) | Public |

### Admin
| Method | Endpoint | Purpose |
|---|---|---|
| GET/PATCH | `/api/admin/users` | List users / suspend / unsuspend |
| GET/PATCH | `/api/admin/guides` | List guides / approve / reject / suspend |
| GET | `/api/admin/bookings` | All bookings |
| GET | `/api/admin/reviews` | All reviews |
| GET/POST/PATCH/DELETE | `/api/admin/destinations` | Manage destinations |
| GET/POST/DELETE | `/api/admin/categories` | Manage categories |
| GET | `/api/admin/payments` | All payments |
| GET | `/api/admin/reports` | Aggregated platform statistics |

All admin routes are protected server-side by `requireAdmin()`, independent of any client-side
route guard.

## 15. Installation

```bash
cd tourmate
npm install
```

## 16. Environment Setup

Copy the example file and fill in what you have (everything except `MONGODB_URI` and
`AUTH_SECRET` is optional — missing integrations automatically fall back to demo mode):

```bash
cp .env.example .env.local
```

```env
MONGODB_URI=mongodb://localhost:27017/tourmate
AUTH_SECRET=replace-with-a-long-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

**These four are real, working integrations, not stubs** — each one calls the actual provider's
API when its keys are present, and automatically falls back to a demo path when they're absent
(or if a live call ever fails):

| Integration | When configured | When not configured |
|---|---|---|
| **Cloudinary** | `POST /api/upload` uploads the file server-side via the Cloudinary SDK and returns a real `secure_url`. Used by profile photos, guide cover photos, review photos, and destination photos (`components/ui/ImageUpload.jsx`). | The upload control shows "Image uploads aren't available" instead of a broken upload button. |
| **Razorpay** | `/api/payments/create-order` creates a real Razorpay order via the SDK; the booking page loads `checkout.js` and opens the real Razorpay modal; `/api/payments/verify` recomputes the HMAC signature server-side before marking the booking paid. | Runs in the labeled **Demo Payment Mode** — an instant simulated success with no real order or charge. |
| **Google Maps** | `components/shared/MapEmbed.jsx` renders a live Google Maps Embed iframe for the guide's or destination's location. This key is meant to be public (restrict it by HTTP referrer in Google Cloud Console) — that's why it's `NEXT_PUBLIC_`. | Shows a plain location card with a pin icon instead of a map. |
| **Gemini** | `/api/trip-planner` calls Gemini (`@google/generative-ai`) with a prompt that requests strict JSON matching the itinerary shape the UI renders. | Falls back to the local rule-based itinerary generator — and falls back to it automatically even *with* a key, if the live call throws (bad key, quota, malformed JSON), so the feature never just breaks. |

## 17. Database Setup

Install MongoDB locally (or use a free MongoDB Atlas cluster) and point `MONGODB_URI` at it.
No manual schema setup is needed — Mongoose creates collections automatically on first write.

## 18. Seed Database

```bash
npm run seed
```

This clears existing data and inserts destinations, categories, 12 demo guides (2 left `pending`
to demonstrate the approval flow), sample bookings/reviews/availability/notifications, and the
three demo accounts below.

## 19. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**.

## 20. Production Build

```bash
npm run build
npm start
```

## 21. Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | `Demo@1234` |
| Guide | guide@example.com | `Demo@1234` |
| Tourist | tourist@example.com | `Demo@1234` |

## 22. Screenshots

_Add screenshots here after running the app locally — e.g. homepage, guide search, booking flow,
tourist dashboard, guide dashboard, admin panel, dark mode._

## 23. Testing

Verified during development:

- `npm run lint` — passes with **zero warnings or errors**.
- `npm run build` — production build completes successfully; all ~45 pages and ~40 API routes
  compile with no type/runtime errors.
- Manual code review of every auth-gated route to confirm role checks match the spec (Tourist /
  Guide / Admin).
- Every form's happy path and empty/error states were reviewed against the corresponding API
  contract.

**Known constraint:** this sandbox has no outbound access to install/run a local MongoDB
instance, so a live end-to-end run against real data (seed → dev server → click through booking)
could not be executed here. The code has been written and reviewed to the same standard as if it
had been; run `npm run seed && npm run dev` locally to verify the full flow — please open an issue
if anything doesn't behave as documented.

## 24. Error Handling

- Every API route wraps its logic in `try/catch` and returns a consistent
  `{ success: false, message }` shape with an appropriate HTTP status.
- Client pages track `loading` / `error` / `data` state (directly, or via the `useFetch` hook) and
  render `LoadingSpinner`, `ErrorMessage`, or `EmptyState` accordingly — no bare blank screens.
- Forms show inline validation and error messages without a full page reload.

## 25. Security

- **Password hashing** — `bcryptjs` with a salt round of 10; plaintext passwords are never stored
  or logged.
- **Authentication** — signed JWT in an `httpOnly`, `sameSite=lax` cookie; never readable from
  client-side JavaScript.
- **Authorization** — every mutating/sensitive API route re-derives the user's role from the
  verified JWT and checks it server-side (`requireAuth`, `requireRole`, `requireAdmin`) — the
  client-side `ProtectedRoute` component is UX-only, not a security boundary.
- **Validation** — required-field and type checks in every route handler; `isValidObjectId` /
  `isValidEmail` guards in `utils/validators.js`.
- **Ownership checks** — booking accept/reject/cancel/complete, availability updates, and guide
  profile edits all confirm the acting user owns the relevant `Guide`/`Booking` record.
- **Booking conflict validation** — server rejects a new booking if the guide already has a
  pending/confirmed booking at the same date & time.
- **Server-side price calculation** — the client's estimated total is never trusted; `totalPrice`
  is always computed server-side from the guide's stored rates (`utils/pricing.js`).
- **Payment signature verification** — `/api/payments/verify` recomputes the HMAC signature with
  the server-only `RAZORPAY_KEY_SECRET` before marking a payment paid.
- **Secret protection** — all API keys/secrets are read only from `process.env` inside server-side
  route handlers; nothing is exposed in client bundles. `.env.local` is git-ignored.

## 26. Future Enhancements

- Real-time chat via WebSockets instead of polling.
- Email delivery for password reset and booking notifications.
- Full Google Maps embed with guide location pins.
- Guide payout automation and multi-currency support.
- Automated test suite (Jest/React Testing Library + API integration tests).

## 27. Limitations

- Cloudinary, Razorpay, Google Maps and Gemini are real integrations (Section 16 above), but
  **none of them were exercised against live credentials in this sandbox** — there's no network
  access here to reach those providers, so `npm run lint` / `npm run build` were used to verify
  the code compiles correctly, but a real end-to-end run (an actual upload, a real Razorpay test
  payment, a real Gemini response) should be done locally once you add your own keys. Test each
  one with sandbox/test-mode credentials before ever pointing this at production keys.
- Razorpay is wired for INR only; multi-currency isn't implemented.
- Chat uses simple polling (every 4s), not a real-time socket connection.
- The seed script's demo data is entirely fictional.
- This sandbox couldn't run a live MongoDB instance, so end-to-end runtime testing (seed → click
  through every flow) should be done locally after cloning; static build/lint checks all pass.

## 28. Learning Outcomes

Building TourMate reinforced: structuring a non-trivial app into small, reusable, prop-driven
React components; managing both local (`useState`) and global (`useContext`) state cleanly;
writing custom hooks to remove duplication; the difference between Server and Client Components in
the Next.js App Router; designing a REST-ish API with consistent responses and server-side
authorization; and building graceful fallback paths for optional third-party integrations so a
project stays fully demonstrable without live API keys.

## 29. Viva Preparation — Questions & Answers

1. **What is React?**
   A JavaScript library for building user interfaces out of reusable, composable components that
   efficiently re-render when their state or props change, using a virtual DOM.

2. **Why did you use React for this project?**
   The UI is made of many repeating, data-driven pieces (guide cards, booking cards, dashboards).
   React's component + props + state model is a natural fit, and it's the subject of this course.

3. **What are components?**
   Independent, reusable pieces of UI. In TourMate they're functional components like `GuideCard`,
   `BookingForm`, `Navbar` — each responsible for one piece of the interface.

4. **What are props?**
   Read-only data passed from a parent component to a child. E.g. `GuideCard` receives `name`,
   `image`, `location`, `rating`, `price` as props and renders purely from them.

5. **What is `useState`?**
   A hook that lets a functional component hold local, re-render-triggering state — e.g. the
   booking form's date/time/people fields.

6. **What is `useEffect`?**
   A hook for side effects — code that runs after render, such as fetching data from an API when a
   dashboard page mounts.

7. **Why use the Context API?**
   To share global state (the logged-in user, dark/light theme) across many components without
   manually passing props down through every level ("prop drilling"). `AuthContext` and
   `ThemeContext` do this.

8. **What is a controlled form?**
   A form whose input values are driven entirely by React state (`value={state}`,
   `onChange={setState}`), so React is always the single source of truth for the form's data.

9. **What is conditional rendering?**
   Showing different UI based on a condition — e.g. showing "Login/Sign Up" vs. a user avatar menu
   depending on `isAuthenticated`, or a loading spinner while data is being fetched.

10. **How does React communicate with the backend?**
    Client components call the Next.js API routes using the `fetch` API (e.g.
    `fetch('/api/guides')`), then update state with the JSON response.

11. **Why MongoDB?**
    It's a flexible, document-based database that maps naturally onto JavaScript objects, and
    Mongoose adds schema validation and relationships on top of that flexibility.

12. **What is Next.js?**
    A React framework that adds file-based routing, Server/Client Components, and built-in API
    "Route Handlers" — letting one codebase serve both the frontend and backend.

13. **What's the difference between React and Next.js?**
    React is a UI library only. Next.js is a full framework built on React that adds routing,
    server-side rendering, and backend API routes.

14. **How does authentication work here?**
    On login, the server verifies the hashed password, signs a JWT with the user's id/role, and
    sets it as an httpOnly cookie. Every subsequent request is authenticated by verifying that
    cookie server-side — never trusting anything the client claims about itself.

15. **How does booking work?**
    The tourist submits a controlled form; the server checks the guide is approved, checks for a
    date/time conflict, computes the price itself from the guide's stored rates, and creates a
    `pending` booking that the guide then accepts or rejects.

16. **How do you prevent double booking?**
    Before creating a booking, the server queries for any existing `pending`/`confirmed` booking
    for that same guide, date and start time, and rejects the request if one exists.

17. **How are passwords secured?**
    They're hashed with `bcrypt` (salted, one-way) before being stored — the plaintext password is
    never saved or logged, and the hash is excluded from query results by default (`select: false`).

18. **What is API integration in this project?**
    The pattern of client components calling the app's own `/api/*` Route Handlers via `fetch` to
    read or write data, rather than embedding data directly in components.

19. **Why are reusable components important?**
    They avoid duplicated UI code, keep styling and behavior consistent across the app, and make
    the codebase far easier to maintain — e.g. one `Button` component is used everywhere instead of
    dozens of one-off `<button>` elements.

20. **What would you improve in the future?**
    Real-time chat over WebSockets instead of polling, automated tests, and full production
    integrations for payments/maps/AI instead of demo fallbacks (see Section 26).

21. **How is server-side price calculation implemented, and why does it matter?**
    `utils/pricing.js` computes the total from the guide's stored `pricePerHour`/`pricePerDay` and
    the requested duration/people — the client's own estimate is shown for UX but is never trusted
    or sent as the final price, preventing a malicious client from booking at a manipulated price.

22. **How does role-based authorization work?**
    Every user's role is embedded in their signed JWT at login. Sensitive API routes call helper
    guards (`requireRole`, `requireAdmin`) that read the role from the verified token — never from
    a request body — before allowing the action.

---

*This is an academic demonstration project. All guides, bookings, and reviews in the seed data are
fictional.*

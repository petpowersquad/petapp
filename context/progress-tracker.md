# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Pet Profile & Core Feature Implementation

## Current Goal

- Implement pet monitoring and AI pet care features

## Completed

- Stripped `globals.css` down to `@import "tailwindcss";`
- Deleted default SVG assets from the `public` directory
- Replaced `page.tsx` with a minimal centered layout rendering "PAWPower"
- Verified the build succeeds via `npm run build`
- Initialized Shadcn/UI with Tailwind CSS v4 configuration
- Installed `lucide-react`, `clsx`, and `tailwind-merge`
- Created `lib/utils.ts` with `cn()` helper
- Added primitive UI components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
- Verified components import and render correctly in `page.tsx`
- Applied custom color theme from `ui-context.md` to `globals.css` (Brand Forest Green, Honey Amber accents)
- Defined and implemented global navigation header and footer layouts (`context/feature-spec/03-build-nav.md`)
- Integrated UI layouts into `app/layout.tsx` with brand-conforming Google Fonts (`Plus Jakarta Sans`, `Lora`)
- Created responsive aesthetic page shells for `/dashboard`, `/calendar`, `/vets`, and `/scan` routes to ensure complete navigation connectivity
- Added "How Scan Works" section to the landing page (`app/page.tsx`) with 3 responsive columns (Camera, Brain, FileText icons), matching the existing Features Grid card pattern and CSS token styling (`context/feature-spec/04-landing-page.md`)
- Built About page (`app/about/page.tsx`) with a dark brand hero section (Core Vision), three stacked pillar cards (Computer Vision AI Triage, PostGIS Geospatial Intelligence, Full-Lifecycle Health Tracking), and a closing CTA strip — all styled via CSS custom property tokens, fully responsive single-column on mobile (`context/feature-spec/05-about-page.md`)
- Updated `Header.tsx` to include About as the first item in `navigationItems`, automatically surfacing in both desktop and mobile nav
- Created static Privacy Policy page (`app/privacy/page.tsx`) with 12 professional clauses covering Clerk authentication, Supabase database hosting, PostGIS location data handling, and a firm commitment that uploaded pet diagnostic images are never sold or stored long-term (`context/feature-spec/06-t&s-privacy.md`)
- Created static Terms of Service page (`app/terms/page.tsx`) with 15 clauses including a prominent warning card specifying that the AI Triage Engine is a guidance assistant only and NOT a certified replacement for professional emergency veterinary care (`context/feature-spec/06-t&s-privacy.md`)
- Updated `Footer.tsx`: wired Privacy Policy link to `/privacy` and Terms of Service link to `/terms`; hover color set to honey amber (`text-secondary`) for branded link styling
- Initialized Clerk authentication via `clerk init --app app_3G8XpXoboYuJ11Alr1hQtGO2G7V` (`context/feature-spec/07-init-clerk.md`):
  - Installed Clerk CLI v2.0.0 (user-local npm prefix `~/.npm-global`)
  - Authenticated as anthonybadawi100@gmail.com
  - `clerk init` auto-detected Next.js App Router, installed `@clerk/nextjs`, scaffolded `proxy.ts` (middleware), `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`, and wrote env keys to `.env.local`
  - Added `'/__clerk/:path*'` to `proxy.ts` `config.matcher` after `/(api|trpc)(.*)`
  - Installed `@clerk/ui` and applied brand theme via `ClerkProvider appearance` prop in `app/layout.tsx` (forest green primary, honey amber accents, Plus Jakarta Sans font, `rounded-2xl` cards — no shadcn CSS import)
  - Updated `Header.tsx`: replaced User icon placeholder with `SignInButton`, `SignUpButton` (both `mode="modal"`), and `UserButton` wrapped in `Show when="signed-out/signed-in"` — both desktop and mobile panels covered
  - `clerk doctor` all critical checks green; build exit 0, TypeScript clean, 11 routes confirmed
- Implemented `/pets/[pet_id]` pet profile page (`context/feature-spec/09-pet-profile.md`):
  - `app/pets/[pet_id]/page.tsx` — React Server Component; fetches pet (with breed join), latest scan, full scan history, and events from Supabase via server client; double-enforces owner-only access (`owner_id !== userId` → `notFound()`); two-row responsive grid layout
  - `app/pets/[pet_id]/PetImageUpload.tsx` — `"use client"` component; shows stored photo via `next/image` with hover overlay to change; shows upload placeholder with amber Upload icon if no photo; validates file type and size client-side; POSTs to API route and updates URL state on success
  - `app/api/pets/[pet_id]/upload-photo/route.ts` — POST handler; validates Clerk auth, verifies `owner_id`, validates MIME type and file size; uploads to `pet-photos` Supabase Storage bucket (upsert); writes `photo_url` back to `pets` row
  - `app/dashboard/page.tsx` — imported `next/link`; pet cards now wrapped in `<Link href="/pets/{id}">` for navigation
  - `next.config.ts` — added `toeaffagbvydiodfpvyj.supabase.co` to `images.remotePatterns` for `next/image`
  - Build exit 0, TypeScript clean, 12 routes confirmed

## In Progress

- None

## Next Up

- Implement pet monitoring and AI pet care features

## Open Questions

- None at the moment.

## Recent Changes (Session: 2026-07-13)

- Fixed RLS violation on `POST /api/pets` (code `42501`) by migrating from service-role bypass to Clerk JWT + Supabase RLS (Option 1):
  - Created Clerk JWT template named `supabase` in Clerk Dashboard (Configure → JWT Templates → Supabase); enabled custom signing key (HS256) using Supabase project JWT secret; `sub` is injected automatically by Clerk (reserved claim)
  - Created `utils/supabase/server-auth.ts` — `createAuthenticatedClient()` calls `getToken({ template: "supabase" })` and passes the JWT as `Authorization: Bearer` header; disables Supabase session persistence since Clerk owns auth
  - Created `utils/supabase/admin.ts` — `createAdminClient()` using `SUPABASE_SERVICE_ROLE_KEY`; used exclusively for storage upsert in upload-photo route
  - Updated `app/api/pets/route.ts` — switched from cookie-based `createClient` to `createAuthenticatedClient()`; RLS now enforces insert correctly
  - Updated `app/api/events/[event_id]/toggle/route.ts` — same switch; RLS policy `Owners can manage events` now active
  - Updated `app/dashboard/page.tsx` — switched to `createAuthenticatedClient()`; removed `cookies()` dependency
  - Updated `app/api/pets/[pet_id]/upload-photo/route.ts` — DB ownership check uses `createAuthenticatedClient()` (RLS active); storage upsert uses `createAdminClient()` (bypasses storage RLS for upsert); DB `photo_url` update uses authenticated client
  - Updated `app/pets/[pet_id]/page.tsx` — was missed in initial migration; switched from cookie-based client to `createAuthenticatedClient()`; this was causing owner's own pet profile to return 404
  - `SUPABASE_SERVICE_ROLE_KEY` must be added to `.env.local` (Supabase Dashboard → Project Settings → Data API → service_role key)
- Fixed dashboard layout: "Your Pets" and "AI Health Insights" cards now have equal height on desktop (`md:items-stretch` on grid, `h-full` on card and wrapper div)
- Restyled pet cards in "Your Pets" section: Forest Green (`--bg-brand-dark`) background, white pet name, white/60 muted subtext, honey amber "Active" badge
- Restyled Care Checklist tabs: active tab uses Forest Green background with white text; inactive tab uses muted grey; count badge on active tab uses honey amber

## Architecture Decisions

- Kept styling minimal using Tailwind CSS v4 directives.
- Used Google Fonts to match visual requirements.
- Privacy and Terms pages are fully static (React Server Components, no `"use client"`) — zero JS bundle overhead.
- Clerk middleware lives in `proxy.ts` (not `middleware.ts`) — this is what `clerk init` generates for this version.
- `ClerkProvider` is inside `<body>`, not wrapping `<html>` — required by Clerk.
- Auth modals open in-place (`mode="modal"`) to avoid full-page redirects during sign-in/sign-up.
- `@clerk/nextjs` in this version uses `Show when="signed-in/out"` instead of `SignedIn`/`SignedOut` components.
- Clerk + Supabase auth uses JWT template pattern (not service-role bypass): `createAuthenticatedClient()` passes a Clerk-signed JWT to Supabase so RLS policies using `auth.jwt() ->> 'sub'` and `get_my_id()` work correctly. Service role key (`createAdminClient()`) is reserved exclusively for storage upsert operations where the application code already enforces ownership.

## Session Notes

- Navigation, global header, footer, and basic dashboard pages are fully functional and compiled. Ready for core database and AI features.
- All legal pages (`/privacy`, `/terms`) are prerendered as static content. 11 total routes confirmed in build output.
- Clerk is fully operational. Sign-in/sign-up flow available via modal from the header nav on every page.
- Supabase database schema is fully specified: migration file contains all tables, RLS policies, and helper functions. Seed file contains 35 breeds (20 dogs, 15 cats) with complete care information ready for `supabase db seed`.
- Initialized Supabase database schema (`context/feature-spec/08-init-supabase-db.md`):
  - Migration `supabase/migrations/20260711183216_initial_schema.sql` confirmed containing full schema: `breeds`, `pets`, `health_scans`, `pet_events`, `tickets`, `ticket_messages`, `vets` tables with RLS enabled and all policies
  - `get_my_role()` helper function reads `app_role` from Clerk JWT for role-based RLS policies
  - `update_modified_column()` trigger keeps `tickets.updated_at` current
  - Created `supabase/seed.sql` with 20 dog breeds and 15 cat breeds — all rows include `name`, `species`, `care_food`, `care_exercise`, `care_sleep`, `care_health_notes`
- Pet profile page `/pets/[pet_id]` is fully implemented: owner-only server-side access guard, pet photo upload, pet info card, latest AI health insight, scrollable scan history, scrollable events list, and a Scan CTA button. Dashboard pet cards link to profile pages. Build clean at 12 routes.
- Added storage bucket setup (`context/feature-spec/10-sql-bucket.md`):
  - Created `supabase/migrations/20260713150131_add_storage_buckets.sql` — creates public `pet-images` bucket; RLS policies for authenticated upload (folder must match `get_my_id()`), owner-scoped update/delete, public read, and support/admin full management
  - Updated `app/api/pets/[pet_id]/upload-photo/route.ts` — `BUCKET` constant changed from `pet-photos` to `pet-images` to match the new migration
  - Build exit 0, TypeScript clean, 12 routes confirmed
- Updated dashboard with real Supabase data and interactive features (`context/feature-spec/11-dashboard-after-db.md`):
  - `app/api/pets/route.ts` — POST handler; validates auth, name, species; inserts pet into `pets` table; returns `{id, name, species, photo_url}`
  - `app/api/events/[event_id]/toggle/route.ts` — PATCH handler; toggles `is_completed` on a `pet_events` row; protected by RLS
  - `app/dashboard/DashboardClient.tsx` — `"use client"` component containing: Add Pet modal (manual + AI-image tabs, JPEG/PNG upload with progress bar, preview, form fields, submit to `/api/pets` then `/api/pets/[id]/upload-photo`), Care Checklist with Tabs (To Do / Completed), per-task toggle (Circle → CheckCircle2, optimistic update), scrollable lists, Health Insights (warning scans only, empty state), Recent Scans (scrollable, empty state), toast notifications (bottom-right, success/error), redirect to `/scan?preview=...` after pet creation
  - `app/dashboard/page.tsx` — rewritten as async RSC; fetches pets, scans (last 20), and weekly events from Supabase; passes to `DashboardClient`
  - `app/scan/page.tsx` — refactored into `ScanPageInner` + `export default ScanPage` with `<Suspense>` wrapper; reads `?preview=` query param via `useSearchParams` and seeds image state so newly created pets' photos show immediately
  - Build exit 0, TypeScript clean, 15 routes confirmed

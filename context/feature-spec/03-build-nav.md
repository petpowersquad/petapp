# Feature Spec: Navigation and Footer layout

Implement global navigation header and footer containment as specified in `ui-context.md` and `project-overview.md`.

## Features

1. **Global Header Component (`Header`)**:
   - Anchored at the top, full-width, fixed or sticky.
   - Background: Dark Brand Panel (`--bg-brand-dark` or `bg-primary`, `#11231E`).
   - Text color: White/light-gray with active/hover states using Primary Accent (`--accent-primary`, `#EAA23B`).
   - Content:
     - Left: Brand Logo: `PawPrint` icon (Lucide React) + text "PAWPower". Clicking it routes to the root page (`/`).
     - Center/Right Navigation links:
       - **Dashboard** (`/dashboard`)
       - **Calendar** (`/calendar`)
       - **Vet Finder** (`/vets`)
       - **Scan Pet** (`/scan`, styled as a prominent call-to-action button using the honey-amber accent style)
     - Far Right: User profile / Auth area (render a mock User Avatar or a "Sign In" button placeholder).
   - Responsiveness: A collapsible mobile menu (hamburger icon) for small screens.

2. **Global Footer Component (`Footer`)**:
   - Anchored at the bottom, full-width.
   - Background: Dark Brand Panel (`--bg-brand-dark`, `#11231E`).
   - Text color: Muted gray/white.
   - Content:
     - Left: "© 2026 PAWPower. All rights reserved."
     - Right: Links to "Privacy Policy", "Terms of Service" (mock links/placeholders).

3. **Layout Integration**:
   - Integrate `Header` and `Footer` in `app/layout.tsx`.
   - Wrap the children in a page wrapper structure (`min-h-screen flex flex-col`) where:
     - Header is at the top.
     - The main container (`<main>`) has `flex-1` so that it expands to push the Footer to the bottom.
     - The base canvas has background color `--bg-base` (`#FAFAFA`).

4. **Routes Shells**:
   - Create basic page components for the linked routes (`/dashboard`, `/calendar`, `/vets`, `/scan`) so clicking the nav links navigates properly to clean placeholder pages instead of 404.

## Check when done
- Compilation succeeds.
- Navigation header is fully responsive (collapses to mobile menu).
- Brand styling (Forest Green + Honey Amber) is applied correctly via CSS tokens.
- All navigation links route properly to mock pages.

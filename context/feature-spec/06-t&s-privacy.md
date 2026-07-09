Read `AGENTS.md` before starting.

- I need you to create two new static pages inside the App Router structure: a Privacy Policy page (`app/privacy/page.tsx`) and a Terms of Service page (`app/terms/page.tsx`). 

- Once created, you must also locate `Footer.tsx` and wire up the respective links to point to `/privacy` and `/terms`.

### Core Architectural & Theme Guardrails:

1. **Follow `ui_context.md` and globals.css Rules:** All styling must strictly utilize the custom Tailwind v4 functional tokens we configured to avoid naming collisions and framework truncation errors.
   - For all regular body copy and text elements, use `text-text-primary` or `text-text-muted` (NEVER plain `text-muted` or `text-primary` as text modifiers).
   - Use the Display font (`font-serif`) for page/section headers and your standard sleek layout font (`font-sans`) for descriptions and text parameters.
   - For container rounding, follow the structural scale: `rounded-lg` for small UI inputs/buttons, `rounded-2xl` for document panels/cards, and `rounded-3xl` for main outer page viewport wraps if applicable.

2. **The Layout Format:** Keep the pages clean, highly professional, and scannable. Wrap the document content inside a centered card container (`max-w-3xl mx-auto my-12 p-8 bg-card border border-border rounded-2xl shadow-sm`). Use clean dividers (`<hr className="border-border" />`) or vertical spacing stacks (`space-y-6`) to break up separate legal clauses. And make sure that the pages are responsive across multiple devices.

3. **Content Inclusions:**
   - **Privacy Policy:** Include professional clauses detailing Secure Account Authentication via Clerk, relational database hosting sandboxes via Supabase, location spatial mapping analytics via PostGIS, and how uploaded pet health diagnostic triage images are handled strictly as temporary context vectors and never sold or leaked.
   - **Terms of Service:** Include standard workspace terms of use, specifying that our AI Triage engine is a high-speed guidance and diagnostic observation assistant, NOT a certified replacement for immediate professional emergency veterinary operations or clinical diagnosis.

4. **Footer Link Integration:** Open the main layout footer component. Update the anchors to use Next.js native `Link` components from `next/link`. Ensure their classes use `text-text-muted hover:text-text-primary transition-colors` so they scale gracefully across dark and light themes.

### Check when done
- Compilation succeeds.
- Section is fully responsive (collapses to mobile menu) and landing page shouldn't be affected.
- Styling is applied correctly via CSS tokens.
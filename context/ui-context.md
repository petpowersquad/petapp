# UI Context

## Theme

The application features a hybrid, high-contrast workspace theme explicitly designed for clarity and reliability. The interface uses a clean, light base canvas combined with deep, solid forest-green headers, side panels, and primary preview containers to emphasize its high-tech, AI-driven triage features. Buttons, active selection alerts, and critical calls-to-action use a vivid warm honey-amber color to guarantee strong visual hierarchy and simple scannability.

## Colors

All components must strictly utilize these CSS custom properties to ensure cross-page cohesion across components:

| Role             | CSS Variable       | Value     |
| ---------------- | ------------------ | --------- |
| Page background  | `--bg-base`        | `#FAFAFA` |
| Surface          | `--bg-surface`     | `#FFFFFF` |
| Dark Brand Panel | `--bg-brand-dark`  | `#11231E` |
| Primary text     | `--text-primary`   | `#1A1D20` |
| Muted text       | `--text-muted`     | `#5A6572` |
| Primary accent   | `--accent-primary` | `#EAA23B` |
| Border           | `--border-default` | `#E5E7EB` |
| Alert/Warning    | `--state-warning`  | `#E5A93C` |
| Success          | `--state-success`  | `#81B29A` |
| Error            | `--state-error`    | `#E65A5A` |

## Typography

| Role      | Font              | Variable       |
| --------- | ----------------- | -------------- |
| UI text   | Plus Jakarta Sans | `--font-sans`  |
| Display   | Lora/Merriweather | `--font-serif` |

## Border Radius

| Context           | Class            |
| ----------------- | ---------------- |
| Inline / small UI | `rounded-lg`     |
| Cards / panels    | `rounded-2xl`    |
| Main view borders | `rounded-3xl`    |

## Component Library

- shadcn/ui on top of Tailwind. Components live in components/ui/. Use the CLI to add new components rather than writing from scratch.
- Tailwind CSS utility architecture.

## Layout Patterns

- Split Screen Auth Layout: 50% screen split utilizing a solid brand dark container on the left containing quotes and statistics, and a crisp white surface on the right centering standard input forms
- Header / Footer Containment: Top full-width navigation bar and full-width footer anchored in solid --bg-brand-dark, creating a fixed dark frame around the bright operational UI data content.
- Grid Vitals Array: Multi-column dashboard grid patterns wrapping data boxes cleanly into individual blocks with crisp structural values (e.g., Total Scans, Next Checkup).

## Icons

- Lucide React. Stroke-based icons only.
- Sizes: h-4 w-4 for clean line data alignments (like alongside bulleted scan points), and h-5 w-5 inside functional action boxes or navigation bars.

import { Camera, MapPin, ClipboardList } from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────

const pillars = [
  {
    icon: Camera,
    emoji: "📸",
    label: "Computer Vision AI Triage",
    tagline: "Instant visual diagnostics from a single photo.",
    body: "An instant diagnostic assistant right in your pocket. Simply snap or upload a clear, close-up photo of your pet's physical symptoms—whether it is an unusual skin rash, eye redness, or ear irritation. Our specialized computer vision core analyzes the visual indicators instantly to provide dynamic urgency thresholds and clear triage categories, helping you decide whether a symptom warrants an immediate ER run or careful home observation.",
  },
  {
    icon: MapPin,
    emoji: "📍",
    label: "PostGIS Geospatial Intelligence",
    tagline: "Precision location mapping to verified clinics near you.",
    body: "Engineered with real-time spatial mapping capabilities. When your pet crosses critical urgency thresholds, you don't have time to sort through generic search engine results. Built on a high-performance database layer utilizing native PostGIS indexing, our system calculates precise geographic radiuses to instantly map your exact location against verified local veterinary clinics, 24/7 emergency hospitals, and specialized trauma centers.",
  },
  {
    icon: ClipboardList,
    emoji: "📋",
    label: "Full-Lifecycle Health Tracking",
    tagline: "A complete medical ledger from day one to every checkup.",
    body: "A centralized, digital medical ledger for your companion's lifecycle. Seamlessly log vaccination histories, document ongoing symptom developments, track growth milestones, and manage daily care tasks. Every record is securely handled and isolated under strict cloud authentication boundaries, giving you a comprehensive health timeline to share with your vet during checkups.",
  },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      {/* ── Hero / Core Vision ─────────────────────────────────────────── */}
      <section className="bg-[var(--bg-brand-dark)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Eyebrow */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
            Our Mission
          </p>

          {/* Headline */}
          <h1
            className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Redefining Pet Care Through{" "}
            <span className="text-[var(--accent-primary)]">
              Intelligent Triage.
            </span>
          </h1>

          {/* Divider */}
          <div className="mt-8 h-px w-16 bg-[var(--accent-primary)]" />

          {/* Body */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            We bridge the gap between home observation and veterinary care. By
            combining advanced artificial intelligence with precision geospatial
            infrastructure, we empower pet owners with immediate, actionable
            health clarity right when they need it most. Our mission is to
            eliminate the anxiety of uncertainty, transforming your smartphone
            into a supportive diagnostic lens that safeguards your companion&apos;s
            well-being.
          </p>
        </div>
      </section>

      {/* ── Section Header ─────────────────────────────────────────────── */}
      <section className="px-4 pb-4 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
            How It Works
          </p>
          <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            The Core Pillars
          </h2>
          <p className="mt-3 max-w-xl text-[var(--text-muted)]">
            Three integrated capabilities working together so you always know
            what to do next for your pet.
          </p>
        </div>
      </section>

      {/* ── Pillar Cards ───────────────────────────────────────────────── */}
      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex flex-col gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.label}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm"
              >
                {/* Card header row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  {/* Icon badge */}
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-brand-dark)]"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6 text-[var(--accent-primary)]" />
                  </div>

                  {/* Title block */}
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                      {pillar.label}
                    </h3>
                    {/* Tagline — the "general idea" */}
                    <p className="mt-1 text-sm font-semibold text-[var(--accent-primary)]">
                      {pillar.tagline}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-[var(--border-default)]" />

                {/* Body copy — the detailed content */}
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {pillar.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Closing CTA strip ──────────────────────────────────────────── */}
      <section className="border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
            Get Started
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            Your pet&apos;s health clarity starts with a single photo.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--text-muted)]">
            PAWPower is built for every owner — whether you&apos;re an experienced
            handler or welcoming your first companion. Accurate triage is now
            just a scan away.
          </p>
          <a
            href="/scan"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-[var(--bg-brand-dark)] shadow-sm transition-all hover:opacity-90 active:scale-95"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            Scan Your Pet
          </a>
        </div>
      </section>
    </main>
  );
}

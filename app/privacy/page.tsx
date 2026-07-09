import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | PAWPower",
  description:
    "Learn how PAWPower collects, uses, and protects your personal data and your pet's health information.",
};

// ─── Section Data ────────────────────────────────────────────────────────────

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>
          Welcome to <strong>PAWPower</strong>. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our web application and related services
          (collectively, the &ldquo;Service&rdquo;). Please read this policy carefully. If
          you do not agree with its terms, please discontinue use of the
          Service.
        </p>
        <p className="mt-4">
          We are committed to protecting the privacy of pet owners and the
          integrity of the data entrusted to us. This policy applies to all
          users worldwide and is designed to comply with applicable data
          protection regulations including GDPR and CCPA where relevant.
        </p>
      </>
    ),
  },
  {
    id: "data-collected",
    title: "2. Information We Collect",
    content: (
      <>
        <p>We collect information in the following categories:</p>
        <ul className="mt-4 space-y-3 list-none">
          {[
            {
              label: "Account Identity Data",
              body: "Your name, email address, and profile metadata supplied at registration and managed through our authentication provider.",
            },
            {
              label: "Pet Health Records",
              body: "Veterinary history, vaccination records, symptom logs, growth milestones, and care task data that you voluntarily enter into the Service.",
            },
            {
              label: "Uploaded Diagnostic Images",
              body: "Photos you submit for AI-assisted visual triage. See Section 5 for full details on how these are handled.",
            },
            {
              label: "Location Data",
              body: "Approximate or precise geographic coordinates you grant access to, used solely to surface nearby veterinary clinics and emergency hospitals.",
            },
            {
              label: "Usage & Analytics Data",
              body: "Page interactions, feature engagement, session durations, and device/browser metadata collected through standard web analytics tooling.",
            },
          ].map((item) => (
            <li
              key={item.label}
              className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3"
            >
              <span className="font-semibold text-[var(--text-primary)]">
                {item.label}:{" "}
              </span>
              <span className="text-[var(--text-muted)]">{item.body}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "authentication",
    title: "3. Secure Account Authentication — Clerk",
    content: (
      <>
        <p>
          PAWPower uses{" "}
          <strong className="text-[var(--text-primary)]">Clerk</strong> as its
          identity and authentication provider. Clerk handles the full
          lifecycle of user sessions including sign-up, sign-in, multi-factor
          authentication, and session token management.
        </p>
        <p className="mt-4">
          Your password and authentication credentials are <em>never</em>{" "}
          stored directly in PAWPower&apos;s database. All credential handling is
          delegated entirely to Clerk&apos;s SOC 2 Type II–certified infrastructure.
          Clerk may collect and process identity data as described in their own
          Privacy Policy, available at{" "}
          <a
            href="https://clerk.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-primary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            clerk.com/legal/privacy
          </a>
          .
        </p>
        <p className="mt-4">
          PAWPower only receives a verified user ID and minimal profile
          metadata (email, display name) from Clerk upon successful
          authentication. We use this identifier to associate your data records
          with your account in our database.
        </p>
      </>
    ),
  },
  {
    id: "database",
    title: "4. Relational Database Hosting — Supabase",
    content: (
      <>
        <p>
          All structured application data — pet profiles, health records,
          veterinary appointments, and care timelines — is stored in a{" "}
          <strong className="text-[var(--text-primary)]">Supabase</strong>{" "}
          PostgreSQL database hosted in isolated cloud infrastructure.
        </p>
        <p className="mt-4">
          Supabase provides row-level security (RLS) policies that enforce
          strict data ownership boundaries: your records are only accessible by
          authenticated sessions linked to your account. No other user can
          query, read, or modify your data.
        </p>
        <p className="mt-4">
          Supabase operates on enterprise-grade cloud infrastructure (AWS) with
          encryption at rest and in transit. Their data handling practices are
          described at{" "}
          <a
            href="https://supabase.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-primary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            supabase.com/privacy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "location",
    title: "5. Location Spatial Mapping — PostGIS",
    content: (
      <>
        <p>
          When you request nearby veterinary or emergency clinic recommendations,
          PAWPower may collect your device&apos;s geographic coordinates (latitude
          and longitude) with your explicit browser permission.
        </p>
        <p className="mt-4">
          This location data is processed by{" "}
          <strong className="text-[var(--text-primary)]">PostGIS</strong>, a
          geospatial extension to our PostgreSQL database, which calculates
          proximity radiuses against our verified clinic dataset. Location
          coordinates are used strictly in-session to generate search results
          and are <em>not</em> persisted to long-term storage, linked to your
          identity profile, or shared with third parties.
        </p>
        <p className="mt-4">
          You may decline location access at any time through your browser
          settings. Declining location access will disable the geospatial clinic
          finder feature but will not affect any other aspect of the Service.
        </p>
      </>
    ),
  },
  {
    id: "images",
    title: "6. Uploaded Pet Diagnostic Images",
    content: (
      <>
        <p>
          Images you upload for AI triage analysis are treated with the highest
          level of data sensitivity. The following commitments are absolute and
          non-negotiable:
        </p>
        <ul className="mt-4 space-y-3 list-none">
          {[
            {
              label: "Temporary Context Only",
              body: "Uploaded images are used exclusively as input context vectors for the AI triage inference pass. They are processed in-memory and are not retained beyond the scope of that single analysis request.",
            },
            {
              label: "No Persistent Image Storage",
              body: "We do not store your uploaded images in any long-term storage bucket, database, or file system beyond the duration of the active analysis session.",
            },
            {
              label: "Never Sold or Shared",
              body: "Your pet diagnostic images are never sold, licensed, rented, or disclosed to any third-party entity, advertiser, data broker, or AI training dataset provider under any circumstances.",
            },
            {
              label: "No Profiling",
              body: "Images are not analyzed for any purpose other than veterinary symptom triage. They are not used to infer demographic, behavioral, or personal attributes about you.",
            },
          ].map((item) => (
            <li
              key={item.label}
              className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3"
            >
              <span className="font-semibold text-[var(--text-primary)]">
                {item.label}:{" "}
              </span>
              <span className="text-[var(--text-muted)]">{item.body}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "data-sharing",
    title: "7. How We Share Information",
    content: (
      <>
        <p>
          PAWPower does not sell, trade, or rent your personal information to
          third parties. We may share data only in the following limited
          circumstances:
        </p>
        <ul className="mt-4 space-y-2 pl-6 list-disc text-[var(--text-muted)]">
          <li>
            <strong className="text-[var(--text-primary)]">
              Service Providers:
            </strong>{" "}
            With trusted infrastructure providers (Clerk, Supabase) solely for
            operating the Service as described in this policy.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">
              Legal Obligations:
            </strong>{" "}
            When required by applicable law, court order, or government
            authority, we will disclose the minimum information necessary to
            comply.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">
              Business Transfers:
            </strong>{" "}
            In the event of a merger, acquisition, or asset sale, user data
            may transfer to a successor entity under equivalent privacy
            protections with advance notice to affected users.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">
              With Your Consent:
            </strong>{" "}
            For any other purpose, only with your explicit, informed consent.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: (
      <>
        <p>
          Depending on your jurisdiction, you may have the following rights
          regarding your personal data:
        </p>
        <ul className="mt-4 space-y-2 pl-6 list-disc text-[var(--text-muted)]">
          <li>Access and receive a copy of the data we hold about you.</li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>
            Object to or restrict certain processing activities.
          </li>
          <li>
            Data portability — receive your data in a machine-readable format.
          </li>
          <li>
            Withdraw consent at any time where processing is consent-based.
          </li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, contact us at{" "}
          <a
            href="mailto:privacy@pawpower.app"
            className="text-[var(--accent-primary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            privacy@pawpower.app
          </a>
          . We will respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "9. Cookies & Tracking",
    content: (
      <p>
        PAWPower uses session cookies and local storage tokens to maintain your
        authenticated session and store UI preferences. We do not use
        third-party advertising cookies or behavioral tracking networks.
        Analytics data (if applicable) is collected in aggregate form and does
        not identify individual users. You may clear cookies at any time through
        your browser settings; doing so will sign you out of the Service.
      </p>
    ),
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: (
      <p>
        PAWPower is not directed at children under the age of 13. We do not
        knowingly collect personal information from children. If you believe a
        child has provided us with personal information, please contact us
        immediately at{" "}
        <a
          href="mailto:privacy@pawpower.app"
          className="text-[var(--accent-primary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          privacy@pawpower.app
        </a>{" "}
        and we will promptly delete that data.
      </p>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we
        will revise the &ldquo;Last Updated&rdquo; date at the top of this page and, where
        the changes are material, notify registered users by email or prominent
        in-app notice. Continued use of the Service after any update constitutes
        your acceptance of the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: (
      <p>
        For any questions, concerns, or data requests related to this Privacy
        Policy, please contact our Privacy Team at{" "}
        <a
          href="mailto:privacy@pawpower.app"
          className="text-[var(--accent-primary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          privacy@pawpower.app
        </a>
        . For general support inquiries, visit our support page or use the
        in-app help system.
      </p>
    ),
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  const lastUpdated = "July 9, 2026";

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-4 py-12 sm:px-6 lg:px-8">
      {/* ── Document Card ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">
        {/* Card wrapper */}
        <article className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 shadow-sm sm:p-10">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
              Legal
            </p>
            <h1 className="font-serif text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Last Updated:{" "}
              <time dateTime="2026-07-09">{lastUpdated}</time>
            </p>
            <p className="mt-5 leading-relaxed text-[var(--text-muted)]">
              PAWPower is built on a foundation of trust. This policy is plain,
              direct, and complete — describing exactly what data we collect,
              why we collect it, and the firm commitments we make to protect
              your information and your pet&apos;s health data.
            </p>
          </header>

          <hr className="border-[var(--border-default)]" />

          {/* ── Sections ───────────────────────────────────────────────── */}
          <div className="mt-8 space-y-10">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id}>
                <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                  {section.title}
                </h2>
                <div className="mt-4 font-sans text-[var(--text-muted)] leading-relaxed text-sm sm:text-base">
                  {section.content}
                </div>
                {index < sections.length - 1 && (
                  <hr className="mt-10 border-[var(--border-default)]" />
                )}
              </section>
            ))}
          </div>

          {/* ── Footer Nav ─────────────────────────────────────────────── */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[var(--border-default)] pt-8">
            <p className="text-xs text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} PAWPower. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs">
              <Link
                href="/terms"
                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors underline underline-offset-2"
              >
                Terms of Service
              </Link>
              <Link
                href="/"
                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors underline underline-offset-2"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

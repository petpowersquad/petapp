import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { InfoCard } from "@/components/info-card";
import {
  PawPrint,
  Sparkles,
  ChevronRight,
  Activity,
  Calendar,
  MapPin,
  Camera,
  Brain,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "AI Symptom Triage",
    description: "Instant image-based analysis",
    content:
      "Upload close-up photos of minor anomalies (skin irritation, swelling, red eyes). Our model assesses severity and returns clear, legally-compliant next steps.",
  },
  {
    icon: Calendar,
    title: "Dynamic Care Planner",
    description: "Interactive task management",
    content:
      "Schedule vaccination clinics, recurring tick treatments, and exercise goals. View personalized checklists synced per-pet to coordinate routines effortlessly.",
  },
  {
    icon: MapPin,
    title: "Local Vet Finder",
    description: "PostGIS geolocation indexing",
    content:
      "In critical situations, easily search and route to the closest emergency clinics. Vets can also self-register to share availability with owners.",
  },
] as const;

const scanSteps = [
  {
    icon: Camera,
    title: "Snap a photo",
    content: "Point your phone at your pet, anywhere, any light.",
  },
  {
    icon: Brain,
    title: "AI reads it",
    content: "Rocky checks breed markers and visible signs.",
  },
  {
    icon: FileText,
    title: "Get your report",
    content: "Results land instantly and save to your pet's timeline.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 text-center border-b border-border/10 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-semibold text-secondary-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5 text-secondary" /> Introducing AI-Powered Pet Triage
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight leading-tight">
            Give your pets the{" "}
            <span className="text-secondary underline decoration-wavy decoration-1 underline-offset-4">
              care
            </span>{" "}
            they deserve
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            PAWPower combines advanced AI triage scanning with a dynamic care planner, helping you
            track pet symptoms, schedule vaccinations, and find nearby vet services instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/scan"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "font-semibold px-6 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all",
              })}
            >
              Try AI Scan <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "font-semibold px-6 border-border hover:bg-slate-50",
              })}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-primary tracking-tight">
            Features designed for pet wellness
          </h2>
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            Everything you need to monitor health, manage schedules, and ensure peace of mind.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item) => (
            <InfoCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* How Scan Works Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-primary tracking-tight">
            How scan works
          </h2>
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            Three simple steps from photo to actionable insight.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {scanSteps.map((step) => (
            <InfoCard key={step.title} {...step} />
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-primary text-white py-16 px-6 text-center mt-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <PawPrint className="h-12 w-12 text-secondary mx-auto" />
          <h2 className="font-serif text-3xl font-bold tracking-tight">
            Ready to safeguard your pet&apos;s health?
          </h2>
          <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
            Create profiles, keep track of vital dates, and check symptoms anytime with our
            intelligent assistant.
          </p>
          <div className="pt-2">
            <Link
              href="/scan"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "font-semibold px-8 hover:scale-[1.02] active:scale-[0.98] hover:text-secondary transition-all",
              })}
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

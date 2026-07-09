import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PawPrint, Sparkles, Calendar, MapPin, Shield, ChevronRight, Activity } from "lucide-react";

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
            Give your pets the <span className="text-secondary underline decoration-wavy decoration-1 underline-offset-4">care</span> they deserve
          </h1>
          
          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            PAWPower combines advanced AI triage scanning with a dynamic care planner, helping you track pet symptoms, schedule vaccinations, and find nearby vet services instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/scan">
              <Button variant="secondary" size="lg" className="font-semibold px-6 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                Try AI Scan <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="font-semibold px-6 border-border hover:bg-slate-50">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-primary tracking-tight">Features designed for pet wellness</h2>
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            Everything you need to monitor health, manage schedules, and ensure peace of mind.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: AI Triage */}
          <Card className="border-border hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-3">
                <Activity className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold text-primary">AI Symptom Triage</CardTitle>
              <CardDescription>Instant image-based analysis</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-text-muted leading-relaxed">
              Upload close-up photos of minor anomalies (skin irritation, swelling, red eyes). Our model assesses severity and returns clear, legally-compliant next steps.
            </CardContent>
          </Card>

          {/* Card 2: Calendar & Care */}
          <Card className="border-border hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-3">
                <Calendar className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold text-primary">Dynamic Care Planner</CardTitle>
              <CardDescription>Interactive task management</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-text-muted leading-relaxed">
              Schedule vaccination clinics, recurring tick treatments, and exercise goals. View personalized checklists synced per-pet to coordinate routines effortlessly.
            </CardContent>
          </Card>

          {/* Card 3: Local Vet Finder */}
          <Card className="border-border hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-3">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold text-primary">Local Vet Finder</CardTitle>
              <CardDescription>PostGIS geolocation indexing</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-text-muted leading-relaxed">
              In critical situations, easily search and route to the closest emergency clinics. Vets can also self-register to share availability with owners.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-primary text-white py-16 px-6 text-center mt-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <PawPrint className="h-12 w-12 text-secondary mx-auto" />
          <h2 className="font-serif text-3xl font-bold tracking-tight">Ready to safeguard your pet&apos;s health?</h2>
          <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
            Create profiles, keep track of vital dates, and check symptoms anytime with our intelligent assistant.
          </p>
          <div className="pt-2">
            <Link href="/scan">
              <Button variant="secondary" size="lg" className="font-semibold px-8 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

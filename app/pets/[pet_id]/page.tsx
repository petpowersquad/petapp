import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  History,
  Scan,
  Weight,
  Ruler,
  PawPrint,
  Clock,
  BadgeCheck,
  Stethoscope,
} from "lucide-react";
import PetImageUpload from "./PetImageUpload";
import DeletePetButton from "./DeletePetButton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  age: number | null;
  age_unit: string | null;
  weight_kg: number | null;
  photo_url: string | null;
  // Supabase returns joined rows as an array; we pick the first element
  breeds: { name: string }[] | null;
}

interface HealthScan {
  id: string;
  scan_type: string;
  photo_url: string;
  raw_response: Record<string, unknown>;
  created_at: string;
}

interface PetEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  scheduled_at: string;
  is_completed: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAge(age: number | null, unit: string | null): string {
  if (age === null) return "Unknown";
  return `${age} ${unit ?? "years"}`;
}

function formatWeight(kg: number | null): string {
  if (kg === null) return "Unknown";
  return `${kg} kg`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  play: "Play",
  bath: "Bath",
  vaccination: "Vaccination",
  vet_visit: "Vet Visit",
  grooming: "Grooming",
  feeding: "Feeding",
  custom: "Custom",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  play: "bg-blue-50 text-blue-700 border-blue-100",
  bath: "bg-cyan-50 text-cyan-700 border-cyan-100",
  vaccination: "bg-red-50 text-red-700 border-red-100",
  vet_visit: "bg-purple-50 text-purple-700 border-purple-100",
  grooming: "bg-pink-50 text-pink-700 border-pink-100",
  feeding: "bg-green-50 text-green-700 border-green-100",
  custom: "bg-slate-50 text-slate-600 border-slate-200",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PetProfilePage({
  params,
}: {
  params: Promise<{ pet_id: string }>;
}) {
  const { pet_id } = await params;

  // ── Auth guard ────────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) notFound();

  // ── Supabase data ─────────────────────────────────────────────────────────
  const supabase = await createAuthenticatedClient();
  if (!supabase) notFound();

  // Fetch the pet (RLS already limits to owner, but we double-check owner_id
  // explicitly so non-owners get 404 rather than an empty result that might
  // leak info via error messages).
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("id, owner_id, name, species, age, age_unit, weight_kg, photo_url, breeds(name)")
    .eq("id", pet_id)
    .maybeSingle();

  if (petError || !pet) notFound();

  // Owner-only enforcement — anyone who guesses a UUID gets a clean 404
  if ((pet as Pet).owner_id !== userId) notFound();

  const typedPet = pet as Pet;

  // Fetch the latest scan (limit 1 ordered by date desc)
  const { data: latestScanArr } = await supabase
    .from("health_scans")
    .select("id, scan_type, photo_url, raw_response, created_at")
    .eq("pet_id", pet_id)
    .order("created_at", { ascending: false })
    .limit(1);

  const latestScan: HealthScan | null =
    latestScanArr && latestScanArr.length > 0
      ? (latestScanArr[0] as HealthScan)
      : null;

  // Fetch full scan history
  const { data: scanHistory } = await supabase
    .from("health_scans")
    .select("id, scan_type, photo_url, raw_response, created_at")
    .eq("pet_id", pet_id)
    .order("created_at", { ascending: false });

  const typedScans: HealthScan[] = (scanHistory as HealthScan[]) ?? [];

  // Fetch upcoming + recent events
  const { data: eventsData } = await supabase
    .from("pet_events")
    .select("id, title, description, event_type, scheduled_at, is_completed")
    .eq("pet_id", pet_id)
    .order("scheduled_at", { ascending: true });

  const typedEvents: PetEvent[] = (eventsData as PetEvent[]) ?? [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">
              {typedPet.name}&apos;s Profile
            </h1>
            <p className="text-sm text-text-muted capitalize">
              {typedPet.species} {typedPet.breeds?.[0]?.name ? `· ${typedPet.breeds[0].name}` : ""}
            </p>
          </div>
        {/* Header actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <a
              href="/scan"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm px-3 h-8 hover:opacity-90 transition-opacity"
            >
              <Scan className="h-4 w-4" />
              Scan {typedPet.name}
            </a>
            <DeletePetButton petId={typedPet.id} petName={typedPet.name} />
          </div>
        </div>

        {/* ── Top Grid: Image + Info + Latest Insight ── */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Pet Image */}
          <PetImageUpload
            petId={typedPet.id}
            petName={typedPet.name}
            photoUrl={typedPet.photo_url}
          />

          {/* Pet Info */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-secondary" />
                <CardTitle className="text-lg font-bold text-primary">Pet Info</CardTitle>
              </div>
              <CardDescription>Basic details about {typedPet.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <InfoRow
                icon={<BadgeCheck className="h-4 w-4 text-text-muted" />}
                label="Name"
                value={typedPet.name}
              />
              <InfoRow
                icon={<PawPrint className="h-4 w-4 text-text-muted" />}
                label="Species"
                value={<span className="capitalize">{typedPet.species}</span>}
              />
              <InfoRow
                icon={<Stethoscope className="h-4 w-4 text-text-muted" />}
                label="Breed"
                value={typedPet.breeds?.[0]?.name ?? "Unknown"}
              />
              <InfoRow
                icon={<Ruler className="h-4 w-4 text-text-muted" />}
                label="Age"
                value={formatAge(typedPet.age, typedPet.age_unit)}
              />
              <InfoRow
                icon={<Weight className="h-4 w-4 text-text-muted" />}
                label="Weight"
                value={formatWeight(typedPet.weight_kg)}
              />
            </CardContent>
          </Card>

          {/* Latest AI Health Insight */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold text-primary">AI Health Insight</CardTitle>
              </div>
              <CardDescription>Latest triage report for {typedPet.name}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {latestScan ? (
                <LatestScanInsight scan={latestScan} />
              ) : (
                <div className="rounded-xl bg-slate-50 border border-border p-4 text-center space-y-2">
                  <Activity className="h-8 w-8 text-text-muted mx-auto" />
                  <p className="text-sm text-text-muted">
                    No scans yet. Upload a photo to get {typedPet.name}&apos;s first health report.
                  </p>
                  <a
                    href="/scan"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary text-secondary-foreground font-semibold text-xs px-2.5 h-7 hover:opacity-90 transition-opacity mt-2"
                  >
                    <Scan className="h-3.5 w-3.5" /> Start Scan
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Bottom Grid: Scan History + Events ── */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Scan History */}
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-primary">Scan History</CardTitle>
                <CardDescription>All triage checks for {typedPet.name}</CardDescription>
              </div>
              <History className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="pt-2">
              {typedScans.length === 0 ? (
                <EmptyState
                  icon={<History className="h-8 w-8 text-text-muted" />}
                  message="No scan history yet."
                />
              ) : (
                <ScrollArea className="h-72">
                  <div className="space-y-3 pr-3">
                    {typedScans.map((scan) => (
                      <ScanHistoryItem key={scan.id} scan={scan} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Tasks & Events */}
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-primary">Tasks & Events</CardTitle>
                <CardDescription>Scheduled care for {typedPet.name}</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="pt-2">
              {typedEvents.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="h-8 w-8 text-text-muted" />}
                  message="No events scheduled yet."
                />
              ) : (
                <ScrollArea className="h-72">
                  <div className="space-y-3 pr-3">
                    {typedEvents.map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold text-primary">{value}</span>
    </div>
  );
}

function LatestScanInsight({ scan }: { scan: HealthScan }) {
  // Pull a plain text summary from raw_response if present
  const raw = scan.raw_response;
  const summary =
    typeof raw?.summary === "string"
      ? raw.summary
      : typeof raw?.insight === "string"
      ? raw.insight
      : typeof raw?.result === "string"
      ? raw.result
      : "Scan completed. View details below.";

  const hasWarning =
    typeof raw?.status === "string" &&
    (raw.status === "warning" || raw.status === "critical");

  return (
    <div
      className={`rounded-xl p-4 border text-xs leading-relaxed ${
        hasWarning
          ? "bg-amber-50 border-amber-100 text-amber-900"
          : "bg-emerald-50 border-emerald-100 text-emerald-900"
      }`}
    >
      <div className="flex items-center gap-1.5 font-bold mb-2">
        {hasWarning ? (
          <AlertTriangle className="h-4 w-4 text-state-warning" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-state-success" />
        )}
        {hasWarning ? "Attention Needed" : "All Clear"}
      </div>
      <p>{summary}</p>
      <div className="mt-2 flex items-center gap-1 text-text-muted">
        <Clock className="h-3.5 w-3.5" />
        <span className="text-[10px] uppercase font-medium tracking-wide">
          {new Date(scan.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

function ScanHistoryItem({ scan }: { scan: HealthScan }) {
  const raw = scan.raw_response;
  const summary =
    typeof raw?.summary === "string"
      ? raw.summary
      : typeof raw?.result === "string"
      ? raw.result
      : "Scan completed.";
  const status =
    typeof raw?.status === "string" ? raw.status : "success";

  return (
    <div className="p-3.5 rounded-lg border border-border bg-card hover:bg-slate-50/50 transition-colors">
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-semibold text-primary capitalize">
          {scan.scan_type.replace("_", " ")} Scan
        </span>
        <span className="text-xs text-text-muted">{new Date(scan.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>
      <p className="text-xs text-text-muted line-clamp-2">{summary}</p>
      <div className="mt-2 flex items-center gap-1">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "success" || status === "healthy"
              ? "bg-state-success"
              : status === "warning"
              ? "bg-state-warning"
              : "bg-state-error"
          }`}
        />
        <span className="text-[10px] font-medium text-text-muted uppercase">
          {status} triage
        </span>
      </div>
    </div>
  );
}

function EventItem({ event }: { event: PetEvent }) {
  const colorClass =
    EVENT_TYPE_COLORS[event.event_type] ?? EVENT_TYPE_COLORS.custom;
  const label = EVENT_TYPE_LABELS[event.event_type] ?? event.event_type;

  return (
    <div
      className={`flex items-start justify-between p-3 rounded-lg border border-border bg-card transition-colors ${
        event.is_completed ? "opacity-60" : "hover:bg-slate-50/50"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 text-text-muted">
          {event.is_completed ? (
            <CheckCircle2 className="h-4 w-4 text-state-success" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0">
          <div
            className={`text-sm font-medium text-primary ${
              event.is_completed ? "line-through text-text-muted" : ""
            }`}
          >
            {event.title}
          </div>
          {event.description && (
            <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
              {event.description}
            </p>
          )}
          <div className="mt-1 text-[10px] text-text-muted flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatEventDate(event.scheduled_at)}
          </div>
        </div>
      </div>
      <span
        className={`shrink-0 ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorClass}`}
      >
        {label}
      </span>
    </div>
  );
}

function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      {icon}
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}

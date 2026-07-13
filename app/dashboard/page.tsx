import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";
import DashboardClient, { type Pet, type HealthScan, type PetEvent } from "./DashboardClient";

export default async function DashboardPage() {
  // ── Auth ───────────────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // ── Authenticated Supabase client (RLS active, Clerk JWT) ─────────────────
  const supabase = await createAuthenticatedClient();
  if (!supabase) redirect("/sign-in");

  // Fetch pets (with breed name) — RLS filters to owner automatically
  const { data: petsData } = await supabase
    .from("pets")
    .select("id, name, species, age, age_unit, weight_kg, photo_url, breeds(name)")
    .order("created_at", { ascending: false });

  // Fetch recent scans across all pets owned by this user (via RLS)
  const { data: scansData } = await supabase
    .from("health_scans")
    .select("id, pet_id, scan_type, photo_url, raw_response, created_at, pets(name)")
    .order("created_at", { ascending: false })
    .limit(20);

  // Fetch upcoming events for the current week and beyond, across all pets
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const { data: eventsData } = await supabase
    .from("pet_events")
    .select("id, pet_id, title, description, event_type, scheduled_at, is_completed, pets!inner(name, owner_id)")
    .gte("scheduled_at", weekStart.toISOString())
    .lte("scheduled_at", weekEnd.toISOString())
    .order("scheduled_at", { ascending: true });

  const pets = (petsData as Pet[]) ?? [];
  const scans = (scansData as HealthScan[]) ?? [];
  const events = (eventsData as PetEvent[]) ?? [];

  return (
    <DashboardClient
      initialPets={pets}
      initialScans={scans}
      initialEvents={events}
    />
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";
import CalendarClient, { type CalendarEvent, type Pet } from "./CalendarClient";

export default async function CalendarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = await createAuthenticatedClient();
  if (!supabase) redirect("/sign-in");

  // Fetch all events for this user across all pets (RLS filters automatically)
  const { data: eventsData } = await supabase
    .from("pet_events")
    .select("id, pet_id, title, description, event_type, scheduled_at, is_completed, pets!inner(name, owner_id)")
    .order("scheduled_at", { ascending: true });

  // Fetch user's pets for the selector and color coding
  const { data: petsData } = await supabase
    .from("pets")
    .select("id, name, species")
    .order("name");

  const events = (eventsData as unknown as CalendarEvent[]) ?? [];
  const pets = (petsData as Pet[]) ?? [];

  return <CalendarClient initialEvents={events} pets={pets} />;
}

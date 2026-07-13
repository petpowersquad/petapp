import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";

const VALID_EVENT_TYPES = ["play", "bath", "vaccination", "vet_visit", "grooming", "feeding", "custom"] as const;
type EventType = typeof VALID_EVENT_TYPES[number];

interface CreateEventBody {
  pet_id: string;
  title: string;
  description?: string | null;
  event_type: EventType;
  scheduled_at: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createAuthenticatedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range"); // "week" | null (all)

  let query = supabase
    .from("pet_events")
    .select("id, pet_id, title, description, event_type, scheduled_at, is_completed, pets!inner(name, owner_id)")
    .order("scheduled_at", { ascending: true });

  if (range === "week") {
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    query = query
      .gte("scheduled_at", weekStart.toISOString())
      .lte("scheduled_at", weekEnd.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("[GET /api/events] error:", error);
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: CreateEventBody;
  try {
    body = (await request.json()) as CreateEventBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { pet_id, title, description, event_type, scheduled_at } = body;

  if (!pet_id || typeof pet_id !== "string") {
    return NextResponse.json({ error: "pet_id is required" }, { status: 400 });
  }
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (description !== undefined && description !== null && typeof description !== "string") {
    return NextResponse.json({ error: "description must be a string or null" }, { status: 400 });
  }
  if (!VALID_EVENT_TYPES.includes(event_type)) {
    return NextResponse.json({ error: `event_type must be one of: ${VALID_EVENT_TYPES.join(", ")}` }, { status: 400 });
  }
  if (!scheduled_at || isNaN(Date.parse(scheduled_at))) {
    return NextResponse.json({ error: "scheduled_at must be a valid ISO date string" }, { status: 400 });
  }

  const supabase = await createAuthenticatedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify the pet belongs to this user (RLS also enforces this, but explicit check gives better error)
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("id, owner_id")
    .eq("id", pet_id)
    .maybeSingle();

  if (petError || !pet) {
    return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("pet_events")
    .insert({
      pet_id,
      title: title.trim(),
      description: typeof description === "string" ? description.trim() || null : null,
      event_type,
      scheduled_at,
      is_completed: false,
      is_ai_generated: false,
    })
    .select("id, pet_id, title, description, event_type, scheduled_at, is_completed, pets!inner(name, owner_id)")
    .single();

  if (error) {
    console.error("[POST /api/events] insert error:", error);
    return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { event_id } = await params;

  let body: { is_completed: boolean };
  try {
    body = (await request.json()) as { is_completed: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // ── Authenticated Supabase client (RLS active, Clerk JWT) ──────────────────
  const supabase = await createAuthenticatedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // RLS policy "Owners can manage events" enforces ownership via get_my_id()
  const { error } = await supabase
    .from("pet_events")
    .update({ is_completed: body.is_completed })
    .eq("id", event_id);

  if (error) {
    console.error("[PATCH /api/events/toggle] update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

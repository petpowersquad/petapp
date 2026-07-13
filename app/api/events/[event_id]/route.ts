import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { event_id } = await params;

  const supabase = await createAuthenticatedClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // RLS policy "Owners can manage events" enforces ownership via get_my_id()
  const { data, error } = await supabase
    .from("pet_events")
    .delete()
    .eq("id", event_id)
    .select("id");

  if (error) {
    console.error("[DELETE /api/events/:id] error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

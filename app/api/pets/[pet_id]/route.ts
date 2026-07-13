import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ pet_id: string }> }
): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pet_id } = await params;

  const supabase = await createAuthenticatedClient();
  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Verify ownership ──────────────────────────────────────────────────────
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("id, owner_id")
    .eq("id", pet_id)
    .maybeSingle();

  if (petError || !pet) {
    return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  }

  if ((pet as { owner_id: string }).owner_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Delete pet row — cascades to pet_events and health_scans via FK ───────
  const { error: deleteError } = await supabase
    .from("pets")
    .delete()
    .eq("id", pet_id);

  if (deleteError) {
    console.error("[DELETE /api/pets/:pet_id] error:", deleteError);
    return NextResponse.json(
      { error: "Failed to delete pet. Please try again." },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";

const BUCKET = "pet-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pet_id: string }> }
): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pet_id } = await params;

  // ── Parse multipart body ──────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG and WebP images are accepted" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image must be under 5 MB" },
      { status: 400 }
    );
  }

  // ── Verify ownership via authenticated client (RLS active) ────────────────
  const supabase = await createAuthenticatedClient();
  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  // ── Upload to Supabase Storage via authenticated client (RLS active) ────────
  // Using the authenticated client ensures Supabase sets owner_id to the
  // current user's ID, so the update/delete ownership policies can match.
  // We avoid upsert:true because Supabase evaluates an upsert against the
  // UPDATE policy when the object already exists — which requires owner_id
  // to be set from a prior upload. Instead, remove any existing object first
  // (DELETE policy applies, harmless if it doesn't exist) then do a plain INSERT.
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const storagePath = `${userId}/${pet_id}.${ext}`;

  // Remove existing object if present — ignore errors (object may not exist yet)
  await supabase.storage.from(BUCKET).remove([storagePath]);

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
    });

  if (uploadError) {
    console.error("[upload-photo] storage error:", uploadError);
    return NextResponse.json(
      { error: "Storage upload failed. Please try again." },
      { status: 500 }
    );
  }

  // ── Get public URL ────────────────────────────────────────────────────────
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // ── Persist URL to pets row via authenticated client (RLS active) ─────────
  const { error: updateError } = await supabase
    .from("pets")
    .update({ photo_url: publicUrl })
    .eq("id", pet_id);

  if (updateError) {
    console.error("[upload-photo] db update error:", updateError);
    return NextResponse.json(
      { error: "Failed to save photo URL. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ photo_url: publicUrl });
}

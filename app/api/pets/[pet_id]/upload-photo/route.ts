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
    .select("id, owner_id, photo_url")
    .eq("id", pet_id)
    .maybeSingle();

  if (petError || !pet) {
    return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  }

  if ((pet as { owner_id: string }).owner_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Upload to Supabase Storage via authenticated client (RLS active) ────────
  // Upload to a unique key first so the existing photo is preserved if the
  // upload fails. Only delete the old object after the DB update succeeds.
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const storagePath = `${userId}/${pet_id}-${Date.now()}.${ext}`;

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
    // New object uploaded but DB update failed — clean up the orphaned upload
    await supabase.storage.from(BUCKET).remove([storagePath]);
    return NextResponse.json(
      { error: "Failed to save photo URL. Please try again." },
      { status: 500 }
    );
  }

  // ── Best-effort cleanup of the previous object ────────────────────────────
  const previousUrl = (pet as { photo_url: string | null }).photo_url;
  if (previousUrl) {
    // Extract the storage path from the public URL: everything after /object/public/{bucket}/
    const marker = `/object/public/${BUCKET}/`;
    const markerIdx = previousUrl.indexOf(marker);
    if (markerIdx !== -1) {
      const oldPath = decodeURIComponent(previousUrl.slice(markerIdx + marker.length));
      // Only remove if it's a different object (guard against same-path edge cases)
      if (oldPath && oldPath !== storagePath) {
        await supabase.storage.from(BUCKET).remove([oldPath]);
      }
    }
  }

  return NextResponse.json({ photo_url: publicUrl });
}

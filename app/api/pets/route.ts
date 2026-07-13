import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";

interface CreatePetBody {
  name: string;
  species: string;
  breed_id?: string | null;
  age?: number | null;
  age_unit?: string | null;
  weight_kg?: number | null;
  photo_url?: string | null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── Auth ───────────────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse & validate body ──────────────────────────────────────────────────
  let body: CreatePetBody;
  try {
    body = (await request.json()) as CreatePetBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, species, breed_id, age, age_unit, weight_kg, photo_url } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Pet name is required" }, { status: 400 });
  }

  const validSpecies = ["dog", "cat", "other"];
  if (!species || !validSpecies.includes(species)) {
    return NextResponse.json(
      { error: "species must be one of: dog, cat, other" },
      { status: 400 }
    );
  }

  // ── Authenticated Supabase client (RLS active, Clerk JWT) ──────────────────
  const supabase = await createAuthenticatedClient();
  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("pets")
    .insert({
      owner_id: userId,
      name: name.trim(),
      species,
      breed_id: breed_id ?? null,
      age: age ?? null,
      age_unit: age_unit ?? null,
      weight_kg: weight_kg ?? null,
      photo_url: photo_url ?? null,
    })
    .select("id, name, species, photo_url")
    .single();

  if (error) {
    console.error("[POST /api/pets] insert error:", error);
    return NextResponse.json(
      { error: "Failed to create pet. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}

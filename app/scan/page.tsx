import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/utils/supabase/server-auth";
import ScanClient, { type Pet } from "./ScanClient";

async function fetchPets(): Promise<Pet[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = await createAuthenticatedClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("pets")
    .select("id, name, species")
    .order("name");

  if (error) {
    console.error("[ScanPage] fetchPets error:", error);
    return [];
  }

  return (data ?? []) as Pet[];
}

export default async function ScanPage() {
  const pets = await fetchPets();
  return <ScanClient pets={pets} />;
}

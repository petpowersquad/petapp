import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Creates a Supabase client authenticated with the current Clerk user's JWT.
 * The JWT is signed with the Supabase JWT secret via the "supabase" Clerk template,
 * so Supabase can verify it and RLS policies using get_my_id() / auth.jwt() work correctly.
 *
 * Returns null if the user is not authenticated.
 */
export async function createAuthenticatedClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  if (!token) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        // Disable Supabase's own session management — Clerk owns auth
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

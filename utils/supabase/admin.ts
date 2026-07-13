import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client using the service role key.
 * Bypasses RLS — use ONLY for server-side privileged operations
 * (e.g. storage upsert) where the application code enforces ownership.
 *
 * Never expose this client or the service role key to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

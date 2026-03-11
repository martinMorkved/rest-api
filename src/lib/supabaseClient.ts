import { createClient } from '@supabase/supabase-js';

/**
 * Server-side only. Use in API routes (e.g. app/api/status/route.ts).
 * Never expose this client or the service_role key to the browser.
 */
export function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY må være satt i .env.local'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

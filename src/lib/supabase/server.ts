import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY,
  SUPABASE_URL,
  hasServiceRole,
  isSupabaseConfigured,
} from "./config";

/**
 * Request-scoped client that carries the signed-in portal user, so row-level
 * security applies exactly as it does in the database.
 */
export async function getServerSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Anonymous read client for public pages. No cookies, no session — it only ever
 * sees rows that RLS exposes to `anon`, which is published content.
 */
export function getPublicSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Service-role client. Bypasses RLS, so it is confined to server actions and
 * route handlers that write enquiries or perform administrative work.
 */
export function getServiceSupabase(): SupabaseClient | null {
  if (!hasServiceRole) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

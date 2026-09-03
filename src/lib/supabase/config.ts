/**
 * Supabase is optional at build and run time. The site renders completely from
 * the seed content with no environment configured, which is what makes it
 * deployable before the project exists and resilient if it goes down.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Service-role access is required for portal writes and enquiry storage. */
export const hasServiceRole = Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);

export const STORAGE_BUCKETS = {
  media: "media",
  documents: "documents",
  enquiries: "enquiry-attachments",
} as const;

import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/* ============================================================================
   PORTAL SESSION

   A signed-in auth user is not enough — access requires an active row in
   `portal_users`. That is what lets an account be revoked without deleting the
   authentication record, and it is the same rule the database policies enforce,
   so the interface and the data layer cannot disagree.

   PREVIEW MODE
   ------------
   When Supabase is not configured at all, the portal opens read-only against
   the seed content instead of dead-ending on the setup page. This is safe by
   construction rather than by policy: with no database there are no enquiries,
   no customers and no users to expose, and every write action fails at the
   point it asks for a client. It is not a bypass flag — the moment credentials
   exist, real authentication is required and preview mode is unreachable.
   ========================================================================= */

export type PortalRole = "owner" | "admin" | "editor" | "viewer";

export interface PortalSession {
  id: string;
  email: string;
  fullName: string | null;
  role: PortalRole;
  /** True when running against seed content with no database behind it. */
  preview?: boolean;
}

const RANK: Record<PortalRole, number> = { viewer: 0, editor: 1, admin: 2, owner: 3 };

export function atLeast(role: PortalRole, minimum: PortalRole) {
  return RANK[role] >= RANK[minimum];
}

const PREVIEW_SESSION: PortalSession = {
  id: "preview",
  email: "preview@localhost",
  fullName: "Preview",
  role: "admin",
  preview: true,
};

export const getPortalSession = cache(async (): Promise<PortalSession | null> => {
  if (!isSupabaseConfigured) return PREVIEW_SESSION;

  const supabase = await getServerSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("portal_users")
    .select("id, email, full_name, role, active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.active) return null;

  return {
    id: profile.id as string,
    email: (profile.email as string) ?? user.email ?? "",
    fullName: (profile.full_name as string | null) ?? null,
    role: profile.role as PortalRole,
  };
});

/** Guards a portal route. Redirects rather than throwing, so links behave. */
export async function requirePortalSession(minimum: PortalRole = "viewer") {
  const session = await getPortalSession();
  if (!session) redirect("/portal/login");
  if (!atLeast(session.role, minimum)) redirect("/portal?denied=1");

  return session;
}

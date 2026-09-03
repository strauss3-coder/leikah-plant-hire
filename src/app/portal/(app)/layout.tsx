import { PortalShell, type Badges } from "@/components/portal/PortalShell";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";

/**
 * Everything under this layout is authenticated. The guard redirects rather
 * than rendering an error, so a bookmark to a deep portal page lands on the
 * sign-in screen and continues afterwards.
 */
export default async function PortalAppLayout({ children }: LayoutProps<"/portal">) {
  const session = await requirePortalSession("viewer");
  const supabase = await getServerSupabase();

  const badges: Badges = { quotes: 0, messages: 0, applications: 0 };

  if (supabase) {
    const [quotes, messages, applications] = await Promise.all([
      supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    ]);
    badges.quotes = quotes.count ?? 0;
    badges.messages = messages.count ?? 0;
    badges.applications = applications.count ?? 0;
  }

  return (
    <PortalShell
      user={{ email: session.email, fullName: session.fullName, role: session.role }}
      badges={badges}
      preview={session.preview}
    >
      {children}
    </PortalShell>
  );
}

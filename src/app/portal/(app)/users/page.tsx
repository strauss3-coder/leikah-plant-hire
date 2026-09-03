import { Users } from "lucide-react";
import { PageShell, PageTitle, Panel, EmptyState, Chip } from "@/components/portal/Primitives";
import { UserTable } from "@/components/portal/UserTable";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";

/**
 * Access is granted by a row in portal_users, not by having an auth account.
 * That is deliberate: revoking access is a single flag here and takes effect
 * immediately, in the database policies as well as the interface.
 */
export default async function UsersPage() {
  const session = await requirePortalSession("admin");
  const supabase = await getServerSupabase();

  const { data } = supabase
    ? await supabase
        .from("portal_users")
        .select("id, email, full_name, role, active, last_seen_at, created_at")
        .order("created_at", { ascending: true })
    : { data: null };

  const users = data ?? [];

  return (
    <PageShell>
      <PageTitle
        title="Users & permissions"
        description="Who can sign in, and what they may change."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Users" }]}
      />

      <Panel
        title="Roles"
        description="Applied by the database itself, so the interface and the data agree."
        className="mb-6"
      >
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Owner", "Everything, including other owners."],
            ["Admin", "All content, settings, users and the audit log."],
            ["Editor", "Create, edit and publish content and handle enquiries."],
            ["Viewer", "Read-only. Can see content and enquiries but change nothing."],
          ].map(([role, description]) => (
            <div key={role}>
              <dt className="mb-1.5">
                <Chip tone={role === "Owner" ? "gold" : "neutral"}>{role}</Chip>
              </dt>
              <dd className="text-xs leading-relaxed text-steel-400">{description}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title={`${users.length} account${users.length === 1 ? "" : "s"}`} className="overflow-hidden">
        {users.length ? (
          <UserTable users={users} currentUserId={session.id} />
        ) : (
          <EmptyState
            icon={<Users className="size-8" />}
            title="No portal users"
            description="Invite a user from Supabase Authentication, then add the matching row to portal_users with the role they should have."
          />
        )}
      </Panel>
    </PageShell>
  );
}

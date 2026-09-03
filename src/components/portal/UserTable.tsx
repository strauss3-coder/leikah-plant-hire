"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Chip } from "./Primitives";
import { updatePortalUser } from "@/lib/portal/actions";
import { formatDate, cn } from "@/lib/utils";

interface PortalUserRow {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  active: boolean;
  last_seen_at: string | null;
  created_at: string;
}

const ROLES = ["owner", "admin", "editor", "viewer"];

export function UserTable({
  users,
  currentUserId,
}: {
  users: PortalUserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const change = (id: string, patch: { role?: string; active?: boolean }) => {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const result = await updatePortalUser({ id, ...patch });
      setBusyId(null);
      if (!result.ok) setError(result.message);
      else router.refresh();
    });
  };

  return (
    <>
      {error && (
        <p className="chamfer-sm mb-4 flex items-start gap-2 border border-signal-red/45 bg-signal-red/8 p-3 text-xs text-steel-200">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-signal-red" />
          {error}
        </p>
      )}

      <div className="-m-6 overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="border-b border-steel-600/15 text-left">
              <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Account</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Role</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Status</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-600/10">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="transition-colors hover:bg-ink-850">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-paper-50">
                      {user.full_name ?? user.email}
                      {isSelf && <span className="ml-2 text-xs text-steel-500">(you)</span>}
                    </p>
                    <p className="mt-0.5 text-xs text-steel-500">{user.email}</p>
                  </td>

                  <td className="px-6 py-4">
                    {isSelf ? (
                      <Chip tone="gold">{user.role}</Chip>
                    ) : (
                      <select
                        value={user.role}
                        disabled={busyId === user.id}
                        onChange={(e) => change(user.id, { role: e.target.value })}
                        className="chamfer-sm h-9 border border-steel-600/25 bg-ink-950 px-3 text-xs capitalize text-paper-50 focus:border-gold-500/70 focus:outline-none"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {isSelf ? (
                      <Chip tone="green">active</Chip>
                    ) : (
                      <button
                        type="button"
                        disabled={busyId === user.id}
                        onClick={() => change(user.id, { active: !user.active })}
                        className={cn(
                          "chamfer-sm inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                          user.active
                            ? "border-signal-green/40 text-signal-green hover:border-signal-red/50 hover:text-signal-red"
                            : "border-steel-600/30 text-steel-400 hover:border-signal-green/50 hover:text-signal-green",
                        )}
                      >
                        {busyId === user.id && <Loader2 className="size-3 animate-spin" />}
                        {user.active ? "Active" : "Revoked"}
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4 text-xs text-steel-500">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

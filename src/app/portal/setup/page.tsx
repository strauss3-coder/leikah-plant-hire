import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Database, KeyRound, Terminal, UserPlus } from "lucide-react";
import { LeikahLogo } from "@/components/brand/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SurveyGrid } from "@/components/graphics/Atmosphere";

/* ============================================================================
   SETUP GUIDE

   Shown while Supabase is not connected. The site itself runs perfectly without
   it — this screen exists so whoever picks the project up knows exactly what to
   do rather than meeting a blank login form that cannot work.
   ========================================================================= */

const STEPS = [
  {
    icon: Database,
    title: "Create the Supabase project",
    body: "Create a project at supabase.com in a region close to South Africa — eu-west-1 or eu-central-1 both perform well from Mpumalanga.",
  },
  {
    icon: Terminal,
    title: "Run the migrations, in order",
    body: "From the SQL editor, run supabase/migrations/0001_schema.sql, then 0002_rls.sql, 0003_storage.sql and finally 0004_seed.sql. The seed puts the database into exactly the state the site currently renders from.",
    code: "supabase db push        # or paste each file into the SQL editor",
  },
  {
    icon: KeyRound,
    title: "Add the environment variables",
    body: "Copy .env.example to .env.local and fill in the three values from Project Settings → API. The service-role key is server-only and must never be committed or exposed to the browser.",
    code: `NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://leikahplanthire.co.za`,
  },
  {
    icon: UserPlus,
    title: "Create the first portal user",
    body: "Invite yourself from Supabase Authentication → Users, then add the matching row to portal_users with the owner role. Access is granted by that row, not by the auth account alone.",
    code: `insert into portal_users (id, email, full_name, role)
values ('<auth-user-uuid>', 'you@leikahplanthire.co.za', 'Your Name', 'owner');`,
  },
];

export default function PortalSetupPage() {
  // Once the keys are in place this page has nothing left to say.
  if (isSupabaseConfigured) redirect("/portal/login");

  return (
    <div className="relative isolate min-h-svh overflow-hidden">
      <SurveyGrid opacity={0.4} />

      <div className="relative mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
        <LeikahLogo className="h-10 w-auto text-paper-50" />

        <h1 className="mt-10 text-3xl font-bold tracking-tight text-paper-50 sm:text-4xl">
          Connect the database to open the portal
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-300">
          The public website is running from the content shipped in{" "}
          <code className="font-mono text-sm text-gold-400">src/content/seed</code>, so nothing is
          broken. The portal needs Supabase before it can edit anything — four steps.
        </p>

        <ol className="mt-12 flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="chamfer border border-steel-600/18 bg-ink-900 p-6 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="chamfer-sm inline-flex size-11 shrink-0 items-center justify-center border border-gold-500/35 text-gold-400">
                  <step.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-steel-500 tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-base font-bold text-paper-50">{step.title}</h2>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-steel-400">{step.body}</p>
                  {step.code && (
                    <pre className="chamfer-sm mt-4 overflow-x-auto border border-steel-600/20 bg-ink-950 p-4 font-mono text-xs leading-relaxed text-steel-300">
                      {step.code}
                    </pre>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="chamfer-sm inline-flex h-11 items-center gap-2 border border-steel-600/25 px-5 text-sm font-medium text-steel-200 transition-colors hover:border-gold-500/50"
          >
            <ArrowLeft className="size-4" />
            Back to the site
          </Link>
          <p className="text-xs text-steel-500">
            The full walkthrough is in <code className="font-mono">README.md</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

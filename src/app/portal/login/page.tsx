import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LeikahLogo } from "@/components/brand/Logo";
import { LoginForm } from "@/components/portal/LoginForm";
import { SurveyGrid, GoldBloom } from "@/components/graphics/Atmosphere";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getPortalSession } from "@/lib/portal/auth";

export default async function PortalLoginPage() {
  if (!isSupabaseConfigured) redirect("/portal/setup");

  // In a static export there is no session to redirect on, and a build-time
  // redirect cannot be exported at all — so only bounce a real signed-in user.
  const session = process.env.STATIC_EXPORT === "1" ? null : await getPortalSession();
  if (session) redirect("/portal");

  return (
    <div className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-6 py-16">
      <SurveyGrid opacity={0.45} />
      <GoldBloom className="left-1/2 -top-40 -translate-x-1/2" size="46rem" />

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center">
          <LeikahLogo className="h-10 w-auto text-paper-50" />
        </div>

        <div className="chamfer mt-10 border border-steel-600/18 bg-ink-900 p-8">
          <h1 className="text-xl font-bold tracking-tight text-paper-50">Sign in to the portal</h1>
          <p className="mt-2 text-sm text-steel-400">
            Content management for the Leikah Plant Hire website.
          </p>

          <LoginForm />
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-xs text-steel-500 transition-colors hover:text-gold-400"
        >
          <ArrowLeft className="size-3.5" />
          Back to the website
        </Link>
      </div>
    </div>
  );
}

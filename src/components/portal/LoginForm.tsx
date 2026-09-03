"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, LogIn, Mail } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

/* ============================================================================
   PORTAL SIGN-IN

   Password sign-in with a magic-link fallback, because a yard manager on a
   phone at six in the morning should not be blocked by a forgotten password.

   Error text is deliberately generic on failure — telling an attacker whether
   an address exists is a free gift.
   ========================================================================= */

const inputClass =
  "chamfer-sm h-11 w-full border border-steel-600/25 bg-ink-950 px-3.5 text-sm text-paper-50 " +
  "transition-colors placeholder:text-steel-500 focus:border-gold-500/70 focus:outline-none";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("The database is not connected yet.");
      setBusy(false);
      return;
    }

    if (mode === "link") {
      const { error: linkError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/portal` },
      });
      setBusy(false);
      if (linkError) setError("We could not send that link. Check the address and try again.");
      else setSent(true);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (signInError) {
      setError("That email address and password do not match an active portal account.");
      return;
    }

    router.replace("/portal");
    router.refresh();
  };

  if (sent) {
    return (
      <div className="mt-7 flex flex-col gap-3 text-sm">
        <span className="chamfer-sm inline-flex size-11 items-center justify-center border border-gold-500/45 text-gold-400">
          <Mail className="size-5" />
        </span>
        <p className="font-medium text-paper-50">Check your inbox</p>
        <p className="leading-relaxed text-steel-400">
          If <span className="text-steel-200">{email}</span> belongs to an active portal account, a
          sign-in link is on its way. It expires in an hour.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setMode("password");
          }}
          className="mt-2 self-start text-xs text-gold-400 underline underline-offset-4 hover:text-gold-300"
        >
          Use a password instead
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-7 flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-steel-200">Email address</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>

      {mode === "password" && (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-steel-200">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
      )}

      {error && (
        <p className="chamfer-sm flex items-start gap-2 border border-signal-red/40 bg-signal-red/8 p-3 text-xs text-steel-200">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-signal-red" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className={cn(
          "chamfer-sm inline-flex h-11 items-center justify-center gap-2 bg-gold-500 font-semibold text-ink-950 transition-colors hover:bg-gold-400 disabled:opacity-60",
        )}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : mode === "password" ? (
          <LogIn className="size-4" />
        ) : (
          <Mail className="size-4" />
        )}
        {mode === "password" ? "Sign in" : "Email me a link"}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "password" ? "link" : "password");
          setError(null);
        }}
        className="self-center text-xs text-steel-400 underline underline-offset-4 transition-colors hover:text-gold-400"
      >
        {mode === "password" ? "Email me a sign-in link instead" : "Use a password instead"}
      </button>
    </form>
  );
}

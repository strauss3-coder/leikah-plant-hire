/* ============================================================================
   COOKIE CONSENT STORE

   A tiny external store over localStorage, read through `useSyncExternalStore`
   so the banner never causes a hydration mismatch.

   Two details that matter and are easy to get wrong:

     • `getSnapshot` must return a *stable reference* while the underlying value
       is unchanged. Parsing JSON on every call returns a new object each time,
       which React sees as a change, which re-renders, which parses again. The
       raw string is cached and the parsed record reused until the string moves.

     • The server snapshot is a frozen "already decided" record. Rendering the
       banner on the server would be wrong for every returning visitor, so the
       server says decided, nothing renders during hydration, and React swaps in
       the real answer on the first client pass. Same approach as the preloader.

   Nothing here is sent anywhere. The record stays on the visitor's device and
   is read by the site itself to decide whether an optional script may load.
   ========================================================================= */

export const CONSENT_KEY = "leikah:cookie-consent";
export const CONSENT_VERSION = 1;

/** Fired on this tab when the choice changes; `storage` covers other tabs. */
export const CONSENT_EVENT = "leikah:consent-change";
/** Fired when something asks for the preferences panel, e.g. the footer link. */
export const CONSENT_OPEN_EVENT = "leikah:consent-open";

export interface ConsentRecord {
  version: number;
  analytics: boolean;
  functional: boolean;
  /** ISO timestamp of the decision, kept as the record of consent. */
  decidedAt: string;
}

export type OptionalCategory = "analytics" | "functional";

/**
 * What the server renders with: a stable record that reads as "already
 * decided", so no banner is emitted into the HTML.
 */
const SERVER_RECORD: ConsentRecord = Object.freeze({
  version: CONSENT_VERSION,
  analytics: false,
  functional: false,
  decidedAt: "",
});

/**
 * `undefined` means "cache is invalid", which is distinct from `null`, the
 * legitimate "nothing stored" value that `getItem` returns. Using null for both
 * made a cleared record read as the stale one, because `null !== null` is false
 * and the cache was never refreshed.
 */
let cachedRaw: string | null | undefined = undefined;
let cachedRecord: ConsentRecord | null = null;

function parse(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentRecord>;
    // A bumped version means the categories changed and consent must be
    // asked for again rather than assumed to carry over.
    if (value?.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      analytics: value.analytics === true,
      functional: value.functional === true,
      decidedAt: typeof value.decidedAt === "string" ? value.decidedAt : "",
    };
  } catch {
    return null;
  }
}

/** Current decision, or null when the visitor has not chosen yet. */
export function readConsent(): ConsentRecord | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(CONSENT_KEY);
  } catch {
    // Blocked storage (private window, locked-down browser). Treat as
    // undecided but never throw; the banner simply cannot be remembered.
    return null;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedRecord = parse(raw);
  }
  return cachedRecord;
}

export const getServerConsent = (): ConsentRecord => SERVER_RECORD;

export function subscribeToConsent(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener(CONSENT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CONSENT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function saveConsent(choice: Record<OptionalCategory, boolean>) {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    analytics: choice.analytics,
    functional: choice.functional,
    decidedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Choice still applies for this page view; it just will not persist.
  }
  cachedRaw = undefined;
  window.dispatchEvent(new Event(CONSENT_EVENT));
  return record;
}

/** Clears the record so the banner is asked again. */
export function clearConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* nothing to clear */
  }
  cachedRaw = undefined;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Asks the banner to open its preferences panel. */
export function openConsentPreferences() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/**
 * Whether an optional category may run. Any future analytics or functional
 * script should gate itself on this rather than assuming permission.
 */
export function hasConsent(category: OptionalCategory): boolean {
  const record = readConsent();
  return record ? record[category] : false;
}

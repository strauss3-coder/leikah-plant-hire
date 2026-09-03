/**
 * STATIC PREVIEW STUBS
 *
 * GitHub Pages serves files, not a server, so Server Actions cannot run there.
 * When `STATIC_EXPORT=1` the Turbopack alias in `next.config.ts` swaps
 * `@/lib/enquiries/actions` for this module, so the preview build contains no
 * server code at all — rather than shipping forms that appear to work and
 * silently fail.
 *
 * The signatures match the real actions exactly, so the form components are
 * unchanged and the production build is unaffected.
 */

export interface ActionResult {
  ok: boolean;
  reference?: string;
  message: string;
  errors?: Record<string, string>;
  degraded?: boolean;
}

const PREVIEW_NOTICE: ActionResult = {
  ok: false,
  message:
    "This is a static preview, so the form cannot send. Please call or WhatsApp us on the number at the top of the page — that reaches a person either way.",
};

export async function submitQuoteRequest(): Promise<ActionResult> {
  return PREVIEW_NOTICE;
}

export async function submitContactMessage(): Promise<ActionResult> {
  return PREVIEW_NOTICE;
}

export async function submitApplication(): Promise<ActionResult> {
  return PREVIEW_NOTICE;
}

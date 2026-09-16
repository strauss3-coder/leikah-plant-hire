import type { LoaderContent } from "@/lib/cms/types";

/* ============================================================================
   LOADING EXPERIENCE

   The timings below are ceilings rather than durations. The welcome sequence
   lifts the moment fonts and the hero image have decoded, and a transition
   lifts the moment the next route is ready; these values only bound the worst
   case so a slow connection cannot hold someone behind an animation.

   `transitionMinMs` is the floor for a page change. App Router prefetches, so
   most routes are ready almost immediately; at the old 520ms floor the cover
   came and went before the machine had crossed the screen, which is why some
   navigations looked like a full sequence and others like an abrupt wipe. The
   machine needs roughly 620ms to travel and the plate 520ms each way, so 1400ms
   is the point at which every navigation shows the same complete animation.

   `introBriefMs` covers every other way of arriving at a page: a refresh, a
   typed URL, a bookmark, a link from outside. Those are full page loads, so no
   client-side transition can run, and without a short cover they arrived
   instantly while every clicked navigation took two seconds. 1150ms lands the
   cover within about 30ms of a clicked transition, so the two are hard to tell
   apart, while staying short enough not to annoy on a refresh.

   The two intro numbers are a pair, and both have a cost attached.

   `introMinMs` exists because a fast connection lifts the cover in about a
   tenth of a second, which reads as a flicker rather than as a welcome. 1400ms
   is the point at which the full sequence has played: mark, then the letters,
   then the statement line.

   `introMaxMs` is the worst case. A full-screen cover means nothing behind it
   counts as painted, so this value is the ceiling for Largest Contentful Paint
   on a cold visit. 2200ms keeps even a slow visit inside Google's 2500ms
   "good" threshold. Raising it past 2500 trades ranking for spectacle.
   ========================================================================= */

export const loader: LoaderContent = {
  welcome: "Welcome to",
  statement: [
    "Heavy equipment. Reliable people.",
    "Built for demanding operations.",
  ],
  progressLabel: "Systems check",
  introMinMs: 1400,
  introBriefMs: 1150,
  introMaxMs: 2200,
  transitionMinMs: 1400,
  transitionMaxMs: 2600,
};

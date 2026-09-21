"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { assetPath } from "@/lib/cms/media";
import type { ServiceVideo } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   PROCESS FILM

   Short silent clips of a service actually being carried out. Photographs show
   the result; some work only reads as work when you watch it move.

   Three decisions worth keeping:

   • `preload="none"` with a poster. Seven clips at roughly 1.5 MB each would
     otherwise land on anyone who opens the page. Nothing but the poster is
     fetched until somebody presses play, so the section costs a few tens of
     kilobytes at rest.
   • The clips carry no audio track at all — it was stripped in processing, not
     muted in markup. Workshop noise adds nothing and an autoplaying sound is a
     reason to leave a page.
   • Native controls appear only once playback has started. Before that the
     tile is a poster and a play affordance, which keeps the strip looking like
     the rest of the site rather than like seven browser widgets.
   ========================================================================= */

export function ProcessFilm({ videos }: { videos: ServiceVideo[] }) {
  if (!videos.length) return null;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <li key={video.src}>
          <Clip video={video} />
        </li>
      ))}
    </ul>
  );
}

function Clip({ video }: { video: ServiceVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    // The element is already mounted, so this plays the clip that was clicked
    // rather than waiting a render for `controls` to appear.
    void ref.current?.play();
  };

  return (
    <figure className="flex flex-col gap-3">
      <div className="chamfer relative overflow-hidden border border-steel-600/18 bg-ink-900">
        <video
          ref={ref}
          /* Four of the seven clips were filmed portrait on a phone and carry a
             rotation flag, so a fixed 16/9 box pillarboxes them. The tile holds
             the 4/3 the rest of the site's imagery uses and crops to fill: on
             close-up work like this the subject sits centre frame, so a centre
             crop keeps all of it and the strip stays a clean grid. */
          className="block w-full object-cover object-center"
          style={{ aspectRatio: "4 / 3" }}
          src={assetPath(video.src)}
          poster={assetPath(video.poster)}
          preload="none"
          controls={started}
          loop
          muted
          playsInline
          aria-label={video.title}
          onPlay={() => setStarted(true)}
        />

        {!started && (
          <button
            type="button"
            onClick={start}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-ink-950/35 transition-colors hover:bg-ink-950/20",
              "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold-400",
            )}
          >
            <span className="sr-only">Play: {video.title}</span>
            <span
              aria-hidden="true"
              className="flex size-14 items-center justify-center rounded-full border border-gold-500/60 bg-ink-950/70 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105"
            >
              <Play className="ml-0.5 size-5 fill-gold-400 text-gold-400" />
            </span>
          </button>
        )}
      </div>

      <figcaption className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-paper-50">{video.title}</span>
        <span className="text-sm leading-relaxed text-steel-400">{video.caption}</span>
      </figcaption>
    </figure>
  );
}

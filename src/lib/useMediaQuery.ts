import { useSyncExternalStore } from "react";

/**
 * A media query read that survives hydration.
 *
 * `useSyncExternalStore` uses the server snapshot for the first client render
 * as well as for the server one, so the two always agree and React re-renders
 * with the real value immediately afterwards. Reading the query in an effect,
 * or through a hook that returns the live value on the first client render,
 * makes the markup disagree with the server and throws a hydration error the
 * moment the query decides which element to render at all.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

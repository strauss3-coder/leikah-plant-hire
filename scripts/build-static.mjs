/**
 * Builds the public website as flat HTML for GitHub Pages.
 *
 * The CMS portal is deliberately not part of this build. It needs a server for
 * authentication and writes, and its dynamic routes cannot be prerendered — so
 * rather than shipping a half-working admin area on a public URL, the portal is
 * moved aside for the duration of the build and put straight back.
 *
 * The move is wrapped in try/finally and an exit handler, so an interrupt or a
 * build failure still restores the tree.
 *
 * Usage:
 *   PAGES_BASE_PATH=/leikah-plant-hire node scripts/build-static.mjs
 */
import { existsSync, renameSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const portal = path.join(root, "src/app/portal");
const stashed = path.join(root, ".portal.stash");

let moved = false;

function restore() {
  if (moved && existsSync(stashed)) {
    renameSync(stashed, portal);
    moved = false;
    console.log("• portal restored");
  }
}

// Restore on any exit path, including Ctrl-C.
process.on("exit", restore);
process.on("SIGINT", () => {
  restore();
  process.exit(130);
});
process.on("SIGTERM", () => {
  restore();
  process.exit(143);
});

try {
  if (existsSync(stashed)) {
    throw new Error(
      `${stashed} already exists — a previous run was interrupted. Move it back to src/app/portal before continuing.`,
    );
  }

  if (existsSync(portal)) {
    renameSync(portal, stashed);
    moved = true;
    console.log("• portal set aside for the static build");
  }

  const basePath = process.env.PAGES_BASE_PATH ?? "";
  console.log(`• building static export${basePath ? ` under ${basePath}` : ""}`);

  const build = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1", PAGES_BASE_PATH: basePath },
  });

  if (build.status !== 0) process.exit(build.status ?? 1);

  // Tells GitHub Pages not to run the output through Jekyll, which would
  // otherwise drop any file or directory beginning with an underscore —
  // including Next's _next asset directory.
  writeFileSync(path.join(root, "out", ".nojekyll"), "");
  console.log("• wrote out/.nojekyll");
} finally {
  restore();
}

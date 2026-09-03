import { cn } from "@/lib/utils";

/* ============================================================================
   ARTICLE BODY

   A deliberately small markdown subset — headings, bullets, bold and
   paragraphs — rendered without a parser dependency. Editors in the portal get
   exactly these four affordances, which keeps published articles inside the
   type system rather than letting arbitrary HTML into the page.
   ========================================================================= */

/** Renders **bold** spans inside a line of body text. */
function inline(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-paper-50">
          {chunk.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{chunk}</span>;
  });
}

export function Article({ body, className }: { body: string; className?: string }) {
  const blocks = body.split(/\n\s*\n/);

  return (
    <div className={cn("flex flex-col", className)}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-12 mb-4 text-display-4 text-paper-50 first:mt-0">
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-9 mb-3 text-lg font-bold text-paper-50">
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").map((line) => line.replace(/^-\s*/, ""));
          return (
            <ul key={i} className="my-5 flex flex-col gap-3">
              {items.map((item, j) => (
                <li key={j} className="relative pl-6 leading-relaxed text-steel-300">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[0.7em] h-px w-3 bg-gold-500"
                  />
                  {inline(item, `${i}-${j}`)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="my-4 text-base leading-[1.75] text-steel-300 first:mt-0">
            {inline(trimmed, String(i))}
          </p>
        );
      })}
    </div>
  );
}

import { headers } from "next/headers";

/**
 * Renders one JSON-LD script tag, nonce-aware for the CSP in
 * src/middleware.ts. Escapes `<` so a string field can never contain a
 * literal `</script>` and break out of the tag, standard practice for
 * JSON-LD even though every field feeding this today is site copy, not
 * raw user input.
 */
export async function JsonLd({ data }: { data: Record<string, unknown> }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: json }} />
  );
}

/**
 * Renders one JSON-LD script tag. `application/ld+json` is a data block the browser never
 * executes, so CSP script-src doesn't apply and no nonce is needed, which keeps every page
 * using this statically renderable. Escapes `<` so a string field can never contain a literal
 * `</script>` and break out of the tag, standard practice for JSON-LD even though every field
 * feeding this today is site copy, not raw user input.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

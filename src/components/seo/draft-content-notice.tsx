/**
 * CLAUDE.md section 7: any drafted local fact needs a human check before
 * publishing. Suburb pages don't use MDX (see TODO-OWNER.md-adjacent note
 * in src/content/suburbs.ts for why), so instead of inline `<!-- REVIEW -->`
 * comments this renders one visible notice per page, easy for an owner to
 * grep for ("DraftContentNotice") and remove once the page is checked.
 */
export function DraftContentNotice() {
  return (
    <p className="bg-secondary/40 text-muted-foreground mb-8 rounded-md border border-dashed p-3 text-xs">
      Draft content: the local details on this page (postcode, council area, and area description)
      are sourced from public directories, not firsthand knowledge, and need an owner check before
      this page goes live.
    </p>
  );
}

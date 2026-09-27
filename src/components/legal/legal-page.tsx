import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/layout-primitives";
import { business } from "@/config/business";

/**
 * Shared shell for the legal pages: the standard page header, then the text at reading width,
 * with the business identifiers alongside so it's always clear who the policy belongs to.
 */
export function LegalPage({
  title,
  path,
  updated,
  children,
}: {
  title: string;
  /** Site-relative path of the page, for its breadcrumb. */
  path: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: title, path }]}
        label="The fine print"
        title={title}
        lede={<p>Last updated {updated}. Plain English where we can manage it.</p>}
      />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-12">
        <div className="prose-vc lg:col-span-8">{children}</div>
        <aside className="lg:col-span-4">
          <dl className="border-navy-900 text-ink-900 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t-2 pt-4 text-sm lg:sticky lg:top-24">
            <dt className="text-muted-600">Business</dt>
            <dd className="font-semibold">{business.tradingName}</dd>
            <dt className="text-muted-600">ABN</dt>
            <dd className="tabular font-semibold">{business.abn}</dd>
            <dt className="text-muted-600">ACN</dt>
            <dd className="tabular font-semibold">{business.acn}</dd>
            <dt className="text-muted-600">Phone</dt>
            <dd>
              <a
                href={`tel:${business.phoneE164}`}
                className="tabular text-navy-900 font-semibold underline underline-offset-4"
              >
                {business.phoneDisplay}
              </a>
            </dd>
          </dl>
        </aside>
      </Container>
    </>
  );
}

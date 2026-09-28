import { ContactLinkTracker } from "@/components/analytics/contact-link-tracker";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StickyMobileBar } from "@/components/layout/sticky-mobile-bar";
import { RevealObserver } from "@/components/motion/reveal";
import { MovingCompanyJsonLd } from "@/components/seo/moving-company-json-ld";

// Marketing pages are prerendered and refreshed at most daily (ISR). The few that read the
// database (homepage reviews, /reviews, /pricing) also get revalidated on demand when staff
// change that data in the admin console. /quote and /contact opt out with connection(),
// because they need the per-request CSP nonce (see src/proxy.ts).
export const revalidate = 86400;

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <MovingCompanyJsonLd />
      <Header />
      <main id="main-content" className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <StickyMobileBar />
      <ContactLinkTracker />
      <RevealObserver />
    </>
  );
}

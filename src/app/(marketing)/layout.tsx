import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StickyMobileBar } from "@/components/layout/sticky-mobile-bar";
import { MovingCompanyJsonLd } from "@/components/seo/moving-company-json-ld";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <MovingCompanyJsonLd />
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <StickyMobileBar />
    </>
  );
}

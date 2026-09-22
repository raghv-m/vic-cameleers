import { Menu, Phone } from "lucide-react";
import Link from "next/link";

import { CamelMark } from "@/components/brand/camel-mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { primaryNav, secondaryNav } from "@/config/nav";

export function Header() {
  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading flex shrink-0 items-center gap-2 text-lg font-semibold whitespace-nowrap"
        >
          <CamelMark className="text-primary h-8 w-8 shrink-0" />
          {business.tradingName}
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium whitespace-nowrap transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href={`tel:${business.phoneE164}`}
            className="text-foreground flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
          >
            <Phone className="h-4 w-4" />
            {business.phoneDisplay}
          </a>
          <Button render={<Link href="/quote" />} nativeButton={false}>
            {ctaCopy.primary}
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <CamelMark className="text-primary h-7 w-7" />
                {business.tradingName}
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {primaryNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:bg-muted rounded-md px-2 py-2.5 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-border my-2 border-t" />
              {secondaryNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-2 py-2.5 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-border mt-2 flex flex-col gap-3 border-t px-4 pt-4">
              <a
                href={`tel:${business.phoneE164}`}
                className="text-foreground flex items-center gap-1.5 text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                {business.phoneDisplay}
              </a>
              <Button render={<Link href="/quote" />} nativeButton={false}>
                {ctaCopy.primary}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

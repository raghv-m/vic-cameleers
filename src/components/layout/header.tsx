"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { cn } from "cn";

import { CamelMark } from "@/components/brand/camel-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { business } from "@/config/business";
import { ctaCopy } from "@/config/copy";
import { primaryNav, secondaryNav } from "@/config/nav";

/**
 * Site header. Sits transparent and 80px tall over the top of the page, then turns solid sand
 * with a navy rule and shrinks to 64px once you scroll past a sentinel (IntersectionObserver, no
 * scroll listener). The quote CTA and the phone number are always in view on desktop; on mobile
 * the sticky bottom bar carries them.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("header-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting), {
      rootMargin: "0px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div id="header-sentinel" aria-hidden="true" className="absolute top-0 h-20 w-px" />
      <header
        className={cn(
          "sticky top-0 z-40 transition-[background-color,border-color,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          scrolled
            ? "border-navy-900 bg-sand-50/95 h-16 border-b-2 backdrop-blur-sm"
            : "h-20 border-b-2 border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-navy-900 flex shrink-0 items-center gap-2.5"
            aria-label={`${business.tradingName}, home`}
          >
            <CamelMark className="text-terracotta-600 h-7 w-auto" />
            <span className="font-headline text-[1.6rem] leading-none tracking-[0.04em] uppercase">
              VIC CAMELEERS
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "text-navy-900 relative inline-flex h-11 items-center px-3 text-[0.9375rem] font-semibold",
                      "after:bg-terracotta-600 after:absolute after:inset-x-3 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 motion-reduce:after:transition-none",
                      "aria-[current=page]:after:scale-x-100",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <a
              href={`tel:${business.phoneE164}`}
              className="text-navy-900 tabular inline-flex items-center gap-2 text-[0.9375rem] font-bold whitespace-nowrap"
            >
              <Phone className="size-4" aria-hidden="true" />
              {business.phoneDisplay}
            </a>
            <Link href="/quote" className={cn(buttonVariants(), "tracking-[0.08em] uppercase")}>
              {ctaCopy.primary}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="text-navy-900 -mr-2 lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="bg-sand-50 border-navy-900 w-full max-w-sm border-l-2 p-0"
            >
              <div className="border-navy-900 flex h-16 items-center justify-between border-b-2 px-4">
                <SheetTitle className="text-navy-900 flex items-center gap-2">
                  <CamelMark className="text-terracotta-600 h-6 w-auto" />
                  <span className="font-headline text-2xl leading-none tracking-[0.04em]">
                    VIC CAMELEERS
                  </span>
                </SheetTitle>
                <SheetClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      aria-label="Close menu"
                      className="-mr-2"
                    />
                  }
                >
                  <X className="size-6" />
                </SheetClose>
              </div>
              <nav aria-label="Mobile" className="px-4 py-4">
                <ul className="divide-border divide-y">
                  {primaryNav.map((link, index) => (
                    <li key={link.href}>
                      <SheetClose
                        render={
                          <Link
                            href={link.href}
                            aria-current={isActive(link.href) ? "page" : undefined}
                            className="text-navy-900 aria-[current=page]:text-terracotta-600 flex min-h-14 items-center justify-between text-lg font-semibold"
                          />
                        }
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="manifest-index text-muted-600 w-6">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {link.label}
                        </span>
                        <ArrowRight className="text-terracotta-600 size-4" aria-hidden="true" />
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {secondaryNav.map((link) => (
                    <li key={link.href}>
                      <SheetClose
                        render={
                          <Link
                            href={link.href}
                            className="text-muted-600 inline-flex min-h-11 items-center text-[0.9375rem] font-semibold underline-offset-4 hover:underline"
                          />
                        }
                      >
                        {link.label}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-navy-900 mt-auto space-y-3 border-t-2 p-4">
                <SheetClose
                  render={
                    <Link
                      href="/quote"
                      className={cn(
                        buttonVariants({ size: "xl" }),
                        "w-full tracking-[0.08em] uppercase",
                      )}
                    />
                  }
                >
                  {ctaCopy.primary}
                  <ArrowRight data-icon="inline-end" />
                </SheetClose>
                <a
                  href={`tel:${business.phoneE164}`}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "xl" }),
                    "tabular w-full",
                  )}
                >
                  <Phone aria-hidden="true" />
                  {business.phoneDisplay}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

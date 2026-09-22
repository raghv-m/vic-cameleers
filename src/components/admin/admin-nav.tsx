"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { useAdminRoot } from "@/lib/use-admin-root";
import { cn } from "cn";

const links = [
  { href: "", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/customers", label: "Customers" },
];

export function AdminNav() {
  const pathname = usePathname();
  const adminRoot = useAdminRoot();

  return (
    <header className="bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <nav className="flex items-center gap-4">
          {links.map((link) => {
            const href = `${adminRoot}${link.href}`;
            const active = link.href === "" ? pathname === adminRoot : pathname.startsWith(href);
            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  "text-sm font-medium",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <SignOutButton />
      </div>
    </header>
  );
}

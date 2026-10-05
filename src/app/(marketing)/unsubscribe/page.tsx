import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/site/layout-primitives";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { optOutCustomer, verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

async function unsubscribe(formData: FormData) {
  "use server";
  const customerId = String(formData.get("c") ?? "");
  const token = String(formData.get("t") ?? "");
  if (!verifyUnsubscribeToken(customerId, token)) return;
  await optOutCustomer(customerId);
  redirect(
    `/unsubscribe?c=${encodeURIComponent(customerId)}&t=${encodeURIComponent(token)}&done=1`,
  );
}

/**
 * Where the Unsubscribe link in our emails lands. Asks for a click rather than unsubscribing on
 * load, so email security scanners that open every link don't unsubscribe people by accident.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; t?: string; done?: string }>;
}) {
  const { c = "", t = "", done } = await searchParams;
  const valid = Boolean(c) && verifyUnsubscribeToken(c, t);

  const title = !valid
    ? "That link doesn't work."
    : done
      ? "You're unsubscribed."
      : "Unsubscribe from our emails?";

  return (
    <div data-hides-mobile-bar>
      <PageHeader
        breadcrumbs={[{ name: "Unsubscribe", path: "/unsubscribe" }]}
        label="Email preferences"
        title={title}
      />
      <Container className="max-w-2xl py-12 sm:py-16">
        {!valid ? (
          <p className="text-ink-900">
            The link may have been cut off. Call {business.phoneDisplay} and we&apos;ll take you off
            the list.
          </p>
        ) : done ? (
          <p className="text-ink-900">
            We won&apos;t send you follow-ups, thank-you or review emails again. If you book a move,
            you&apos;ll still get the emails about that booking.
          </p>
        ) : (
          <form action={unsubscribe} className="space-y-6">
            <input type="hidden" name="c" value={c} />
            <input type="hidden" name="t" value={t} />
            <p className="text-ink-900">
              You&apos;ll stop getting quote follow-ups, thank-you and review emails from{" "}
              {business.tradingName}. Emails about a booking you&apos;ve made still come through.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" size="lg">
                Unsubscribe
              </Button>
              <Link
                href="/"
                className="text-navy-900 inline-flex min-h-11 items-center font-bold underline underline-offset-4"
              >
                Keep getting them
              </Link>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}

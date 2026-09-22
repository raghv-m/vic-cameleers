import type { Metadata } from "next";

import { QuoteFlow } from "@/components/quote/quote-flow";

export const metadata: Metadata = {
  title: "Get an instant estimate",
  description: "Get a real price range for your move in a couple of minutes.",
};

export default function QuotePage() {
  return <QuoteFlow />;
}

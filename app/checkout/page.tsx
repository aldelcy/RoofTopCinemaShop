import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { CheckoutForm } from "@/components/checkout-form";
import { OrderSummary } from "@/components/order-summary";
import { draftQuery, parseDraft, type DraftQuery } from "@/lib/draft";
import { formatWhen } from "@/lib/format";
import { quoteDraft } from "@/lib/store";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<DraftQuery> }) {
  const query = await searchParams;
  const parsed = parseDraft(query);

  if (!parsed.ok) {
    return (
      <>
        <BackLink href="/">All movies</BackLink>
        <h1>Checkout</h1>
        <p className="alert" role="alert">
          {parsed.error}
        </p>
      </>
    );
  }

  const quote = quoteDraft(parsed.draft);
  const backHref = `/screenings/${parsed.draft.screeningId}/tickets?${draftQuery(parsed.draft)}`;

  if (!quote.ok) {
    return (
      <>
        <BackLink href={backHref}>Tickets and snacks</BackLink>
        <h1>Checkout</h1>
        <p className="alert" role="alert">
          {quote.error}
        </p>
      </>
    );
  }

  return (
    <>
      <BackLink href={backHref}>Tickets and snacks</BackLink>
      <h1>Checkout</h1>
      <p className="lede">
        {quote.movieTitle}
        <span className="dot"> · </span>
        {quote.venue}
      </p>
      <p className="meta">{formatWhen(quote.date, quote.time, "long")}</p>
      <div className="split checkout-split">
        <CheckoutForm draft={parsed.draft} />
        <OrderSummary lines={quote.lines} totalCents={quote.totalCents} />
      </div>
    </>
  );
}

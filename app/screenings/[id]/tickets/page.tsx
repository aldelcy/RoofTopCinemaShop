import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { TicketPicker } from "@/components/ticket-picker";
import { snackCap, snacks } from "@/data/catalog";
import { parseDraft, type DraftQuery } from "@/lib/draft";
import { formatWhen } from "@/lib/format";
import { getScreeningView } from "@/lib/store";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<DraftQuery>;
};

export const metadata: Metadata = { title: "Tickets" };

export default async function TicketsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;
  const view = getScreeningView(id);
  if (!view) notFound();

  const { movie, screening, remaining } = view;
  const parsed = parseDraft({
    screening: id,
    tickets: query.tickets ?? "1",
    snack: query.snack,
  });
  const initialTickets = parsed.ok ? parsed.draft.ticketQuantity : 1;
  const initialSnacks = Object.fromEntries(
    (parsed.ok ? parsed.draft.snacks : []).map((snack) => [snack.id, snack.quantity]),
  );

  return (
    <>
      <BackLink href={`/screenings/${screening.id}`}>Screening details</BackLink>
      {remaining < 1 ? (
        <>
          <h1>Tickets and snacks</h1>
          <p className="lede">{movie.title}</p>
          <p>This screening is sold out.</p>
        </>
      ) : (
        <TicketPicker
          screeningId={screening.id}
          movieTitle={movie.title}
          venue={screening.venue}
          when={formatWhen(screening.date, screening.time, "long")}
          priceCents={screening.priceCents}
          remaining={remaining}
          snacks={snacks.map((snack) => ({
            id: snack.id,
            name: snack.name,
            priceCents: snack.priceCents,
          }))}
          maxSnack={snackCap}
          initialTickets={Math.min(initialTickets, remaining)}
          initialSnacks={initialSnacks}
        />
      )}
    </>
  );
}

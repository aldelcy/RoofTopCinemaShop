"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OrderSummary } from "@/components/order-summary";
import { formatMoney, seatLabel } from "@/lib/format";
import { draftQuery } from "@/lib/draft";

type SnackOption = {
  id: string;
  name: string;
  priceCents: number;
};

export function TicketPicker({
  screeningId,
  movieTitle,
  venue,
  when,
  priceCents,
  remaining,
  snacks,
  maxSnack,
  initialTickets,
  initialSnacks,
}: {
  screeningId: string;
  movieTitle: string;
  venue: string;
  when: string;
  priceCents: number;
  remaining: number;
  snacks: SnackOption[];
  maxSnack: number;
  initialTickets: number;
  initialSnacks: Record<string, number>;
}) {
  const router = useRouter();
  const [tickets, setTickets] = useState(() => Math.min(Math.max(initialTickets, 1), remaining));
  const [qty, setQty] = useState<Record<string, number>>(() => {
    const next: Record<string, number> = {};
    for (const snack of snacks) {
      const requested = initialSnacks[snack.id] ?? 0;
      next[snack.id] = Math.min(maxSnack, Math.max(0, requested));
    }
    return next;
  });

  const lines = useMemo(() => {
    const snackLines = snacks
      .filter((snack) => (qty[snack.id] ?? 0) > 0)
      .map((snack) => ({
        label: `${snack.name} × ${qty[snack.id]}`,
        amountCents: snack.priceCents * qty[snack.id],
      }));
    return [
      { label: `General admission × ${tickets}`, amountCents: priceCents * tickets },
      ...snackLines,
    ];
  }, [priceCents, qty, snacks, tickets]);

  const totalCents = lines.reduce((sum, line) => sum + line.amountCents, 0);

  function continueToCheckout() {
    if (tickets < 1 || tickets > remaining) return;
    const query = draftQuery({
      screeningId,
      ticketQuantity: tickets,
      snacks: snacks.map((snack) => ({ id: snack.id, quantity: qty[snack.id] ?? 0 })),
    });
    router.push(`/checkout?${query}`);
  }

  return (
    <div className="split">
      <div>
        <h1>Tickets and snacks</h1>
        <p className="lede">
          {movieTitle}
          <span className="dot"> · </span>
          {venue}
        </p>
        <p className="meta">{when}</p>
        <p className="note">General admission. No reserved seats.</p>

        <fieldset>
          <legend>Tickets</legend>
          <p className="meta">
            {formatMoney(priceCents)} each · {seatLabel(remaining)}
          </p>
          <div className="stepper">
            <button
              type="button"
              onClick={() => setTickets((value) => Math.max(1, value - 1))}
              disabled={tickets <= 1}
              aria-label="Fewer tickets"
            >
              −
            </button>
            <span aria-live="polite">{tickets}</span>
            <button
              type="button"
              onClick={() => setTickets((value) => Math.min(remaining, value + 1))}
              disabled={tickets >= remaining}
              aria-label="More tickets"
            >
              +
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend>Snacks</legend>
          <p className="note">Optional. Add what you want, or skip them.</p>
          <ul className="menu">
            {snacks.map((snack) => {
              const count = qty[snack.id] ?? 0;
              return (
                <li key={snack.id}>
                  <div>
                    <p className="item-name">{snack.name}</p>
                    <p className="meta">{formatMoney(snack.priceCents)}</p>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setQty((current) => ({
                          ...current,
                          [snack.id]: Math.max(0, (current[snack.id] ?? 0) - 1),
                        }))
                      }
                      disabled={count <= 0}
                      aria-label={`Fewer ${snack.name}`}
                    >
                      −
                    </button>
                    <span>{count}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQty((current) => ({
                          ...current,
                          [snack.id]: Math.min(maxSnack, (current[snack.id] ?? 0) + 1),
                        }))
                      }
                      disabled={count >= maxSnack}
                      aria-label={`More ${snack.name}`}
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>

      <div className="summary-column">
        <OrderSummary lines={lines} totalCents={totalCents} />
        <button
          type="button"
          className="button button-block"
          onClick={continueToCheckout}
          disabled={tickets < 1 || tickets > remaining}
        >
          Continue to checkout
        </button>
      </div>
    </div>
  );
}

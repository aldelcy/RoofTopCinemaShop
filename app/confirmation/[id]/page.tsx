import type { Metadata } from "next";
import Link from "next/link";
import { getMovie } from "@/data/catalog";
import { Poster } from "@/components/poster";
import { formatMoney, formatWhen } from "@/lib/format";
import { getOrder } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Confirmed" };

export default async function ConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = getOrder(id);

  if (!order) {
    return (
      <>
        <h1>Confirmation unavailable</h1>
        <p>
          This demo keeps orders in server memory. A confirmation disappears when the app restarts.
        </p>
        <Link className="button" href="/">
          Back to movies
        </Link>
      </>
    );
  }

  const movie = getMovie(order.movieId);

  return (
    <article className="receipt">
      <div>
        <p className="eyebrow">Payment confirmed</p>
        <h1>{order.confirmationCode}</h1>
        <p className="note">Demo confirmation. No card was charged and no email was sent.</p>
        {movie ? <Poster src={movie.poster} title={order.movieTitle} compact /> : null}
      </div>
      <div className="card">
        <h2>{order.movieTitle}</h2>
        <dl className="facts">
          <div>
            <dt>Venue</dt>
            <dd>{order.venue}</dd>
          </div>
          <div>
            <dt>Screening</dt>
            <dd>{formatWhen(order.date, order.time, "long")}</dd>
          </div>
          <div>
            <dt>Tickets</dt>
            <dd>
              <span className="stack">
                <span>General admission × {order.ticketQuantity}</span>
                <span>{formatMoney(order.ticketAmountCents)}</span>
              </span>
            </dd>
          </div>
          <div>
            <dt>Snacks</dt>
            <dd>
              {order.snacks.length === 0
                ? "None"
                : order.snacks.map((snack) => (
                    <span className="stack" key={snack.id}>
                      <span>
                        {snack.name} × {snack.quantity}
                      </span>
                      <span>{formatMoney(snack.amountCents)}</span>
                    </span>
                  ))}
            </dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd className="price">{formatMoney(order.totalCents)}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{order.email}</dd>
          </div>
        </dl>
        <Link className="button button-block" href="/">
          Back to movies
        </Link>
      </div>
    </article>
  );
}

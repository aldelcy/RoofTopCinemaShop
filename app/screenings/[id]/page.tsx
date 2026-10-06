import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { Poster } from "@/components/poster";
import { formatMoney, formatRuntime, formatWhen, seatLabel } from "@/lib/format";
import { getScreeningView } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const view = getScreeningView(id);
  return { title: view?.movie.title ?? "Screening" };
}

export default async function ScreeningPage({ params }: Props) {
  const { id } = await params;
  const view = getScreeningView(id);
  if (!view) notFound();

  const { movie, screening, remaining } = view;

  return (
    <>
      <BackLink href="/">All movies</BackLink>
      <article className="detail">
        <Poster src={movie.poster} title={movie.title} />
        <div>
          <p className="eyebrow">{screening.venue}</p>
          <h1>{movie.title}</h1>
          <p className="runtime">{formatRuntime(movie.runtimeMinutes)}</p>
          <p className="lede">{movie.description}</p>
          <dl className="facts">
            <div>
              <dt>When</dt>
              <dd>{formatWhen(screening.date, screening.time, "long")}</dd>
            </div>
            <div>
              <dt>Admission</dt>
              <dd>General admission</dd>
            </div>
            <div>
              <dt>Tickets</dt>
              <dd>{formatMoney(screening.priceCents)}</dd>
            </div>
            <div>
              <dt>Seats</dt>
              <dd className={remaining === 0 ? "sold" : undefined}>{seatLabel(remaining)}</dd>
            </div>
          </dl>
          {remaining > 0 ? (
            <Link className="button" href={`/screenings/${screening.id}/tickets`}>
              Select tickets
            </Link>
          ) : (
            <p className="note">This screening is sold out.</p>
          )}
        </div>
      </article>
    </>
  );
}

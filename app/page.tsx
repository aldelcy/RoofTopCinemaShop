import Link from "next/link";
import { Poster } from "@/components/poster";
import { formatMoney, formatRuntime, formatWhen, seatLabel } from "@/lib/format";
import { listCatalog } from "@/lib/store";

export default function HomePage() {
  const catalog = listCatalog();

  return (
    <>
      <h1>Now showing</h1>
      <p className="lede">Pick a screening, then add tickets and snacks. General admission.</p>
      <div className="movies">
        {catalog.map(({ movie, screenings }) => (
          <article className="movie" key={movie.id}>
            <Poster src={movie.poster} title={movie.title} />
            <div>
              <h2>{movie.title}</h2>
              <p className="runtime">{formatRuntime(movie.runtimeMinutes)}</p>
              <p>{movie.description}</p>
              <h3>Screenings</h3>
              <div className="screenings">
                {screenings.map(({ screening, remaining }) => (
                  <Link className="screening-row" href={`/screenings/${screening.id}`} key={screening.id}>
                    <span className="venue">{screening.venue}</span>
                    <span className="when">{formatWhen(screening.date, screening.time)}</span>
                    <span className="price">{formatMoney(screening.priceCents)}</span>
                    <span className={remaining === 0 ? "seats sold" : "seats"}>{seatLabel(remaining)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

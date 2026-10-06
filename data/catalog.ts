/**
 * Demo catalog. Edit this file to change movies, screenings, and snacks.
 * Orders are not stored here. See lib/store.ts.
 */

export type Movie = {
  id: string;
  title: string;
  description: string;
  runtimeMinutes: number;
  /** Path under /public. Replace the file, or point this at a new poster. */
  poster: string;
};

export type Screening = {
  id: string;
  movieId: string;
  venue: string;
  /** YYYY-MM-DD */
  date: string;
  /** 24-hour HH:mm */
  time: string;
  priceCents: number;
  capacity: number;
};

export type Snack = {
  id: string;
  name: string;
  priceCents: number;
};

export const movies: Movie[] = [
  {
    id: "moonlight-over-the-hudson",
    title: "Moonlight Over the Hudson",
    description:
      "Two neighbors miss the last train and walk the river until the sky lightens.",
    runtimeMinutes: 108,
    poster: "/posters/moonlight_over_the_hudson.png",
  },
  {
    id: "the-last-ferry",
    title: "The Last Ferry",
    description:
      "A night crossing, a missing suitcase, and a city that keeps its lights low.",
    runtimeMinutes: 121,
    poster: "/posters/the_last_ferry.png",
  },
  {
    id: "neon-orchard",
    title: "Neon Orchard",
    description:
      "A family tries to sell one perfect peach at a night market that will not close.",
    runtimeMinutes: 96,
    poster: "/posters/neon_orchard.png",
  },
];

export const screenings: Screening[] = [
  {
    id: "moonlight-pier-17",
    movieId: "moonlight-over-the-hudson",
    venue: "Pier 17 Rooftop",
    date: "2026-10-10",
    time: "20:30",
    priceCents: 1800,
    capacity: 64,
  },
  {
    id: "moonlight-high-line",
    movieId: "moonlight-over-the-hudson",
    venue: "High Line Deck",
    date: "2026-10-11",
    time: "20:45",
    priceCents: 1800,
    capacity: 40,
  },
  {
    id: "ferry-navy-yard",
    movieId: "the-last-ferry",
    venue: "Navy Yard Sky",
    date: "2026-10-12",
    time: "21:00",
    priceCents: 2200,
    capacity: 50,
  },
  {
    id: "ferry-pier-17",
    movieId: "the-last-ferry",
    venue: "Pier 17 Rooftop",
    date: "2026-10-16",
    time: "21:15",
    priceCents: 2200,
    capacity: 36,
  },
  {
    id: "orchard-high-line",
    movieId: "neon-orchard",
    venue: "High Line Deck",
    date: "2026-10-14",
    time: "20:00",
    priceCents: 1600,
    capacity: 48,
  },
  {
    id: "orchard-navy-yard",
    movieId: "neon-orchard",
    venue: "Navy Yard Sky",
    date: "2026-10-17",
    time: "20:15",
    priceCents: 1600,
    capacity: 28,
  },
];

export const snackCap = 12;

export const snacks: Snack[] = [
  { id: "popcorn", name: "Popcorn", priceCents: 600 },
  { id: "chocolate", name: "Chocolate almonds", priceCents: 500 },
  { id: "water", name: "Sparkling water", priceCents: 300 },
];

export function getMovie(id: string) {
  return movies.find((movie) => movie.id === id);
}

export function getScreening(id: string) {
  return screenings.find((screening) => screening.id === id);
}

export function getSnack(id: string) {
  return snacks.find((snack) => snack.id === id);
}

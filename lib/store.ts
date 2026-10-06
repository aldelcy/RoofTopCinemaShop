import { getMovie, getScreening, getSnack, movies, screenings, snackCap, snacks } from "@/data/catalog";
import type { Line, Order, OrderDraft, StoredSnack } from "@/lib/types";

/**
 * Demo order memory. This is not a database.
 * Sold seats and orders live on the server process and reset when it restarts.
 * Webflow Cloud runs the app in isolated workers, so this same limit applies there:
 * the capacity check is real for the running process, and it is not durable storage.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Memory = {
  sold: Record<string, number>;
  orders: Record<string, Order>;
  idempotency: Record<string, string>;
};

const globalStore = globalThis as typeof globalThis & {
  __rooftopCinemaShop?: Memory;
};

function memory(): Memory {
  if (!globalStore.__rooftopCinemaShop) {
    globalStore.__rooftopCinemaShop = { sold: {}, orders: {}, idempotency: {} };
  }
  return globalStore.__rooftopCinemaShop;
}

export function seatsRemaining(screeningId: string) {
  const screening = getScreening(screeningId);
  if (!screening) return 0;
  const sold = memory().sold[screeningId] ?? 0;
  return Math.max(0, screening.capacity - sold);
}

export function listCatalog() {
  return movies.map((movie) => ({
    movie,
    screenings: screenings
      .filter((screening) => screening.movieId === movie.id)
      .slice()
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
      .map((screening) => ({
        screening,
        remaining: seatsRemaining(screening.id),
      })),
  }));
}

export function getScreeningView(id: string) {
  const screening = getScreening(id);
  if (!screening) return null;
  const movie = getMovie(screening.movieId);
  if (!movie) return null;
  return { movie, screening, remaining: seatsRemaining(screening.id) };
}

export type Quote =
  | {
      ok: true;
      lines: Line[];
      totalCents: number;
      movieId: string;
      movieTitle: string;
      venue: string;
      date: string;
      time: string;
      ticketQuantity: number;
      ticketAmountCents: number;
      snacks: StoredSnack[];
      remaining: number;
    }
  | { ok: false; error: string };

export function quoteDraft(draft: OrderDraft): Quote {
  const screening = getScreening(draft.screeningId);
  if (!screening) return { ok: false, error: "That screening is not available." };
  const movie = getMovie(screening.movieId);
  if (!movie) return { ok: false, error: "That movie is not available." };

  if (!Number.isInteger(draft.ticketQuantity) || draft.ticketQuantity < 1) {
    return { ok: false, error: "Choose at least one ticket." };
  }

  const remaining = seatsRemaining(screening.id);
  if (draft.ticketQuantity > remaining) {
    return {
      ok: false,
      error:
        remaining === 0
          ? "This screening is sold out."
          : `Only ${remaining} ${remaining === 1 ? "seat" : "seats"} left.`,
    };
  }

  const requested = new Map<string, number>();
  for (const item of draft.snacks) {
    if (!getSnack(item.id)) {
      return { ok: false, error: "One of those snacks is not on the menu." };
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 0 || item.quantity > snackCap) {
      return { ok: false, error: `You can add up to ${snackCap} of each snack.` };
    }
    requested.set(item.id, (requested.get(item.id) ?? 0) + item.quantity);
  }

  const snackLines: StoredSnack[] = [];
  for (const snack of snacks) {
    const quantity = requested.get(snack.id) ?? 0;
    if (quantity === 0) continue;
    if (quantity > snackCap) {
      return { ok: false, error: `You can add up to ${snackCap} of each snack.` };
    }
    snackLines.push({
      id: snack.id,
      name: snack.name,
      quantity,
      amountCents: snack.priceCents * quantity,
    });
  }

  const ticketAmountCents = screening.priceCents * draft.ticketQuantity;
  const totalCents =
    ticketAmountCents + snackLines.reduce((sum, line) => sum + line.amountCents, 0);
  const lines: Line[] = [
    {
      label: `General admission × ${draft.ticketQuantity}`,
      amountCents: ticketAmountCents,
    },
    ...snackLines.map((line) => ({
      label: `${line.name} × ${line.quantity}`,
      amountCents: line.amountCents,
    })),
  ];

  return {
    ok: true,
    lines,
    totalCents,
    movieId: movie.id,
    movieTitle: movie.title,
    venue: screening.venue,
    date: screening.date,
    time: screening.time,
    ticketQuantity: draft.ticketQuantity,
    ticketAmountCents,
    snacks: snackLines,
    remaining,
  };
}

export type PlaceOrderInput = OrderDraft & {
  email: string;
  idempotencyKey: string;
};

export function placeOrder(input: PlaceOrderInput): { ok: true; order: Order } | { ok: false; error: string } {
  const key = input.idempotencyKey.trim();
  if (!/^[A-Za-z0-9-]{16,80}$/.test(key)) {
    return { ok: false, error: "Could not start checkout. Go back and try again." };
  }

  const existingId = memory().idempotency[key];
  if (existingId) {
    const existing = memory().orders[existingId];
    if (existing) return { ok: true, order: existing };
  }

  const email = input.email.trim();
  if (!email) return { ok: false, error: "Enter your email." };
  if (email.length > 254 || !EMAIL.test(email)) {
    return { ok: false, error: "Enter a valid email." };
  }

  const quote = quoteDraft(input);
  if (!quote.ok) return quote;

  const order: Order = {
    id: crypto.randomUUID(),
    email,
    movieId: quote.movieId,
    movieTitle: quote.movieTitle,
    venue: quote.venue,
    date: quote.date,
    time: quote.time,
    ticketQuantity: quote.ticketQuantity,
    ticketAmountCents: quote.ticketAmountCents,
    snacks: quote.snacks,
    totalCents: quote.totalCents,
    confirmationCode: confirmationCode(),
    createdAt: new Date().toISOString(),
  };

  const shop = memory();
  shop.sold[input.screeningId] = (shop.sold[input.screeningId] ?? 0) + quote.ticketQuantity;
  shop.orders[order.id] = order;
  shop.idempotency[key] = order.id;
  return { ok: true, order };
}

export function getOrder(id: string) {
  return memory().orders[id] ?? null;
}

function confirmationCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let code = "RC-";
  for (const byte of bytes) code += alphabet[byte % alphabet.length];
  return code;
}

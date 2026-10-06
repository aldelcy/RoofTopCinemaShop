import type { OrderDraft } from "@/lib/types";

type QueryValue = string | string[] | undefined;

export type DraftQuery = {
  screening?: QueryValue;
  tickets?: QueryValue;
  snack?: QueryValue;
};

function first(value: QueryValue) {
  return Array.isArray(value) ? value[0] : value;
}

function all(value: QueryValue) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseDraft(query: DraftQuery): { ok: true; draft: OrderDraft } | { ok: false; error: string } {
  const screeningId = first(query.screening)?.trim() ?? "";
  if (!screeningId) {
    return { ok: false, error: "Choose a screening and tickets first." };
  }

  const tickets = Number(first(query.tickets));
  if (!Number.isInteger(tickets) || tickets < 1) {
    return { ok: false, error: "Choose at least one ticket." };
  }

  const snacks = [];
  for (const entry of all(query.snack)) {
    const [id, rawQty] = entry.split(":");
    const quantity = Number(rawQty);
    if (!id || !Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, error: "Check the snack quantities and try again." };
    }
    snacks.push({ id, quantity });
  }

  return { ok: true, draft: { screeningId, ticketQuantity: tickets, snacks } };
}

export function draftQuery(draft: OrderDraft) {
  const params = new URLSearchParams();
  params.set("screening", draft.screeningId);
  params.set("tickets", String(draft.ticketQuantity));
  for (const snack of draft.snacks) {
    if (snack.quantity > 0) params.append("snack", `${snack.id}:${snack.quantity}`);
  }
  return params.toString();
}

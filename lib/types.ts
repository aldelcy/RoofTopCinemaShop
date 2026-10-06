export type SnackSelection = {
  id: string;
  quantity: number;
};

export type OrderDraft = {
  screeningId: string;
  ticketQuantity: number;
  snacks: SnackSelection[];
};

export type Line = {
  label: string;
  amountCents: number;
};

export type StoredSnack = {
  id: string;
  name: string;
  quantity: number;
  amountCents: number;
};

export type Order = {
  id: string;
  email: string;
  movieId: string;
  movieTitle: string;
  venue: string;
  date: string;
  time: string;
  ticketQuantity: number;
  ticketAmountCents: number;
  snacks: StoredSnack[];
  totalCents: number;
  confirmationCode: string;
  createdAt: string;
};

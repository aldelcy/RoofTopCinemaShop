export function formatMoney(cents: number) {
  const hasCents = cents % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

function screeningDate(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, (month || 1) - 1, day || 1, hour || 0, minute || 0, 0, 0);
}

export function formatWhen(date: string, time: string, style: "short" | "long" = "short") {
  const value = screeningDate(date, time);
  const day = new Intl.DateTimeFormat(
    "en-US",
    style === "long"
      ? { weekday: "long", month: "long", day: "numeric", year: "numeric" }
      : { weekday: "short", month: "short", day: "numeric" },
  ).format(value);
  const clock = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
  return `${day} · ${clock}`;
}

export function seatLabel(remaining: number) {
  if (remaining <= 0) return "Sold out";
  if (remaining === 1) return "1 seat left";
  return `${remaining} seats left`;
}

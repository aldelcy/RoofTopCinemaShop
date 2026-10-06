import { formatMoney } from "@/lib/format";
import type { Line } from "@/lib/types";

export function OrderSummary({ lines, totalCents }: { lines: Line[]; totalCents: number }) {
  return (
    <section className="card summary" aria-label="Order summary">
      <h2>Your order</h2>
      <ul className="lines">
        {lines.map((line) => (
          <li key={line.label}>
            <span>{line.label}</span>
            <span>{formatMoney(line.amountCents)}</span>
          </li>
        ))}
      </ul>
      <p className="total">
        <span>Total</span>
        <span>{formatMoney(totalCents)}</span>
      </p>
    </section>
  );
}

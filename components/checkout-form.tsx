"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { placeOrderAction } from "@/app/actions";
import type { OrderDraft } from "@/lib/types";

export function CheckoutForm({ draft }: { draft: OrderDraft }) {
  const router = useRouter();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await placeOrderAction({
        ...draft,
        email,
        idempotencyKey,
      });
      if (!result.ok) {
        setError(result.error);
        setPending(false);
        return;
      }
      router.push(`/confirmation/${result.orderId}`);
    } catch {
      setError("Something went wrong. Try again.");
      setPending(false);
    }
  }

  return (
    <form className="pay" onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <p className="note">Shown on your confirmation. This demo does not send email.</p>
      {error ? (
        <p className="alert" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="button button-block" disabled={pending}>
        {pending ? "Confirming…" : "Confirm payment"}
      </button>
      <p className="note">Simulated payment. No card is charged.</p>
    </form>
  );
}

"use server";

import { placeOrder, type PlaceOrderInput } from "@/lib/store";

export async function placeOrderAction(input: PlaceOrderInput) {
  const result = placeOrder(input);
  if (!result.ok) return result;
  return { ok: true as const, orderId: result.order.id };
}

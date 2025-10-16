"use client";

import { OrderSummary } from "@/components/Main/OrderSummary";

export default function OrderPage() {
  return (
    <main className="h-230 w-full overflow-auto p-16">
      <OrderSummary />
    </main>
  );
}

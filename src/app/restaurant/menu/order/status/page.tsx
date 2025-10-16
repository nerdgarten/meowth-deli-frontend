"use client";

import { OrderStatus } from "@/components/Main/OrderStatus";

export default function StatusPage() {
  return (
    <main className="h-230 w-full overflow-auto p-16">
      <OrderStatus/>
    </main>
  );
}

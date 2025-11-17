"use client";

import { OrderStatusMenu } from "@/components/Main/OrderStatus";
import type { IOrder } from "@/types/order";

export default function StatusPage() {
  const order = {
    id: 0,
    customer_id: 0,
    driver_id: 0,
    status: "pending",
    remark: "Dontknow",
    total_amount: 20,
    driver_fee: 5,
  } as IOrder;
  return (
    <main className="h-230 w-full overflow-auto p-16">
      <OrderStatusMenu order={order}/>
    </main>
  );
}

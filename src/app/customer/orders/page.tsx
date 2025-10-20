"use client";

import { ClipboardList } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/libs/axios";
import { cn } from "@/libs/utils";
import type { IOrder } from "@/types/order";

type OrderStatus =
  | "pending"
  | "preparing"
  | "delivered"
  | "rejected"
  | "success";

interface OrderSummary {
  id: string;
  title: string;
  total: number;
  status: OrderStatus;
}

const statusStyleMap: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-700",
  },
  preparing: {
    label: "Preparing",
    className: "bg-blue-100 text-blue-600",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-600",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },
  success: {
    label: "Success",
    className: "bg-green-100 text-green-700",
  },
};

function handleViewOrder(orderId: string) {
  // Placeholder handler until navigation is wired up
  console.log(`View details for order: ${orderId}`);
}

export default function CustomerOrdersPage() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("id");
  const hasCustomerId = Boolean(customerId);

  const {
    data: fetchedOrders = [],
    isLoading,
    isError,
  } = useQuery<IOrder[]>({
    queryKey: ["customer-orders", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const response = await apiClient.get<IOrder[]>(`/customer/my-orders`);

      return response.data;
    },
    enabled: hasCustomerId,
    staleTime: 60_000,
  });

  const orderSummaries = useMemo<OrderSummary[]>(() => {
    if (!hasCustomerId) return [];

    const orders = Array.isArray(fetchedOrders) ? fetchedOrders : [];

    return orders.map((order) => ({
      id: String(order.id),
      title: order.remark ?? order.location,
      total: order.total_amount,
      status: order.status as OrderStatus,
    }));
  }, [fetchedOrders, hasCustomerId]);

  return (
    <main className="bg-app-background py-8">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <section className="mt-[4rem] rounded-3xl bg-white shadow-[0_15px_40px_rgba(64,56,49,0.08)]">
          <header className="flex items-start gap-4 border-b border-black/5 px-8 py-6">
            <span className="bg-app-dark-brown/10 text-app-dark-brown flex size-12 items-center justify-center rounded-full">
              <ClipboardList className="size-6" />
            </span>
            <div>
              <h1 className="text-app-dark-brown text-xl font-semibold">
                Order History
              </h1>
              <p className="text-app-brown/80 mt-1 text-sm">
                View your recent orders and their status.
              </p>
            </div>
          </header>

          <div className="space-y-4 px-4 pt-6 pb-8 md:px-8">
            {!hasCustomerId && (
              <p className="text-app-brown/80 text-sm">
                Unable to load orders without a customer id.
              </p>
            )}
            {hasCustomerId && isLoading && (
              <p className="text-app-brown/80 text-sm">Loading orders...</p>
            )}
            {hasCustomerId && isError && (
              <p className="text-app-brown/80 text-sm">
                Failed to load your orders. Please try again later.
              </p>
            )}
            {hasCustomerId &&
              !isLoading &&
              !isError &&
              (orderSummaries.length === 0 ? (
                <p className="text-app-brown/80 text-sm">
                  You have no orders yet.
                </p>
              ) : (
                orderSummaries.map((order) => {
                  const statusInfo = statusStyleMap[order.status];

                  return (
                    <article
                      key={order.id}
                      className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-white px-6 py-5 shadow-[0_8px_20px_rgba(104,91,75,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(104,91,75,0.12)] md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-app-dark-brown text-base font-semibold">
                            {order.id}
                          </p>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase",
                              statusInfo.className
                            )}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-app-brown/80 mt-2 text-sm">
                          {order.title}
                        </p>
                        <p className="text-customer-font mt-3 text-lg font-semibold">
                          ฿ {order.total.toFixed(2)}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        className="text-app-dark-brown hover:bg-app-dark-brown self-start rounded-full border-black/10 px-6 py-5 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:text-white md:self-center"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        View Details
                      </Button>
                    </article>
                  );
                })
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

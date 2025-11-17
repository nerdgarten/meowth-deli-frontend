"use client";

import { Button } from "@ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import Image from "next/image";
import { useState, useMemo, useCallback } from "react";
import type { IOrder } from "@/types/order";
import { queryDriverOrders, type IOrderDetails } from "@/queries/order";
import { useQuery } from "node_modules/@tanstack/react-query/build/modern/useQuery";

const STATUS_LABELS: Record<IOrder["status"], string> = {
  pending: "Pending",
  preparing: "In Progress",
  delivered: "Delivered",
  rejected: "Cancelled",
  success: "Complete",
};

const STATUS_STYLES: Record<IOrder["status"], string> = {
  pending: "bg-[#6c757d] text-white",
  preparing: "bg-[#6c757d] text-white",
  delivered: "bg-[#0dcaf0] text-white",
  rejected: "bg-[#dc3545] text-white",
  success: "bg-[#0dcaf0] text-white",
};

const FILTERS: Array<{ label: string; value: IOrder["status"] | "all" }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Delivered", value: "delivered" },
  { label: "Success", value: "success" },
  { label: "Rejected", value: "rejected" },
];

const formatCurrency = (value: number) =>
  `${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ฿`;

export default function OrdersPage() {
  const { data: orders = [], isLoading: ordersIsLoading } = useQuery<
    IOrderDetails[]
  >({
    queryKey: ["driver-orders"],
    queryFn: queryDriverOrders,
  });
  const [activeOrder, setActiveOrder] = useState<IOrderDetails | null>(null);

  const incomingOrders = useMemo(() => {
    return orders.filter((order) =>
      ["pending", "preparing"].includes(order.status)
    );
  }, [orders]);

  const completeOrders = useMemo(() => {
    return orders.filter((order) =>
      ["success", "rejected", "delivered"].includes(order.status)
    );
  }, [orders]);

  const handleCloseModal = useCallback(() => {
    setActiveOrder(null);
  }, []);

  return (
    <Dialog
      open={!!activeOrder}
      onOpenChange={(open) => !open && handleCloseModal()}
    >
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <section className="space-y-8 rounded-3xl bg-[#fff8eb] p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#b8860b]">
              Manage Order Delivery
            </h1>
            <p className="text-[#8b7355]">
              Accepting the task, tracking and managing the customer orders
              here.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-xl font-bold text-black">
                Incoming Order
              </h2>
              <div className="space-y-4">
                {incomingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={() => setActiveOrder(order)}
                  />
                ))}
                {incomingOrders.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-[#d4c5a9] bg-white px-6 py-12 text-center">
                    <p className="text-[#8b7355]">No incoming orders</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold text-black">
                Complete Order
              </h2>
              <div className="space-y-4">
                {completeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={() => setActiveOrder(order)}
                  />
                ))}
                {completeOrders.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-[#d4c5a9] bg-white px-6 py-12 text-center">
                    <p className="text-[#8b7355]">No completed orders</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <DialogContent className="max-h-[75vh] overflow-y-scroll sm:max-w-[425px]">
        {activeOrder ? (
          <>
            <DialogHeader className="border-b pr-8 pb-4">
              <div className="flex items-baseline justify-between gap-2">
                <DialogTitle className="text-2xl font-bold">
                  Customer Order
                </DialogTitle>
                <span className="text-lg font-semibold text-[#6c757d]">
                  ORD-{String(activeOrder.id).padStart(3, "0")}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Restaurant Info */}
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]">
                  {activeOrder.restaurant.banner ? (
                    <Image
                      src={activeOrder.restaurant.banner}
                      alt={activeOrder.restaurant.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#999]">
                      <span className="text-2xl">🍕</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black">
                    {activeOrder.restaurant.name}
                  </h3>
                  {activeOrder.driver?.firstname && (
                    <p className="text-sm text-[#6c757d]">
                      Delivered by {activeOrder.driver.firstname}{" "}
                      {activeOrder.driver.lastname}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {activeOrder.orderDishes.map((orderDish, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]">
                      {orderDish.dish.image ? (
                        <Image
                          src={orderDish.dish.image}
                          alt={orderDish.dish.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#999]">
                          <span className="text-2xl">🍽️</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-black">
                            <span className="mr-2">{orderDish.amount}x</span>
                            {orderDish.dish.name}
                          </p>
                          {orderDish.remark && (
                            <p className="text-xs text-[#6c757d]">
                              {orderDish.remark}
                            </p>
                          )}
                        </div>
                        <span className="ml-3 font-semibold text-black">
                          ฿ {orderDish.dish.price * orderDish.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Addresses */}
              <div className="space-y-3 border-t border-b py-4">
                <div className="flex items-start gap-2">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#6c757d]">
                    <div className="h-2 w-2 rounded-full bg-[#6c757d]"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-black">
                      {activeOrder.restaurant.name}
                    </p>
                  </div>
                </div>
                <div className="ml-2.5 h-6 w-0.5 bg-[#d4c5a9]"></div>
                <div className="flex items-start gap-2">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <svg
                      className="h-5 w-5 text-[#6c757d]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-black">
                      {activeOrder.location.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6c757d]">Subtotal</span>
                  <span className="text-black">
                    ฿ {activeOrder.total_amount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6c757d]">Delivery fee</span>
                  <span className="text-black">{activeOrder.driver_fee}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                  <span className="text-black">Total</span>
                  <span className="text-black">
                    ฿ {activeOrder.total_amount + activeOrder.driver_fee}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="border-t pt-4">
              {activeOrder.status === "preparing" && (
                <Button
                  className="w-full rounded-lg bg-[#f5c563] py-6 text-lg font-medium text-white hover:bg-[#f0b84a]"
                  onClick={() => {
                    // TODO: Handle mark as complete
                  }}
                >
                  Mark as complete
                </Button>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type OrderCardProps = {
  order: IOrderDetails;
  onViewDetails: () => void;
};

function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const statusClass = STATUS_STYLES[order.status];

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#d4c5a9] bg-white px-6 py-5 shadow-sm">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-black">
            ORD-{String(order.id).padStart(3, "0")}
          </span>
          <span
            className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ${statusClass}`}
          >
            {STATUS_LABELS[order.status]}
          </span>
        </div>
        <p className="text-sm text-[#6c757d]">{order.location.address}</p>
        <p className="text-base font-semibold text-[#d2691e]">
          Delivery Fee {formatCurrency(order.driver_fee)}
        </p>
      </div>
      <Button
        variant="outline"
        className="rounded-lg border-[#6c757d] px-6 py-2 text-sm font-medium text-[#6c757d] hover:bg-[#f8f9fa]"
        onClick={onViewDetails}
      >
        View Details
      </Button>
    </div>
  );
}

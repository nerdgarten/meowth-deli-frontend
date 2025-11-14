"use client";

import * as React from "react";
import Image from "next/image";

import type { IOrder } from "@/types/order";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Button } from "@ui/button";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  note?: string;
  image?: string;
}

interface OrderDetails extends IOrder {
  restaurant_name: string;
  restaurant_image?: string;
  driver_name?: string;
  delivery_address: string;
  items: OrderItem[];
  subtotal: number;
}

const orders: OrderDetails[] = [
  {
    id: 2380,
    restaurant_id: 1,
    customer_id: 102,
    driver_id: null,
    location: "Pizza Com บ้าน",
    status: "preparing",
    remark: "Allergies: no peanuts",
    total_amount: 920,
    driver_fee: 22,
    restaurant_name: "Pizza Com บ้าน ชาย มูรา - บางพลัด",
    driver_name: "John Doorson",
    delivery_address: "285/17 The King Hotel ถนนพชนาเฮม",
    subtotal: 898,
    items: [
      {
        name: "Premium French Imported Artisanal Avocado Oil",
        quantity: 1,
        price: 299,
        note: "Avocado oil 100ML *1",
        // image: "/placeholder-dish.jpg",
      },
      {
        name: "French Imported Walnut Bread Spread",
        quantity: 1,
        price: 599,
        note: "200g *1",
        // image: "/placeholder-dish.jpg",
      },
    ],
  },
  {
    id: 2381,
    restaurant_id: 2,
    customer_id: 219,
    driver_id: 18,
    location: "Pizza อีก",
    status: "success",
    remark: null,
    total_amount: 320,
    driver_fee: 15,
    restaurant_name: "Pizza อีก",
    delivery_address: "123 Main Street",
    subtotal: 305,
    items: [
      {
        name: "Margherita Pizza",
        quantity: 1,
        price: 305,
      },
    ],
  },
  {
    id: 2382,
    restaurant_id: 3,
    customer_id: 356,
    driver_id: 24,
    location: "โดนเบ Pizza",
    status: "rejected",
    remark: "Leave at concierge",
    total_amount: 617,
    driver_fee: 20,
    restaurant_name: "โดนเบ Pizza",
    delivery_address: "456 Garden Lane",
    subtotal: 597,
    items: [
      {
        name: "Pepperoni Pizza",
        quantity: 1,
        price: 597,
      },
    ],
  },
  {
    id: 2383,
    restaurant_id: 1,
    customer_id: 410,
    driver_id: 33,
    location: "โดนเบ Pizza",
    status: "success",
    remark: null,
    total_amount: 274,
    driver_fee: 20,
    restaurant_name: "โดนเบ Pizza",
    delivery_address: "789 Market Road",
    subtotal: 254,
    items: [
      {
        name: "Hawaiian Pizza",
        quantity: 1,
        price: 254,
      },
    ],
  },
];

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

const formatCurrency = (value: number) =>
  `${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ฿`;

export default function OrdersPage() {
  const [activeOrder, setActiveOrder] = React.useState<OrderDetails | null>(
    null
  );

  const incomingOrders = React.useMemo(() => {
    return orders.filter((order) =>
      ["pending", "preparing"].includes(order.status)
    );
  }, []);

  const completeOrders = React.useMemo(() => {
    return orders.filter((order) =>
      ["success", "rejected", "delivered"].includes(order.status)
    );
  }, []);

  const handleCloseModal = React.useCallback(() => {
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
                  {activeOrder.restaurant_image ? (
                    <Image
                      src={activeOrder.restaurant_image}
                      alt={activeOrder.restaurant_name}
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
                    {activeOrder.restaurant_name}
                  </h3>
                  {activeOrder.driver_name && (
                    <p className="text-sm text-[#6c757d]">
                      Delivered by {activeOrder.driver_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {activeOrder.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
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
                            <span className="mr-2">{item.quantity}x</span>
                            {item.name}
                          </p>
                          {item.note && (
                            <p className="text-xs text-[#6c757d]">
                              {item.note}
                            </p>
                          )}
                        </div>
                        <span className="ml-3 font-semibold text-black">
                          ฿ {item.price}
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
                      {activeOrder.restaurant_name}
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
                      {activeOrder.delivery_address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6c757d]">Subtotal</span>
                  <span className="text-black">฿ {activeOrder.subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6c757d]">Delivery fee</span>
                  <span className="text-black">{activeOrder.driver_fee}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                  <span className="text-black">Total</span>
                  <span className="text-black">
                    ฿ {activeOrder.total_amount}
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
  order: OrderDetails;
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
        <p className="text-sm text-[#6c757d]">{order.location}</p>
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

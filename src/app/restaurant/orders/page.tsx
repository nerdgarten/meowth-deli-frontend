"use client";

import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Package } from "lucide-react";
import * as React from "react";

import type { IOrder } from "@/types/order";

const orders: IOrder[] = [
  {
    id: 2380,
    restaurant_id: 1,
    customer_id: 102,
    driver_id: null,
    location: "123 Catnip Street, Downtown",
    status: "pending",
    remark: "Allergies: no peanuts",
    total_amount: 48.5,
    driver_fee: 5.25,
    restaurant_id: 1,
  },
  {
    id: 2381,
    restaurant_id: 1,
    customer_id: 219,
    driver_id: 18,
    location: "77 Whiskers Ave, Midtown",
    status: "preparing",
    remark: null,
    total_amount: 32.9,
    driver_fee: 4.1,
    restaurant_id: 1,
  },
  {
    id: 2382,
    restaurant_id: 1,
    customer_id: 356,
    driver_id: 24,
    location: "12 Garden Lane, Riverside",
    status: "delivered",
    remark: "Leave at concierge",
    total_amount: 61.75,
    driver_fee: 6.8,
    restaurant_id: 1,
  },
  {
    id: 2383,
    restaurant_id: 1,
    customer_id: 410,
    driver_id: 33,
    location: "908 Market Road, Uptown",
    status: "success",
    remark: null,
    total_amount: 27.4,
    driver_fee: 3.5,
    restaurant_id: 1,
  },
  {
    id: 2384,
    restaurant_id: 1,
    customer_id: 512,
    driver_id: 45,
    location: "52 Fisherman Wharf, Riverside",
    status: "pending",
    remark: "Ring the doorbell twice",
    total_amount: 43.2,
    driver_fee: 5.05,
    restaurant_id: 1,
  },
];

const STATUS_LABELS: Record<IOrder["status"], string> = {
  pending: "Awaiting Confirmation",
  preparing: "Being Prepared",
  delivered: "Delivered",
  rejected: "Rejected",
  success: "Completed",
};

const STATUS_ACCENTS: Record<IOrder["status"], string> = {
  pending: "bg-[#fff3cd] text-[#856404]",
  preparing: "bg-[#d1ecf1] text-[#0c5460]",
  delivered: "bg-[#d4edda] text-[#155724]",
  rejected: "bg-[#f8d7da] text-[#721c24]",
  success: "bg-[#d4edda] text-[#155724]",
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
  `฿${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function OrdersPage() {
  const totalOrders = orders.length;
  const preparingOrders = orders.filter(
    (order) => order.status === "preparing"
  ).length;
  const outForDeliveryOrders = orders.filter(
    (order) => order.status === "pending" && order.driver_id !== null
  ).length;
  const deliveredOrders = orders.filter((order) =>
    ["delivered", "success"].includes(order.status)
  ).length;

  const [statusFilter, setStatusFilter] = React.useState<
    IOrder["status"] | "all"
  >("all");
  const [activeOrder, setActiveOrder] = React.useState<IOrder | null>(null);

  const filteredOrders = React.useMemo(() => {
    if (statusFilter === "all") {
      return orders;
    }
    return orders.filter((order) => order.status === statusFilter);
  }, [statusFilter]);

  const handleCloseModal = React.useCallback(() => {
    setActiveOrder(null);
  }, []);

  return (
    <Dialog
      open={!!activeOrder}
      onOpenChange={(open) => !open && handleCloseModal()}
    >
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <section className="space-y-6 rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-[#e7cfa2]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#2d1d10]">
                Manage Order Delivery
              </h2>
              <p className="text-sm text-[#7a5a35]">
                Track incoming orders and assign riders quickly.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* TODO: revalidate query??? */}
              <Button className="rounded-xl bg-[#6f5236] px-4 py-2 text-sm font-semibold text-[#f6e9d2] transition hover:bg-[#8a6846]">
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-2xl bg-[#fdf0d4] p-6 shadow-inner ring-1 ring-[#f1d39a]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[#c7731b]">
                  Received Orders
                </h3>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((filter) => {
                    const isActive = statusFilter === filter.value;
                    return (
                      <Button
                        size="sm"
                        key={filter.value}
                        onClick={() => setStatusFilter(filter.value)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase transition ${
                          isActive
                            ? "bg-[#c8942c] text-white shadow hover:bg-[#b37a1f]"
                            : "bg-white text-[#946627] shadow-sm hover:bg-[#f5e2b6]"
                        }`}
                      >
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {filteredOrders.map((order) => {
                  const statusClass = STATUS_ACCENTS[order.status];

                  return (
                    <div
                      className="cursor-pointer space-y-2 rounded-xl bg-white px-6 py-5 shadow-lg ring-1 ring-[#f4dba7] transition hover:ring-[#c8942c] md:flex-row md:items-center md:justify-between"
                      key={order.id}
                      onClick={() => setActiveOrder(order)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setActiveOrder(order);
                        }
                      }}
                    >
                      <div className="flex w-full flex-row flex-wrap items-center gap-2 text-[#5a3a1c]">
                        <p className="text-sm font-semibold text-[#8f5a20]">
                          Order ID #{order.id}
                        </p>
                        <div className="flex-auto"></div>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-[0.7rem] font-semibold tracking-wide uppercase ${statusClass}`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <p className="text-xs text-[#a88553]">
                        Deliver to {order.location}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-[#7a5a35]">
                        <span>
                          Total:{" "}
                          <span className="font-semibold text-[#5f3b15]">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </span>
                        <span>
                          Driver fee: {formatCurrency(order.driver_fee)}
                        </span>
                        {order.remark ? (
                          <span>Remark: {order.remark}</span>
                        ) : null}
                      </div>

                      <OrderActions
                        order={order}
                        setActiveOrder={setActiveOrder}
                      />
                    </div>
                  );
                })}
                {!filteredOrders.length ? (
                  <div className="rounded-xl border border-dashed border-[#ddb77a] px-6 py-12 text-center text-sm text-[#7a5a35]">
                    No orders found for this status.
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="space-y-4 rounded-2xl bg-[#f8dca2] p-6 shadow-lg ring-1 ring-[#eec783]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7a23a] text-white shadow-lg">
                  <Package className="size-6" />
                </div>
                <div>
                  <p className="text-sm tracking-wider text-[#8f5a20] uppercase">
                    Order summary
                  </p>
                  <p className="text-2xl font-semibold text-[#2d1d10]">Today</p>
                </div>
              </div>

              <dl className="space-y-4 text-sm text-[#6f5236]">
                <SummaryRow label="Orders received" value={totalOrders} />
                <SummaryRow label="Being prepared" value={preparingOrders} />
                <SummaryRow
                  label="Out for delivery"
                  value={outForDeliveryOrders}
                />
                <SummaryRow label="Delivered" value={deliveredOrders} />
              </dl>
            </aside>
          </div>
        </section>
      </div>

      <DialogContent className="max-w-lg">
        {activeOrder ? (
          <>
            <DialogHeader>
              <DialogTitle>Order #{activeOrder.id}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2 text-[#5a3a1c]">
                Customer #{activeOrder.customer_id}
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-[0.7rem] font-semibold tracking-wide uppercase ${STATUS_ACCENTS[activeOrder.status]}`}
                >
                  {STATUS_LABELS[activeOrder.status]}
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-[#3b2f26]">
              <div>
                <h4 className="font-semibold text-[#8f5a20]">
                  Delivery Address
                </h4>
                <p>{activeOrder.location}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Total Amount"
                  value={formatCurrency(activeOrder.total_amount)}
                />
                <DetailItem
                  label="Driver Fee"
                  value={formatCurrency(activeOrder.driver_fee)}
                />
                <DetailItem
                  label="Driver ID"
                  value={
                    activeOrder.driver_id
                      ? `#${activeOrder.driver_id}`
                      : "Unassigned"
                  }
                />
                <DetailItem label="Remark" value={activeOrder.remark ?? "—"} />
              </div>
            </div>
            <DialogFooter>
              {/* TODO: handle on click */}
              <Button
                size="sm"
                className="rounded-lg border border-[#d0b37e] px-4 py-2 text-xs font-semibold tracking-wider text-[#6f5236] uppercase transition hover:bg-[#f9e0b7]"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type OrderActionsProps = {
  order: IOrder;
  setActiveOrder: React.Dispatch<React.SetStateAction<IOrder | null>>;
};

function OrderActions({ order, setActiveOrder }: OrderActionsProps) {
  if (order.status === "pending") {
    return (
      <div className="flex items-center justify-end gap-3">
        {/* TODO: handle on click */}
        <Button
          size="sm"
          className="rounded-lg border border-[#d0b37e] px-4 py-2 text-xs font-semibold tracking-wider text-[#6f5236] uppercase transition hover:bg-[#f9e0b7]"
          onClick={(event) => event.stopPropagation()}
        >
          Reject
        </Button>
        <Button
          size="sm"
          className="rounded-lg bg-[#f7a23a] px-4 py-2 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#e98622]"
          onClick={(event) => event.stopPropagation()}
        >
          Accept
        </Button>
      </div>
    );
  }

  if (order.status === "preparing") {
    return (
      <div className="flex items-center justify-end gap-3">
        {/* TODO: handle on click */}
        <Button
          size="sm"
          className="rounded-lg bg-[#6f5236] px-4 py-2 text-xs font-semibold tracking-wider text-[#f6e9d2] uppercase transition hover:bg-[#8a6846]"
          onClick={(event) => event.stopPropagation()}
        >
          Hand Off to Driver
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Button
        size="sm"
        className="rounded-lg border border-[#d0b37e] px-4 py-2 text-xs font-semibold tracking-wider text-[#6f5236] uppercase transition hover:bg-[#f9e0b7]"
        onClick={(event) => {
          event.stopPropagation();
          setActiveOrder(order);
        }}
      >
        View Details
      </Button>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between">
      <dt>{label}</dt>
      <dd className="text-base font-semibold text-[#2d1d10]">{value}</dd>
    </div>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-lg bg-[#fdf0d4] p-3">
      <p className="text-xs font-semibold tracking-wide text-[#a27a3a] uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm text-[#3b2f26]">{value}</p>
    </div>
  );
}

import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import type { CartItem } from "@/types/order";
import type { ICreateLocation } from "@/types/location";

interface OrderSummaryProps {
  location: ICreateLocation[];
  cartItem: CartItem[];
  restaurantName: string;
  TotalPrice: number;
  onSubmit: (remark: string) => void;
}

// Safe type guard for dish
function isValidDish(dish: unknown): dish is { name: string; price: number } {
  if (typeof dish !== "object" || dish === null) return false;

  const maybeDish = dish as Record<string, unknown>;
  return (
    typeof maybeDish.name === "string" && typeof maybeDish.price === "number"
  );
}

export const OrderSummary = ({
  cartItem,
  restaurantName,
  TotalPrice,
  onSubmit,
}: OrderSummaryProps) => {
  // Safely calculate subtotal
  const subtotal = cartItem.reduce((acc, item) => {
    if (!isValidDish(item.dish)) return acc;
    if (typeof item.quantity !== "number") return acc;
    return acc + item.dish.price * item.quantity;
  }, 0);

  const deliveryFee = 0; // Replace with actual delivery logic
  const [remark, setRemark] = useState<string>("");
  return (
    <div className="flex flex-col rounded-sm bg-white p-4">
      {/* Header */}
      <div className="h-full border-b p-4">
        <h2 className="text-4xl font-bold">{restaurantName || "Restaurant"}</h2>
        <div className="mx-4 mt-12 flex flex-col gap-4">
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">Order Summary</h3>
            <h4 className="text-xl font-bold text-purple-700">Add Items</h4>
          </div>

          {/* Cart Items */}
          {cartItem.map((item, idx) => {
            if (!isValidDish(item.dish)) return null;
            if (typeof item.quantity !== "number") return null;
            console.log("Rendering item:", item);
            return (
              <div key={idx} className="mt-4 flex h-full justify-between">
                <div className="flex gap-6">
                  <Image
                    src={item.dish.image || "/placeholder.png"}
                    alt={item.dish.name}
                    width={96}
                    height={96}
                    className="aspect-square h-24 rounded-sm bg-slate-200"
                  />
                  <div className="text-lg font-bold">
                    <h4 className="text-black">
                      {item.dish.name} x {item.quantity}
                    </h4>
                    <h4 className="text-purple-700">Edit</h4>
                  </div>
                </div>
                <h4 className="text-lg font-semibold">
                  {(item.dish.price * item.quantity).toFixed(2)} THB
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mx-8 mt-10 flex flex-col gap-4">
        <div className="flex h-full justify-between">
          <h2 className="text-lg font-bold">Subtotal</h2>
          <h2 className="text-lg font-semibold">{subtotal.toFixed(2)}</h2>
        </div>

        <div className="flex h-full justify-between">
          <h2 className="text-lg font-bold">Delivery Fee</h2>
          <h2 className="text-lg font-semibold">{deliveryFee.toFixed(2)}</h2>
        </div>

        <div className="flex h-16 w-full items-center justify-between rounded-md border border-slate-300 p-8 transition hover:bg-gray-100 active:bg-gray-300">
          <h2 className="mx-4 text-lg font-bold">Map</h2>
          <ChevronLeft size={20} />
        </div>

        <div className="flex h-full justify-between">
          <h2 className="text-lg font-bold">Total</h2>
          <h2 className="text-lg font-semibold">{TotalPrice.toFixed(2)}</h2>
        </div>

        {/* Note */}
        <div className="mt-8 grid grid-cols-2 grid-rows-6">
          <h1 className="col-span-1 row-span-1 text-lg font-bold">
            Note to Restaurant
          </h1>
          <div className="flex w-full justify-end">
            <div className="flex h-fit w-18 items-center justify-center gap-2 rounded-sm bg-slate-200 text-sm font-semibold">
              Optional
            </div>
          </div>
          <input
            type="text"
            onChange={(e) => {
              setRemark(e.target.value);
            }}
            className="focus:border-app-brown focus:ring-app-brown col-span-2 row-span-5 mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:ring-1 focus:outline-none"
            placeholder="E.g. No onions, extra spicy, etc."
          />
        </div>

        <button
          className="bg-app-yellow active:bg-app-bronze mt-8 w-full rounded-full p-4 text-center text-2xl font-bold text-white transition hover:bg-amber-500"
          onClick={() => {
            onSubmit(remark);
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

"use client"; // This is a client component due to useState

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderItem } from "@/types/order";

// A helper function to format numbers with commas
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export default function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  total,
}: OrderSummaryProps) {
  const [isDetailsVisible, setIsDetailsVisible] = useState(true);

  return (
    <Card className="h-full w-full rounded-2xl bg-white shadow-lg">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* --- Toggle Button --- */}
        <button
          onClick={() => setIsDetailsVisible(!isDetailsVisible)}
          className="text-muted-foreground flex w-full items-center justify-between text-sm"
        >
          <span>{isDetailsVisible ? "Hide" : "Show"} dishes detail</span>
          {isDetailsVisible ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {/* --- Scrollable Order List --- */}
        {isDetailsVisible && (
          <div className="mt-4 max-h-48 space-y-4 overflow-y-auto rounded-xl border p-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-4"
              >
                {/* Left side: Quantity, Name, Options */}
                <div className="flex-1">
                  <p className="font-semibold">
                    <span className="text-red-600">{item.quantity}x</span>{" "}
                    {item.name}
                  </p>
                  {item.mods.length > 0 && (
                    <p className="text-muted-foreground text-xs">
                      {item.mods.join(" ")}
                    </p>
                  )}
                </div>
                {/* Right side: Price */}
                <p className="font-semibold">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
        )}

        {/* --- Totals Section --- */}
        <div className="mt-6 space-y-2">
          <div className="text-muted-foreground flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="text-muted-foreground flex justify-between">
            <span>Delivery fee</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex items-baseline justify-between pt-2 text-2xl font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/CartProvider";

interface FloatingOrderButtonProps {
  restaurantId: string;
}

export function FloatingOrderButton({
  restaurantId,
}: FloatingOrderButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { getItemCount, getTotalPrice } = useCart();

  const itemCount = getItemCount();
  const totalPrice = getTotalPrice();

  // Check if current path is the order page
  const isOrderPage = pathname === `/menu/${restaurantId}/order`;

  const handleOrderClick = () => {
    router.push(`/menu/${restaurantId}/order`);
  };

  // Don't render the button on order page
  if (isOrderPage) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Button
        onClick={handleOrderClick}
        disabled={itemCount === 0}
        className="bg-app-yellow hover:bg-app-yellow/90 flex min-w-[200px] items-center gap-3 rounded-full px-6 py-3 shadow-lg transition-all duration-200"
      >
        <ShoppingCart className="h-5 w-5" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="text-xs">฿{totalPrice.toFixed(2)}</span>
        </div>
        <span className="font-bold">View Order</span>
      </Button>
    </div>
  );
}
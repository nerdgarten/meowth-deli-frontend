"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useCart } from "@/components/context/CartProvider";
import { OrderSummary } from "@/components/Main/OrderSummary";
import { getRestaurantById } from "@/libs/restaurant";

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams).catch(console.error);
  }, [params]);

  const { getCartItems, getTotalPrice } = useCart();

  const { data } = useQuery({
    queryKey: ["restaurant-info", resolvedParams?.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getRestaurantById(restaurantId);
    },
    enabled: !!resolvedParams?.id,
  });

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  const cartItem = getCartItems(resolvedParams.id);
  return (
    <main className="h-230 w-full overflow-auto p-16">
      <OrderSummary
        cartItem={cartItem}
        restaurantName={data?.name ?? ""}
        TotalPrice={getTotalPrice(resolvedParams.id)}
      />
    </main>
  );
}

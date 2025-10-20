"use client";

import { useMutation,useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useCart } from "@/components/context/CartProvider";
import { OrderSummary } from "@/components/Main/OrderSummary";
import { createOrder } from "@/libs/orders";
import { getRestaurantById } from "@/libs/restaurant";
import type { IOrderDish } from "@/types/order";

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  const { getCartItems, getTotalPrice } = useCart();

  // Resolve params once
  useEffect(() => {
    params.then(setResolvedParams).catch(console.error);
  }, [params]);

  // Hooks must be at top-level
  const restaurantQuery = useQuery({
    queryKey: ["restaurant-info", resolvedParams?.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getRestaurantById(restaurantId);
    },
    enabled: !!resolvedParams?.id, // conditionally run
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: {
      location: string;
      dishes: IOrderDish[];
      restaurant_id: number;
    }) => createOrder(orderData),
    onSuccess: (data) => {
      console.log("Order created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating order:", error);
    },
  });

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  const cartItem = getCartItems(resolvedParams.id);

  const onSubmit = () => {
    const sending: IOrderDish[] = cartItem.map((item) => ({
      dish_id: Number(item.dish.id),
      quantity: Number(item.quantity),
    }));

    createOrderMutation.mutate({
      location: "Home",
      dishes: sending,
      restaurant_id: Number(resolvedParams.id),
    });
  };

  return (
    <main className="h-230 w-full overflow-auto p-16">
      <OrderSummary
        cartItem={cartItem}
        restaurantName={restaurantQuery.data?.name ?? ""}
        TotalPrice={getTotalPrice(resolvedParams.id)}
        onSubmit={onSubmit}
      />
    </main>
  );
}

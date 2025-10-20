"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useCart } from "@/components/context/CartProvider";
import { SelectMenu } from "@/components/Main/SelectMenu";
import { getDishById } from "@/libs/dish";
import { getDishRestaurantId } from "@/libs/restaurant";
import type { IDish } from "@/types/dish";

export default function MenuPage({ params }: { params: Promise<{ id: string; menuId: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string; menuId: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams).catch(console.error);
  }, [params]);

  const { addToCart } = useCart();

  const addCart = (dish: IDish, quantity: number) => {
    if (!resolvedParams) return;
    addToCart(resolvedParams.id, dish, quantity);
    console.log("test");
  };

  const { data: dish } = useQuery({
    queryKey: ["dish", resolvedParams?.menuId],
    queryFn: ({ queryKey }) => {
      const [, dishId] = queryKey;
      if (!dishId) throw new Error("No dish ID provided");
      return getDishById(dishId);
    },
    enabled: !!resolvedParams?.menuId,
  });

  const { data: recommendations } = useQuery({
    queryKey: ["restaurant-dishes", resolvedParams?.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No restaurant ID provided");
      return getDishRestaurantId(restaurantId);
    },
    enabled: !!resolvedParams?.id,
  });

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  return (
    <main className="h-230 w-full overflow-auto p-16">
      <SelectMenu
        dish={dish!}
        recommendations={recommendations ?? []}
        addToCart={addCart}
      />
    </main>
  );
}

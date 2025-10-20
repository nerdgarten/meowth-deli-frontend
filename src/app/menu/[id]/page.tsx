"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { RestaurantList } from "@/components/Main/RestaurantList";
import { getDishRestaurantId, getRestaurantById } from "@/libs/restaurant";
import type { IDish } from "@/types/dish";

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams).catch(console.error);
  }, [params]);

  const router = useRouter();

  // Fetch restaurant info
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-info", resolvedParams?.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getRestaurantById(restaurantId);
    },
    enabled: !!resolvedParams?.id,
  });

  const { data: dishes } = useQuery({
    queryKey: ["restaurant-dishes", resolvedParams?.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getDishRestaurantId(restaurantId);
    },
    enabled: !!resolvedParams?.id,
  });

  const onDishClick = (dish: IDish) => {
    if (!resolvedParams) return;
    router.push(`/menu/${resolvedParams.id}/${dish.id}`);
  };

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  return (
    <main className="h-300 w-full overflow-auto p-16">
      <RestaurantList
        dishes={dishes ?? []}
        restaurant={restaurant?.name ?? ""}
        onDishClick={onDishClick}
      />
    </main>
  );
}

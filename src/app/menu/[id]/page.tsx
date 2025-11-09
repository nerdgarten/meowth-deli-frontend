"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

import { RestaurantList } from "@/components/Main/RestaurantList";
import { getDishRestaurantId, getRestaurantById } from "@/libs/restaurant";
import type { IDish } from "@/types/dish";
import { checkFavouriteRestaurant, getFavouriteDishesByRestaurant } from "@/libs/favourite";

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

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

  const { data: favourite_restaurant } = useQuery({
    queryKey: ["restaurant-favourite", resolvedParams?.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return checkFavouriteRestaurant(Number(restaurantId));
    },
    enabled: !!resolvedParams?.id,
  });
  const {data: favourite_dish} = useQuery({
    queryKey: ["restaurant-favourite-dish", resolvedParams?.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getFavouriteDishesByRestaurant(Number(restaurantId));
    }
    ,
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

  if (!resolvedParams || favourite_restaurant === undefined) {
    return (
      <Spinner className="text-app-brown mx-auto my-10" variant="circle" />
    );
  }

  return (
    <main className="h-300 w-full overflow-auto p-16">
      <RestaurantList
        dishes={dishes ?? []}
        favourite_dish={favourite_dish ?? []}
        restaurant={restaurant}
        onDishClick={onDishClick}
        favourite_restaurant={favourite_restaurant ?? false}
      />
    </main>
  );
}

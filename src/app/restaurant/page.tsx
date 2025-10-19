"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { RestaurantList } from "@/components/Main/RestaurantList";
import { IDish } from "@/types/dish";
import { getDishRestuarantId, getRestaurantById } from "@/libs/restaurant";
import { useQuery } from "@tanstack/react-query";

export default function RestaurantPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params?.get("id");

  // Fetch restaurant info
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-info", id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getRestaurantById(restaurantId as string);
    },
    enabled: !!id,
  });

  const { data: dishes } = useQuery({
    queryKey: ["restaurant-dishes", id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getDishRestuarantId(restaurantId as string);
    },
    enabled: !!id,
  });


  const onDishClick = (dish: IDish) => {
    router.push(`/restaurant/dish?id=${id}&dishid=${dish.id}`);
  };

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

"use client";

import { SelectMenu } from "@/components/Main/SelectMenu";
import { IDish } from "@/types/dish";
import { getDishById } from "@/libs/dish";
import { getDishRestuarantId } from "@/libs/restaurant";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/components/context/CartProvider";

export default function MenuPage({ params }: { params: { id: string; menuId: string } }) {
  const {addToCart} = useCart();
  

  const addCart = (dish:IDish, quantity:number) => {
    addToCart(params.id, dish, quantity);
    console.log("test")

  }

  const {
    data: dish,
    isLoading: dishLoading,
    isError: dishError,
  } = useQuery({
    queryKey: ["dish", params.menuId],
    queryFn: ({ queryKey }) => {
      const [, dishId] = queryKey;
      if (!dishId) throw new Error("No dish ID provided");
      return getDishById(dishId as string);
    },
    enabled: !! params.menuId,
  });

  const {
    data: recommendations,
  } = useQuery({
    queryKey: ["restaurant-dishes", params.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No restaurant ID provided");
      return getDishRestuarantId(restaurantId as string);
    },
    enabled: !!params.id,
  });

  // Handle loading

  return (
    <main className="h-230 w-full overflow-auto p-16">
      <SelectMenu
        dish={dish as IDish}
        recommendations={recommendations ?? []}
        addToCart={addCart}
      />
    </main>
  );
}

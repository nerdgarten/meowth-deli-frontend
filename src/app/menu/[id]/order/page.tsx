"use client";

import { OrderSummary } from "@/components/Main/OrderSummary";
import { useCart } from "@/components/context/CartProvider";
import { CartItem } from "@/types/order";
import { getRestaurantById } from "@/libs/restaurant";
import { useQuery } from "@tanstack/react-query";


export default function OrderPage({ params }: { params: { id: string }}) {
  const {getCartItems, getTotalPrice} = useCart();


  const { data } = useQuery({
    queryKey: ["restaurant-info", params.id],
    queryFn: ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getRestaurantById(restaurantId as string);
    },
    enabled: !!params.id,
  });

  const cartItem = getCartItems();
  return (
    <main className="h-230 w-full overflow-auto p-16">
      <OrderSummary
        cartItem={cartItem}
        restaurantName={data?.name ?? ""}
        TotalPrice={getTotalPrice()}
      />
    </main>
  );
}

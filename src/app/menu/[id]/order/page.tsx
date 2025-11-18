"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import { useCart } from "@/components/context/CartProvider";
import { OrderSummary } from "@/components/Main/OrderSummary";
import { getCustomerLocations } from "@/libs/location";
import { getDefaultCustomerLocation } from "@/libs/location";
import { createOrder } from "@/libs/orders";
import { getRestaurant } from "@/queries/restaurant";
import type { IOrderDish } from "@/types/order";

// Interface for storing order data in localStorage
interface StoredOrder {
  id: string;
  restaurantId: string;
  createdAt: string;
  totalAmount: number;
}

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const router = useRouter();

  const { getCartItems, getTotalPrice, clearCart } = useCart();

  // Resolve params once
  useEffect(() => {
    params.then(setResolvedParams).catch(console.error);
  }, [params]);

  // Query restaurant info
  const restaurantQuery = useQuery({
    queryKey: ["restaurant-info", resolvedParams?.id],
    queryFn: async ({ queryKey }) => {
      const [, restaurantId] = queryKey;
      if (!restaurantId) throw new Error("No id provided");
      return getRestaurant(Number(restaurantId));
    },
    enabled: !!resolvedParams?.id,
  });
  const { data: getLocation, isLoading: locationLoading } = useQuery({
    queryKey: ["location-info"],
    queryFn: async () => {
      return getCustomerLocations();
    },
  });
  const { data: defaultLocation, isLoading: defaultLocationLoading } = useQuery(
    {
      queryKey: ["default-location-info"],
      queryFn: async () => {
        return getDefaultCustomerLocation();
      },
    }
  );
  const locations = useMemo(() => {
    if (!Array.isArray(getLocation)) return [];
    const list = [...getLocation];
    const extractId = (loc: any) =>
      Number(loc?.id ?? loc?.delivery_location_id ?? loc?.location_id);
    const defId = extractId(defaultLocation);
    if (!defId) return list;
    const idx = list.findIndex((l) => extractId(l) === defId);
    if (idx > 0) {
      const [def] = list.splice(idx, 1);
      if (def) list.unshift(def);
    }
    return list ?? [];
  }, [getLocation, defaultLocation]);

  const createOrderMutation = useMutation({
    mutationFn: (orderData: {
      delivery_location_id: number;
      dishes: IOrderDish[];
      restaurant_id: number;
      driver_fee: number;
      remark: string;
    }) => createOrder(orderData),

    onSuccess: (data) => {
      console.log("Order created successfully:", data);

      const dataorder = data as { id?: number };

      if (resolvedParams && dataorder?.id) {
        // Store order ID in localStorage
        storeOrderInLocalStorage({
          id: dataorder.id.toString(),
          restaurantId: resolvedParams.id,
          createdAt: new Date().toISOString(),
          totalAmount: getTotalPrice(resolvedParams.id),
        });

        // Clear cart and redirect to success page
        // clearCart(resolvedParams.id);
      }
    },

    onError: (error: unknown) => {
      console.error("Error creating order:", error);
    },
  });

  // Safely get and set localStorage data
  const storeOrderInLocalStorage = (order: StoredOrder): void => {
    try {
      const raw = localStorage.getItem("meowth-orders");
      const existingOrders: StoredOrder[] = raw
        ? (JSON.parse(raw) as StoredOrder[])
        : [];

      // Add new order to beginning of array
      const updatedOrders: StoredOrder[] = [order, ...existingOrders];

      // Keep last 10 orders
      const trimmedOrders = updatedOrders.slice(0, 10);

      localStorage.setItem("meowth-orders", JSON.stringify(trimmedOrders));

      console.log("Order stored in localStorage:", order.id);
    } catch (error) {
      console.error("Error storing order in localStorage:", error);
    }
  };

  const getStoredOrders = (): StoredOrder[] => {
    try {
      const raw = localStorage.getItem("meowth-orders");
      return raw ? (JSON.parse(raw) as StoredOrder[]) : [];
    } catch (error) {
      console.error("Error retrieving orders from localStorage:", error);
      return [];
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getLatestOrderForRestaurant = (
    restaurantId: string
  ): StoredOrder | null => {
    const orders = getStoredOrders();
    return orders.find((order) => order.restaurantId === restaurantId) ?? null;
  };

  if (
    !resolvedParams ||
    restaurantQuery.isLoading ||
    locationLoading ||
    defaultLocationLoading
  ) {
    return <div>Loading...</div>;
  }

  const cartItem = getCartItems(resolvedParams.id);

  const onSubmit = async (
    remark: string,
    selectedIndex: string
  ): Promise<void> => {
    if (cartItem.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const sending: IOrderDish[] = cartItem.map((item) => ({
      dish_id: Number(item.dish.id),
      quantity: Number(item.quantity),
    }));

    try {
      await createOrderMutation.mutateAsync({
        delivery_location_id: selectedIndex
          ? (locations[Number(selectedIndex)]?.id ?? 0)
          : 0,
        dishes: sending,
        restaurant_id: Number(resolvedParams.id),
        driver_fee: 30,
        remark: remark,
      });

      clearCart(resolvedParams.id);
      router.push(`/menu/${resolvedParams.id}/success`);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <main className="h-230 w-full p-16">
      <OrderSummary
        location={locations ?? []}
        cartItem={cartItem}
        restaurant={restaurantQuery.data!}
        TotalPrice={getTotalPrice(resolvedParams.id)}
        onSubmit={onSubmit}
      />
    </main>
  );
}

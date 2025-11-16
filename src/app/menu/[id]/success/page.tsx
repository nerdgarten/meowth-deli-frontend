"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { CheckCircle, Clock, Star, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById } from "@/libs/orders";
import { getRestaurantById } from "@/libs/restaurant";
import type { IOrder, StoredOrder } from "@/types/order"; // ensure Restaurant type exists
import type { IRestaurant } from "@/types/restaurant";

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;

  const [latestOrder, setLatestOrder] = useState<StoredOrder | null>(null);

  // ✅ Properly typed restaurant query
  const restaurantQuery: UseQueryResult<IRestaurant, Error> = useQuery({
    queryKey: ["restaurant-info", restaurantId],
    queryFn: async ({ queryKey }): Promise<IRestaurant> => {
      const [, id] = queryKey;
      if (!id) throw new Error("No restaurant ID provided");
      const data = await getRestaurantById(id);
      return data;
    },
    enabled: !!restaurantId,
  });

  const restaurant: IRestaurant | undefined = restaurantQuery.data;

  // ✅ Load latest order from localStorage
  useEffect(() => {
    try {
      const rawOrders = localStorage.getItem("meowth-orders");
      const orders: StoredOrder[] = rawOrders
        ? (JSON.parse(rawOrders) as StoredOrder[])
        : [];

      const order = orders.find((o) => o.restaurantId === restaurantId) ?? null;
      setLatestOrder(order);
    } catch (error) {
      console.error("Error retrieving order from localStorage:", error);
      setLatestOrder(null);
    }
  }, [restaurantId]);

  // ✅ Strongly type order query
  const orderQuery: UseQueryResult<IOrder, Error> = useQuery<IOrder, Error>({
    queryKey: ["order", latestOrder?.id],
    queryFn: async ({ queryKey }): Promise<IOrder> => {
      const [, id] = queryKey;
      if (!id) throw new Error("No order ID provided");
      const data = await getOrderById(Number(id));
      return data;
    },
    enabled: !!latestOrder?.id,
  });

  const order: IOrder | undefined = orderQuery.data;

  // --- Button handlers ---
  const handleCheckStatus = () => {
    if (latestOrder) {
      router.push(`/order/${latestOrder.id}`);
    } else {
      alert("Order information not found. Please try again.");
    }
  };

  const handleLeaveReview = () => {
    router.push(`/restaurant/${restaurantId}`);
  };

  const handleBackToMenu = () => {
    router.push(`/`);
  };

  // --- UI ---
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* ✅ Success Header */}
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Order Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. Your food is being prepared.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Order ID:</span>
                <p>{latestOrder?.id ?? "Loading..."}</p>
              </div>
              <div>
                <span className="font-semibold">Restaurant:</span>
                <p>{restaurant?.name ?? "Loading..."}</p>
              </div>
              <div>
                <span className="font-semibold">Estimated Delivery:</span>
                <p>30–45 minutes</p>
              </div>
              <div>
                <span className="font-semibold">Total Amount:</span>
                <p className="font-bold">
                  {order && typeof order.total_amount === "number"
                    ? `฿${order.total_amount.toFixed(2)}`
                    : "Loading..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Button
            onClick={handleCheckStatus}
            variant="outline"
            disabled={!latestOrder}
            className="flex items-center gap-2"
          >
            <Truck className="h-4 w-4" />
            Check Status
          </Button>

          <Button
            onClick={handleLeaveReview}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
          >
            <Star className="h-4 w-4" />
            Leave Review
          </Button>

          <Button onClick={handleBackToMenu} variant="outline">
            Back to Menu
          </Button>
        </div>
      </div>
    </main>
  );
}

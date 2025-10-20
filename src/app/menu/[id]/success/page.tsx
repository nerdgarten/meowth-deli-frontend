"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Star, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRestaurantById } from "@/libs/restaurant";
import type { StoredOrder } from "@/types/order";

export default function OrderSuccessPage() {
  const router = useRouter();
  const resolvedParams = useParams();
  const restaurantId = resolvedParams.id as string;

  const [latestOrder, setLatestOrder] = useState<StoredOrder | null>(null);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-info", restaurantId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      if (!id) throw new Error("No restaurant ID provided");
      return await getRestaurantById(id);
    },
    enabled: !!restaurantId,
  });

  // Get the latest order from localStorage
  useEffect(() => {
    const getLatestOrder = () => {
      try {
        const rawOrders = localStorage.getItem("meowth-orders");

        // ✅ Explicitly type the parsed value to StoredOrder[]
        const orders: StoredOrder[] = rawOrders
          ? (JSON.parse(rawOrders) as StoredOrder[])
          : [];

        const order =
          orders.find((o: StoredOrder) => o.restaurantId === restaurantId) ??
          null;

        setLatestOrder(order);
      } catch (error) {
        console.error("Error retrieving order from localStorage:", error);
        setLatestOrder(null);
      }
    };

    getLatestOrder();
  }, [restaurantId]);


  const handleCheckStatus = () => {
    if (latestOrder) {
      router.push(`/order/${latestOrder.id}`);
    } else {
      alert("Order information not found. Please try again.");
    }
  };

  const handleLeaveReview = () => {
    router.push(`/restaurant/${restaurantId}/review`);
  };

  const handleBackToMenu = () => {
    router.push(`/menu/${restaurantId}`);
  };

  // Mock order items (you might want to replace this with real data later)
  const mockOrderItems = [
    { name: "Pad Thai", quantity: 2, price: 120 },
    { name: "Tom Yum Soup", quantity: 1, price: 90 },
    { name: "Spring Rolls", quantity: 1, price: 60 },
  ];

  const totalAmount =
    latestOrder?.totalAmount ??
    mockOrderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Order Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. Your food is being prepared.
          </p>
        </div>

        {/* Order Summary Card */}
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
                <p>30-45 minutes</p>
              </div>
              <div>
                <span className="font-semibold">Total Amount:</span>
                <p className="font-bold">฿{totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="mb-2 font-semibold">Order Items:</h3>
              <div className="space-y-2">
                {mockOrderItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>฿{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
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

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bike,
  ChefHat,
  ClipboardList,
  Plus,
  ReceiptText,
  Star,
  Store,
  User,
} from "lucide-react";
import React, { useState } from "react";

import AddressSection from "@/components/Order/AddressSection";
import HeroSection from "@/components/Order/HeroSection";
import OrderSummary from "@/components/Order/OrderSummary";
import PaymentStatus from "@/components/Order/PaymentStatus";
import ReviewModal from "@/components/Review/ReviewModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type IOrderDetails, queryOrderById } from "@/queries/order";
import type { StatusTimeline } from "@/types/order";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const StatusCard = ({
  icon,
  title,
  time,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
  status?: "Complete" | "In Progress";
}) => {
  const isComplete = status === "Complete";
  const isInProgress = status === "In Progress";

  return (
    <Card className="rounded-2xl bg-white shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <div
            className={`rounded-full p-2 ${
              isComplete || isInProgress
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        {status && (
          <Badge
            className={`mt-3 text-xs font-semibold ${
              isComplete
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {status}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default function OrderPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const orderId = unwrappedParams.id;
  const showReview = true;

  // Modal states - must be declared before any early returns
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);

  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery<IOrderDetails>({
    queryKey: ["order", orderId],
    queryFn: async () => queryOrderById(orderId),
  });

  if (isLoading) {
    return (
      <main className="mt-16 flex h-screen items-center justify-center bg-[#F9F7F3]">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (isError || !orderData) {
    return (
      <main className="mt-16 flex h-screen items-center justify-center bg-[#F9F7F3]">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">
            Failed to load order details
          </p>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </main>
    );
  }

  // Transform API data to component-friendly format
  const driverName = orderData.driver
    ? `${orderData.driver.firstname} ${orderData.driver.lastname}`
    : undefined;

  // Map status to timeline - handles all backend status values: pending, preparing, delivered, rejected, success
  const getStatusTimeline = (): StatusTimeline[] => {
    // Handle rejected status separately
    if (orderData.status === "rejected") {
      return [
        {
          icon: <ClipboardList size={20} />,
          title: "Order Rejected",
          time: new Date(orderData.created_at).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: "Complete",
        },
      ];
    }

    const baseTimeline: StatusTimeline[] = [
      {
        icon: <ClipboardList size={20} />,
        title: "Order Received",
        time: new Date(orderData.created_at).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: orderData.status === "pending" ? "In Progress" : "Complete",
      },
    ];

    if (
      orderData.status === "preparing" ||
      orderData.status === "delivered" ||
      orderData.status === "success"
    ) {
      baseTimeline.push({
        icon: <ChefHat size={20} />,
        title: "In Kitchen",
        time: new Date(orderData.created_at).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: orderData.status === "preparing" ? "In Progress" : "Complete",
      });
    }

    if (orderData.status === "delivered" || orderData.status === "success") {
      baseTimeline.push({
        icon: <Bike size={20} />,
        title: "Delivering",
        time: new Date(orderData.created_at).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: orderData.status === "delivered" ? "In Progress" : "Complete",
      });
    }

    return baseTimeline;
  };

  // Transform order dishes to items
  const orderItems = orderData.orderDishes.map((orderDish) => ({
    quantity: orderDish.amount,
    name: orderDish.dish.name,
    mods: orderDish.remark ? [orderDish.remark] : [],
    price: orderDish.dish.price,
  }));

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = orderData.driver_fee;
  const total = orderData.total_amount;

  // Hero message based on order status
  const heroMessage =
    orderData.status === "success"
      ? `Your food from ${orderData.restaurant.name} has arrived!`
      : orderData.status === "delivered"
        ? `Your food from ${orderData.restaurant.name} is on the way!`
        : orderData.status === "preparing"
          ? `Your order from ${orderData.restaurant.name} is being prepared!`
          : orderData.status === "rejected"
            ? `Sorry, your order from ${orderData.restaurant.name} was rejected.`
            : `Your order from ${orderData.restaurant.name} has been received!`;

  return (
    <main className="min-h-screen bg-[#F9F7F3] p-4 pt-20 pb-20 sm:p-6 sm:pt-24 lg:p-8 lg:pt-24">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Hero Section - Left, Row 1, Col 1-3 */}
          <div className="lg:col-span-3 lg:row-start-1">
            <HeroSection message={heroMessage} reportLink="#" />
          </div>

          {/* Address - Right, Row 1, Col 4 */}
          <div className="lg:col-span-1 lg:row-start-1">
            <AddressSection
              address={orderData.location.address}
              driverNote={orderData.remark ?? "No special instructions"}
              onEditNote={() => {
                // Handle edit note - could open a modal or navigate
                console.log("Edit note clicked");
              }}
            />
          </div>

          {/* Payment - Right, Row 1, Col 5 */}
          <div className="lg:col-span-1 lg:row-start-1">
            <PaymentStatus
              method="meowth-wallet"
              status={
                orderData.status === "success" ? "Paid" : "Payment Waiting"
              }
              walletBalance={20.0}
            />
          </div>

          {/* Status Timeline - Left, Row 2, Col 1-3 */}
          <div className="lg:col-span-3 lg:row-start-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {getStatusTimeline().map((status, index) => (
                <StatusCard key={index} {...status} />
              ))}
            </div>
          </div>

          {/* Order Summary - Right, Row 2-4, Col 4-5 */}
          <div className="lg:col-span-2 lg:col-start-4 lg:row-span-3 lg:row-start-2 lg:self-start">
            <div className="lg:sticky lg:top-28">
            <OrderSummary
              items={orderItems}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
            />
            </div>
          </div>

          {/* Order Details - Left, Row 3, Col 1-3 */}
          <div className="lg:col-span-3 lg:row-start-3">
            <Card className="rounded-2xl bg-white shadow-lg">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-2">
                <div className="flex items-center space-x-4">
                  <ReceiptText className="text-gray-500" />
                  <span className="w-24 font-medium text-gray-600">
                    Order ID
                  </span>
                  <span className="font-mono text-gray-800">{orderId}</span>
                </div>
                {driverName && (
                  <div className="flex items-center space-x-4">
                    <User className="text-gray-500" />
                    <span className="w-24 font-medium text-gray-600">
                      Driver
                    </span>
                    <span className="text-gray-800">{driverName}</span>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <Store className="text-gray-500" />
                  <span className="w-24 font-medium text-gray-600">
                    Restaurant
                  </span>
                  <span className="text-gray-800">
                    {orderData.restaurant.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review Sections - Outside grid to prevent overlap */}
        {showReview && (
          <div className="mt-8 space-y-8">
            {/* Driver Review Section */}
            {orderData.driver && (
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                      <Star size={24} className="text-blue-500" />
                      Rate Your Driver
                    </h2>
                    <p className="text-gray-600">
                      Share your experience with {driverName} who delivered your
                      order.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDriverModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-600"
                  >
                    <Plus size={20} />
                    Add Review
                  </button>
                </div>
              </div>
            )}

            {/* Restaurant Review Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Star size={24} className="text-yellow-500" />
                    Rate Your Restaurant
                  </h2>
                  <p className="text-gray-600">
                    Share your experience with {orderData.restaurant.name} that
                    prepared your order.
                  </p>
                </div>
                <button
                  onClick={() => setIsRestaurantModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-medium whitespace-nowrap text-white transition-colors hover:bg-yellow-600"
                >
                  <Plus size={20} />
                  Add Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Driver Review Modal */}
        {orderData.driver && orderData.driver_id && (
          <ReviewModal
            isOpen={isDriverModalOpen}
            onClose={() => setIsDriverModalOpen(false)}
            type="driver"
            id={orderData.driver_id}
            orderId={orderData.id}
            title="Review Your Driver"
            description={`Share your experience with ${driverName} to help improve our service.`}
          />
        )}

        {/* Restaurant Review Modal */}
        <ReviewModal
          isOpen={isRestaurantModalOpen}
          onClose={() => setIsRestaurantModalOpen(false)}
          type="restaurant"
          id={orderData.restaurant_id}
          orderId={orderData.id}
          title="Review Your Restaurant"
          description={`Share your experience with ${orderData.restaurant.name} to help other customers.`}
        />
      </div>
    </main>
  );
}

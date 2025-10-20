"use client";

import { Plus, Star } from "lucide-react";
import React, { useState } from "react";

import ReviewModal from "@/components/Review/ReviewModal";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const orderId = parseInt(unwrappedParams.id, 10);

  // For demo purposes, using hardcoded IDs
  // In a real app, you'd fetch order details to get driverId and restaurantId
  const driverId = 1002; // Example driver ID
  const restaurantId = 1231; // Example restaurant ID

  // Modal states
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);

  return (
    <div className="container mx-auto mt-20 p-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Review Your Order
        </h1>
        <p className="text-gray-600">Order #{orderId}</p>
      </div>

      <div className="space-y-8">
        {/* Driver Review Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Star size={24} className="text-blue-500" />
                Rate Your Driver
              </h2>
              <p className="text-gray-600">
                Share your experience with the driver who delivered your order.
              </p>
            </div>
            <button
              onClick={() => setIsDriverModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
            >
              <Plus size={20} />
              Add Review
            </button>
          </div>
        </div>

        {/* Restaurant Review Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Star size={24} className="text-yellow-500" />
                Rate Your Restaurant
              </h2>
              <p className="text-gray-600">
                Share your experience with the restaurant that prepared your
                order.
              </p>
            </div>
            <button
              onClick={() => setIsRestaurantModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-600"
            >
              <Plus size={20} />
              Add Review
            </button>
          </div>
        </div>
      </div>

      {/* Driver Review Modal */}
      <ReviewModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        type="driver"
        id={driverId}
        orderId={orderId}
        title="Review Your Driver"
        description="Share your experience with the driver to help improve our service."
      />

      {/* Restaurant Review Modal */}
      <ReviewModal
        isOpen={isRestaurantModalOpen}
        onClose={() => setIsRestaurantModalOpen(false)}
        type="restaurant"
        id={restaurantId}
        orderId={orderId}
        title="Review Your Restaurant"
        description="Share your experience with the restaurant to help other customers."
      />
    </div>
  );
}

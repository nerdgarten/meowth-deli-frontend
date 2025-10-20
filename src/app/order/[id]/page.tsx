"use client";

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
import OrderSummary from "@/components/Order/OrderSummary";
import PaymentStatus from "@/components/Order/PaymentStatus";
import ReviewModal from "@/components/Review/ReviewModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderDetails, StatusTimeline } from "@/types/order";

import HeroSection from "../../../components/Order/HeroSection";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper component for the order status timeline
const StatusCard = ({ icon, title, time, status }: StatusTimeline) => {
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
  const orderId = parseInt(unwrappedParams.id, 10);
  const showReview = false;

  // Mock order data - in a real app, fetch from API
  const orderData: OrderDetails = {
    id: orderId.toString().padStart(16, "0"),
    driver: {
      name: "สมชาย ปายเที่ยวกัน",
    },
    restaurant: {
      name: "ร้านยายอ่อย ป่อยป่อยป้อย ป้อป่อยป้อย",
    },
    address:
      "ตึก 20 ชั้น 4 123/345, Chula 18, Pathum Wan, ตึก 20 ชั้น 4 123/345, Chula 18, Pathum Wan",
    note: "กรุณามาส่งที่ตึกเดียวกัน ตึกมิ้ก ตึกมิ้ก ตึกมิ้กหิวแล้ว กรุณาส่งไวๆ ตึกมิ้ก ตึกมิ้กหิวแล้ว...",
    payment: {
      method: "meowth-wallet",
      status: "Payment Waiting",
      walletBalance: 20.0,
    },
    items: [
      {
        quantity: 2,
        name: "กะเพราหมูกรอบไข่ดาว พิเศษใส่หอมใหญ่",
        mods: ["ไม่เผ็ด", "ไม่ปอก"],
        price: 12.0,
      },
      {
        quantity: 999,
        name: "กะเพราหมูกรอบไข่ดาว พิเศษใส่หอมใหญ่",
        mods: [
          "ใส่เส้นบะลูร์กะ",
          "กะเพราหมูกรอบไข่ดาว",
          "พิเศษใส่หอมใหญ่",
          "ไม่เผ็ด",
          "ไม่ปอก",
          "ไม่จ่าย",
        ],
        price: 99999.0,
      },
      {
        quantity: 2,
        name: "กะเพราหมูกรอบไข่ดาว พิเศษใส่หอมใหญ่",
        mods: ["ไม่จ่าย"],
        price: 12.0,
      },
    ],
    subtotal: 9999999.0,
    deliveryFee: 2.0,
    total: 1234567890.0,
    statusTimeline: [
      {
        icon: <ClipboardList size={20} />,
        title: "Order Received",
        time: "13:40 PM 17 Oct 2025",
        status: "Complete",
      },
      {
        icon: <ChefHat size={20} />,
        title: "In Kitchen",
        time: "13:40 PM 17 Oct 2025",
        status: "Complete",
      },
      {
        icon: <Bike size={20} />,
        title: "Delivering",
        time: "13:40 PM 17 Oct 2025",
        status: "In Progress",
      },
    ],
    heroMessage: "Your food from ร้านยายอ่อย has arrived!",
    reportLink: "#",
  };

  // For demo purposes, using hardcoded IDs
  // In a real app, get from orderData
  const driverId = 1002;
  const restaurantId = 1231;

  // Modal states
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);

  return (
    <main className="mt-16 h-screen overflow-auto bg-[#F9F7F3] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid h-full grid-cols-1 gap-4 lg:auto-rows-min lg:grid-cols-5">
        {/* Hero Section - Left, Row 1, Col 1-3 */}
        <div className="h-full lg:col-span-3 lg:col-start-1 lg:row-span-1 lg:row-start-1">
          <HeroSection
            message={orderData.heroMessage}
            reportLink={orderData.reportLink}
          />
        </div>

        {/* Address - Right, Row 1, Col 4 */}
        <div className="h-full lg:col-span-1 lg:col-start-4 lg:row-span-1 lg:row-start-1">
          <AddressSection
            address={orderData.address}
            driverNote={orderData.note}
            onEditNote={() => {
              // Handle edit note - could open a modal or navigate
              console.log("Edit note clicked");
            }}
          />
        </div>

        {/* Payment - Right, Row 1, Col 5 */}
        <div className="h-full lg:col-span-1 lg:col-start-5 lg:row-span-1 lg:row-start-1">
          <PaymentStatus
            method={orderData.payment.method}
            status={orderData.payment.status}
            walletBalance={orderData.payment.walletBalance}
          />
        </div>

        {/* Status Timeline - Left, Row 2, Col 1-3 */}
        <div className="rounded-2xl lg:col-span-3 lg:col-start-1 lg:row-span-1 lg:row-start-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {orderData.statusTimeline.map((status, index) => (
              <StatusCard key={index} {...status} />
            ))}
          </div>
        </div>

        {/* Order Details - Left, Row 3, Col 1-3 */}
        <div className="lg:col-span-3 lg:col-start-1 lg:row-span-1 lg:row-start-3">
          <Card className="rounded-2xl bg-white shadow-lg">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-2">
              <div className="flex items-center space-x-4">
                <ReceiptText className="text-gray-500" />
                <span className="w-24 font-medium text-gray-600">Order ID</span>
                <span className="font-mono text-gray-800">{orderData.id}</span>
              </div>
              {orderData.driver && (
                <div className="flex items-center space-x-4">
                  <User className="text-gray-500" />
                  <span className="w-24 font-medium text-gray-600">Driver</span>
                  <span className="text-gray-800">{orderData.driver.name}</span>
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

        {/* Order Summary - Right, Row 2-4, Col 4-5 */}
        <div className="lg:col-span-2 lg:col-start-4 lg:row-span-3 lg:row-start-2">
          <OrderSummary
            items={orderData.items}
            subtotal={orderData.subtotal}
            deliveryFee={orderData.deliveryFee}
            total={orderData.total}
          />
        </div>
      </div>

      {showReview && (
        <>
          {/* Review Sections - Below the grid */}
          <div className="mx-auto mt-8 space-y-8">
            {/* Driver Review Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Star size={24} className="text-blue-500" />
                    Rate Your Driver
                  </h2>
                  <p className="text-gray-600">
                    Share your experience with the driver who delivered your
                    order.
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
        </>
      )}
    </main>
  );
}

"use client";
import OnboardingCard from "@/components/Onboarding/OnboardingCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

// Page for simulate onboarding after registration complete, will be removed later

export default function TemporaryPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [contents, setContents] = useState<any[]>([]);
  const restaurantContents = [
    {
      heading: "Registration Complete",
      descriptions: [{ text: "Welcome aboard! 🎉 Your account is ready." }],
      imageSrc: "/images/meowth-eating.webp",
    },
    {
      heading: "Setup Shop",
      descriptions: [
        {
          text: "Add your menu, description, and business hours to start receiving orders.",
        },
      ],
      imageSrc: "/images/meowth-cooking.webp",
    },
    {
      heading: "Dashboard",
      descriptions: [
        {
          text: "Track orders, view sales, and manage your restaurant all in one place.",
        },
      ],
      imageSrc: "/images/meowth-eating.webp",
    },
    {
      heading: "Farewell",
      descriptions: [{ text: "We wish you many happy customers! 🛎️" }],
      imageSrc: "/images/meowth-driving.webp",
    },
  ];
  const customerContents = [
    {
      heading: "Registration Complete",
      descriptions: [{ text: "Welcome Partner! 🎉 Your account is ready." }],
      imageSrc: "/images/meowth-eating.webp",
    },
    {
      heading: "How to Order",
      descriptions: [
        {
          text: "Browse restaurants, pick your meal, and order in just a few taps.",
        },
      ],
      imageSrc: "/images/meowth-cooking.webp",
    },
    {
      heading: "How to Review & Report",
      descriptions: [
        {
          text: "Leave reviews to share your experience, or report issues to help us improve.",
        },
      ],
      imageSrc: "/images/meowth-eating.webp",
    },
    {
      heading: "Farewell",
      descriptions: [{ text: "We wish you a happy meal! 🍴" }],
      imageSrc: "/images/meowth-driving.webp",
    },
  ];
  const driverContents = [
    {
      heading: "Registration Complete",
      descriptions: [{ text: "Welcome, Driver! 🎉 Your account is ready." }],
      imageSrc: "/images/meowth-eating.webp",
    },
    {
      heading: "How to Accept Orders",
      descriptions: [
        {
          text: "Get notified of new deliveries, accept them in one tap, and follow the route.",
        },
      ],
      imageSrc: "/images/meowth-cooking.webp",
    },
    {
      heading: "Earnings & Dashboard",
      descriptions: [
        {
          text: "Track your completed deliveries, daily earnings, and bonuses easily.",
        },
      ],
      imageSrc: "/images/meowth-eating.webp",
    },
    {
      heading: "Farewell",
      descriptions: [{ text: "Ride safe and happy delivering! 🚚💨" }],
      imageSrc: "/images/meowth-driving.webp",
    },
  ];
  return (
    <main className="bg-app-background">
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <h2>will replace meowth images with real web page images later</h2>
        <Button
          onClick={() => {
            setIsOnboardingOpen(true);
            setContents(restaurantContents);
          }}
        >
          onboarding for restaurant
        </Button>
        <Button
          onClick={() => {
            setIsOnboardingOpen(true);
            setContents(customerContents);
          }}
        >
          onboarding for customer
        </Button>
        <Button
          onClick={() => {
            setIsOnboardingOpen(true);
            setContents(driverContents);
          }}
        >
          onboarding for driver
        </Button>
        <h2>waiting for restaurant profile page</h2>
        <Link href="/tmp/dashboard">
          <Button>Restaurant Dashboard</Button>
        </Link>
      </div>
      <OnboardingCard
        contents={contents}
        isOnboardingOpen={isOnboardingOpen}
        setIsOnboardingOpen={setIsOnboardingOpen}
      />
    </main>
  );
}

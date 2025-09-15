'use client';
import OnboardingCard from "@/components/Onboarding/OnboardingCard";
import { useState } from "react";

export default function RegisterLanding() {
    const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(true);

  return (
    <main className="bg-app-background">
      <OnboardingCard
        contents={[
          {heading: "Registration Complete", descriptions: [{text: "Welcome aboard! 🎉 Your account is ready."}], imageSrc: "/images/meowth-eating.webp"},
          {heading: "Setup Shop", descriptions: [{text: "Add your menu, description, and business hours to start receiving orders."}], imageSrc: "/images/meowth-cooking.webp"},
          {heading: "Dashboard", descriptions: [{text: "Track orders, view sales, and manage your restaurant all in one place."}], imageSrc: "/images/meowth-eating.webp"},
          {heading: "Farewell", descriptions: [{text: "We wish you many happy customers! 🛎️"}], imageSrc: "/images/meowth-driving.webp"},
        ]}
        isOnboardingOpen={isOnboardingOpen}
        setIsOnboardingOpen={setIsOnboardingOpen}
      />
    </main>
  );
}



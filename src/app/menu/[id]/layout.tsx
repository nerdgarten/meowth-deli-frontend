"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { FloatingOrderButton } from "@/components/common/FloatingOrderButton";

interface MenuPageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function RestaurantLayout({ children, params }: MenuPageLayoutProps) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => setRestaurantId(id)).catch(console.error);
  }, [params]);

  const pathname = usePathname();
  const isOrderPage = restaurantId ? pathname === `/menu/${restaurantId}/order` : false;

  if (!restaurantId) {
    return <div>Loading...</div>; // or some loading state
  }

  return (
    // push content below fixed nav + lock the page to one viewport
    <div className="bg-app-background pt-16" style={{ height: "100dvh" }}>
      {!isOrderPage && <FloatingOrderButton restaurantId={restaurantId} />}
      {children}
    </div>
  );
}

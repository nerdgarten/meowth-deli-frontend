"use client"
import { FloatingOrderButton } from "@/components/common/FloatingOrderButton";
import { usePathname } from "next/navigation";

interface MenuPageLayoutProps {
  children: React.ReactNode;
  restaurantId: {id: string};
}

export default function RestaurantLayout({ children, params }: MenuPageLayoutProps) {
  const restaurantId = params.id;
  const pathname = usePathname();
  const isOrderPage = pathname === `/menu/${restaurantId}/order`;
  return (
    // push content below fixed nav + lock the page to one viewport
    <div className="bg-app-background pt-16" style={{ height: "100dvh" }}>
      {!isOrderPage && <FloatingOrderButton restaurantId={restaurantId} />}
      {children}
    </div>
  );
}

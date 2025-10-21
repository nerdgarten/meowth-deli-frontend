"use client";

import { Home, ShoppingBag, Star } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/libs/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors",
        isActive
          ? "bg-app-bronze text-white"
          : "text-app-dark-brown hover:bg-app-tan/30"
      )}
    >
      <div className="h-5 w-5">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default function RestaurantSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      path: "/restaurant/management",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Orders",
      path: "/restaurant/management/orders",
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: "Reviews",
      path: "/restaurant/management/reviews",
    },
  ];

  return (
    <aside className="bg-app-background border-app-tan/30 fixed top-0 left-0 flex h-screen w-[290px] flex-col border-r pt-20">
      {/* Logo Section */}
      <div className="px-6 py-8">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 h-32 w-32">
            <img
              src="/images/meowth-cooking.webp"
              alt="Meowth Delivery Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-app-dark-brown text-center text-2xl font-bold">
            Meowth Delivery
          </h1>
          <p className="text-app-brown mt-1 text-sm">Restaurant Dashboard</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.path}
              onClick={() => router.push(item.path)}
            />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-app-tan/30 mt-auto border-t px-6 py-6">
        <p className="text-app-dark-brown text-xs font-medium">
          Meowth Delivery Restaurant Dashboard
        </p>
        <p className="text-app-brown mt-1 text-xs">
          ©2025 All Rights Reserved
        </p>
      </div>
    </aside>
  );
}

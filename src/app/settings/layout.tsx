"use client";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  User,
} from "lucide-react";

import { useAuth } from "@/components/context/AuthContext";
import { SettingFloatPanelProvider } from "@/components/Setting/SettingFloatPanelProvider";
import {
  SettingNavigationMenu,
  type SettingNavItem,
} from "@/components/Setting/SettingNavigationMenu";
import { authenticatedAs } from "@/libs/authentication";

const basePath = "/settings";

const customer_items: SettingNavItem[] = [
  {
    key: "profile",
    label: "Profile",
    href: `${basePath}/profile`,
    icon: User,
  },
  {
    key: "addresses",
    label: "Addresses",
    href: `${basePath}/addresses`,
    icon: MapPin,
  },
  {
    key: "preferences",
    label: "Preferences",
    href: `${basePath}/preferences`,
    icon: Settings,
  },
  {
    key: "security",
    label: "Security",
    href: `${basePath}/security`,
    icon: ShieldCheck,
  },
  // {
  //   key: "orders",
  //   label: "Orders",
  //   href: `${basePath}/orders`,
  //   icon: ShoppingBag,
  // },
];
const restaurant_items: SettingNavItem[] = [
  {
    key: "profile",
    label: "Profile",
    href: `${basePath}/profile`,
    icon: User,
  },
  {
    key: "addresses",
    label: "Addresses",
    href: `${basePath}/addresses`,
    icon: MapPin,
  },
  {
    key: "security",
    label: "Security",
    href: `${basePath}/security`,
    icon: ShieldCheck,
  },
];

const driver_items: SettingNavItem[] = [
  {
    key: "profile",
    label: "Profile",
    href: `${basePath}/profile`,
    icon: User,
  },
  {
    key: "security",
    label: "Security",
    href: `${basePath}/security`,
    icon: ShieldCheck,
  },
  {
    key: "vehicle",
    label: "Vehicle",
    href: `${basePath}/vehicle`,
    icon: MapPin,
  },
];

export default function CustomerSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <main className="bg-app-background flex h-full flex-col pt-[6rem]">
      <div className="flex w-full flex-col p-4">
        <div className="flex flex-col items-center justify-center">
          <SettingFloatPanelProvider>
            <SettingNavigationMenu
              items={
                role === "restaurant"
                  ? restaurant_items
                  : role === "driver"
                    ? driver_items
                    : customer_items
              }
              role={role || "customer"}
            >
              <div className="w-full">{children}</div>
            </SettingNavigationMenu>
          </SettingFloatPanelProvider>
        </div>
      </div>
    </main>
  );
}

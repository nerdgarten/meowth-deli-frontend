"use client";

import {
  SettingNavigationMenu,
  type SettingNavItem,
} from "@/components/Setting/SettingNavigationMenu";
import {
  MapPin,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  User,
} from "lucide-react";

const basePath = "/settings/restaurant";

const items: SettingNavItem[] = [
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
    icon: SlidersHorizontal,
  },
  {
    key: "security",
    label: "Security",
    href: `${basePath}/security`,
    icon: ShieldCheck,
  },
  {
    key: "orders",
    label: "Orders",
    href: `${basePath}/orders`,
    icon: ShoppingBag,
  },
];

export default function RestaurantSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-app-background flex h-full flex-col items-center pt-[4rem]">
      <div className="flex flex-col items-center justify-center gap-32 p-4">
        <SettingNavigationMenu items={items} />
        {children}
      </div>
    </main>
  );
}

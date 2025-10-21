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

const basePath = "/settings";

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
  // {
  //   key: "preferences",
  //   label: "Preferences",
  //   href: `${basePath}/preferences`,
  //   icon: SlidersHorizontal,
  // },
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

export default function CustomerSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-app-background flex h-full flex-col pt-[6rem]">
      <div className="flex w-full flex-col p-4">
        <div className="flex flex-col items-center justify-center">
          <SettingNavigationMenu items={items} />
          <div className="w-full">{children}</div>
        </div>
      </div>
    </main>
  );
}

"use client";

import {
  SettingNavigationMenu,
  type SettingNavItem,
} from "@/components/Setting/SettingNavigationMenu";
import { Car, ShieldCheck, ShoppingBag, User } from "lucide-react";

const basePath = "/settings/driver";

const items: SettingNavItem[] = [
  {
    key: "profile",
    label: "Profile",
    href: `${basePath}/profile`,
    icon: User,
  },
  {
    key: "vehicle",
    label: "vehicle",
    href: `${basePath}/vehicle`,
    icon: Car,
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

export default function DriverSettingLayout({
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

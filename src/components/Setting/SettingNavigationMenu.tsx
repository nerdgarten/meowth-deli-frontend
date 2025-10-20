"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  User,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

type SettingNavItem = {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
export type { SettingNavItem };

export const SettingNavigationMenu = ({
  items,
}: {
  items: SettingNavItem[];
}) => {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="bg-app-white flex-wrap rounded-md p-1">
        {items.map(({ key, label, href, icon: Icon }) => (
          <NavItem
            key={key}
            href={href}
            isActive={
              Boolean(pathname) &&
              (pathname === href || pathname.startsWith(`${href}/`))
            }
          >
            <Icon className="mr-1 size-4 stroke-2" /> {label}
          </NavItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const NavItem = ({
  children,
  isActive,
  href,
}: {
  children: React.ReactNode;
  isActive: boolean;
  href: string;
}) => {
  if (isActive) {
    return (
      <NavigationMenuItem className="bg-app-brown text-app-white flex flex-col gap-1 rounded-sm px-4 py-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4">
        <div className="flex items-center">{children}</div>
      </NavigationMenuItem>
    );
  }
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-app-brown flex items-center">{children}</div>
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

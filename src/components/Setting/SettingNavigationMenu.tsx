"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Settings,
  User,
} from "lucide-react";
import { useContext, createContext, useState } from "react";
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
interface SettingNavContextType {
  select_key: string;
  role: string;
}
export const SettingNavContext = createContext<
  SettingNavContextType | undefined
>(undefined);

export type { SettingNavItem };

export const SettingNavigationMenu = ({
  items,
  children,
  role,
}: {
  items: SettingNavItem[];
  children?: React.ReactNode;
  role: string;
}) => {
  const [select, setSelect] = useState<string>(items[0]?.key ?? "");

  return (
    <SettingNavContext.Provider value={{ select_key: select, role: role }}>
      <NavigationMenu>
        <NavigationMenuList className="bg-app-white flex justify-center gap-4 rounded-md p-1 transition-colors">
          {items.map(({ key, label, href, icon: Icon }) => (
            <div
              key={key}
              onClick={() => {
                setSelect(key);
              }}
            >
              <NavItem
                key={key}
                href={href}
                isActive={select !== "" && key === select}
              >
                <Icon className="mr-1 size-4 stroke-2" /> {label}
              </NavItem>
            </div>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {children}
    </SettingNavContext.Provider>
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
      <NavigationMenuItem className="bg-app-brown text-app-white flex cursor-pointer flex-col gap-1 rounded-sm px-4 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4">
        <div className="flex items-center">{children}</div>
      </NavigationMenuItem>
    );
  }
  return (
    <NavigationMenuItem className="text-app-brown flex cursor-pointer flex-col gap-1 rounded-sm px-4 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4">
      <div className="flex items-center">{children}</div>
      {/* <NavigationMenuLink asChild> */}
      {/* <Link href={href}>
          <div className="text-app-brown flex items-center">{children}</div>
        </Link> */}
      {/* </NavigationMenuLink> */}
    </NavigationMenuItem>
  );
};

export const useNavContext = () => {
  const context = useContext(SettingNavContext);
  if (!context) {
    throw new Error(
      "useNavContext must be used within a SettingNavContextProvider"
    );
  }
  return context;
};

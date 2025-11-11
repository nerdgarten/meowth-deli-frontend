"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Home, Flag, Shield } from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@ui/sidebar";
const NAVIGATION_ITEMS = [
  {
    title: "Dashboard",
    href: `/admin/dashboard`,
    icon: Home,
  },
  {
    title: "Delete User",
    href: `/admin/delete`,
    icon: ShoppingBag,
  },
  {
    title: "Pending Reports",
    href: `/admin/pending`,
    icon: Flag,
  },
  {
    title: "License Approvals",
    href: `/admin/license`,
    icon: Shield,
  },
  // {
  //   title: "Reviews",
  //   href: `/driver/${driverId}/dashboard/reviews`,
  //   icon: MessageSquare,
  // },
  // {
  //   title: "Settings",
  //   href: `/driver/${driverId}/dashboard/settings`,
  //   icon: Settings,
  // },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <SidebarProvider className="min-h-screen bg-[#2c241f]">
      <Sidebar className="mt-[4rem] border-0 bg-[#f7e3bd] text-[#2a1a0f] shadow-xl">
        <SidebarContent className="bg-app-bamboo flex h-full flex-col items-center pt-8">
          <Image
            src="/images/meowth-cooking.webp"
            alt="Meowth Delivery Logo"
            width={100}
            height={100}
            className="mt-4 rounded-full"
          />
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#201208] text-shadow-md">
              Meowth Delivery
            </h2>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Admin Dashboard
            </p>
          </div>

          <SidebarGroup className="mt-10 w-full p-0">
            <SidebarGroupContent>
              <SidebarMenu>
                {NAVIGATION_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  // item.href === `/driver/${driverId}/dashboard`
                  //   ? pathname === item.href
                  //   : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="data-[active=true]:bg-app-peanut flex h-12 w-full rounded-none border-transparent bg-transparent pl-10 text-black hover:bg-black/10 active:bg-black/15 data-[active=true]:shadow-sm data-[active=true]:hover:brightness-90 data-[active=true]:active:brightness-75"
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="bottom-0 mt-12 w-full p-4 text-[12px]">
            <p className="font-semibold text-black">
              Meowth Delivery Admin Dashboard
            </p>
            <p className="font-medium text-gray-500">
              @2025 All Rights Reserved
            </p>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-[#fff8eb]">
        <div className="justify center mt-[3rem] flex w-full flex-1 flex-col items-center gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

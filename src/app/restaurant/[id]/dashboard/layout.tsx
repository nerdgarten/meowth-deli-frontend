"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShoppingBag,
} from "lucide-react";

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
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Reviews",
    href: "/dashboard/reviews",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider className="min-h-screen bg-[#2c241f]">
      <Sidebar className="mt-[4rem] border-0 bg-[#f7e3bd] text-[#2a1a0f] shadow-xl">
        <SidebarContent className="flex h-full flex-col justify-between px-6 py-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#b08648] uppercase">
                Restaurant Dashboard
              </p>
              <h2 className="text-xl font-bold tracking-tight text-[#201208]">
                Meowth Delivery
              </h2>
              <p className="text-sm text-[#aa8551]">Restaurant Dashboard</p>
            </div>

            <SidebarGroup className="space-y-4">
              <SidebarGroupLabel className="text-xs font-semibold text-[#b08648] uppercase">
                Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {NAVIGATION_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href));

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="rounded-lg border border-transparent bg-transparent text-[#2a1a0f] transition hover:border-[#d3b989] hover:bg-[#f3d59b] data-[active=true]:border-[#b37a1f] data-[active=true]:bg-[#c8942c] data-[active=true]:text-white"
                        >
                          <Link href={item.href}>
                            <Icon className="size-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
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

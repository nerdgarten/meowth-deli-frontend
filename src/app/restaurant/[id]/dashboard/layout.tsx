"use client";

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
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { id } = useParams();
  const restaurantId = id as string;

  const NAVIGATION_ITEMS = [
    {
      title: "Dashboard",
      href: `/restaurant/${restaurantId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      href: `/restaurant/${restaurantId}/dashboard/orders`,
      icon: ShoppingBag,
    },
    // {
    //   title: "Reviews",
    //   href: `/restaurant/${restaurantId}/dashboard/reviews`,
    //   icon: MessageSquare,
    // },
    // {
    //   title: "Settings",
    //   href: `/restaurant/${restaurantId}/dashboard/settings`,
    //   icon: Settings,
    // },
  ] as const;

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
                      item.href === `/restaurant/${restaurantId}/dashboard`
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

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

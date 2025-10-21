import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurant Management | Meowth Delivery",
  description: "Manage your restaurant orders, reviews, and dashboard",
};

export default function RestaurantManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { ComponentType } from "react";

import { CustomerProfilePage } from "@/components/Setting/Profile/customer";
import { DriverProfilePage } from "@/components/Setting/Profile/driver";
import { RestaurantProfilePage } from "@/components/Setting/Profile/restaurant";
import { authenticatedAs } from "@/libs/authentication";

export default function SettingsProfilePage() {
  const { data: role, isLoading } = useQuery({
    queryKey: ["authenticated-role"],
    queryFn: authenticatedAs,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-4">
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  if (role === "customer") {
    // return <CustomerProfilePage />;
  }
  if (role === "restaurant") {
    // return <RestaurantProfilePage />;
  }
  if (role === "driver") {
    // return <DriverProfilePage />;
  }

  return (
    <div className="p-4">
      <p>
        Your account role is not yet supported in settings. Please contact
        support.
      </p>
    </div>
  );
}

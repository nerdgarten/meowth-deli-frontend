"use client";
import { DriverProfilePage } from "@/components/Setting/Profile/driver";
import { CustomerProfilePage } from "@/components/Setting/Profile/customer";
import { RestaurantProfilePage } from "@/components/Setting/Profile/restaurant";
import { CustomerAddressPage } from "@/components/Setting/Address/customer";
import { CustomerOrderPage } from "@/components/Setting/Order/customer";
import { CustomerSecurityPage } from "@/components/Setting/Security/customer";
import { useNavContext } from "@/components/Setting/SettingNavigationMenu";
import { useQuery } from "@tanstack/react-query";

import { authenticatedAs } from "@/libs/authentication";

export default function SettingsPage() {
  const { data: role, isLoading } = useQuery({
    queryKey: ["authenticated-role"],
    queryFn: authenticatedAs,
    staleTime: 60_000,
  });
  if (isLoading) {
    console.log(role);
  }
  const { select_key } = useNavContext();

  switch (`${select_key}-${role}`) {
    case "profile-customer":
      return <CustomerProfilePage />;
    case "profile-restaurant":
      return <RestaurantProfilePage />;
    case "profile-driver":
      return <DriverProfilePage />;
    case "addresses-customer":
      return <CustomerAddressPage />;
    case "security-customer":
      return <CustomerSecurityPage />;
    case "orders-customer":
      return <CustomerOrderPage />;
    default:
      return (
        <div className="p-4">
          <p>
            Your account role is not yet supported in settings. Please contact
            support.
          </p>
        </div>
      );
  }
}

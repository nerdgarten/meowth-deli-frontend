"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/context/AuthContext";
import { CustomerAddressPage } from "@/components/Setting/Address/customer";
import { RestaurantAddressPage } from "@/components/Setting/Address/restaurant";
import { CustomerOrderPage } from "@/components/Setting/Order/customer";
import { CustomerPreferencePage } from "@/components/Setting/Preference/customer";
import { CustomerProfilePage } from "@/components/Setting/Profile/customer";
import { DriverProfilePage } from "@/components/Setting/Profile/driver";
import { RestaurantProfilePage } from "@/components/Setting/Profile/restaurant";
import { CustomerSecurityPage } from "@/components/Setting/Security/customer";
import { DriverSecurityPage } from "@/components/Setting/Security/driver";
import { RestaurantSecurityPage } from "@/components/Setting/Security/restaurant";
import { useNavContext } from "@/components/Setting/SettingNavigationMenu";
import { DriverVehiclePage } from "@/components/Setting/Vehicle/driver";
import { authenticatedAs } from "@/libs/authentication";

export default function SettingsPage() {
  const { select_key, role } = useNavContext();
  console.log("role:", role);

  switch (`${select_key}-${role}`) {
    case "profile-customer":
      return <CustomerProfilePage />;
    case "profile-restaurant":
      return <RestaurantProfilePage />;
    case "profile-driver":
      return <DriverProfilePage />;
    case "addresses-customer":
      return <CustomerAddressPage />;
    case "addresses-restaurant":
      return <RestaurantAddressPage />;
    case "preferences-customer":
      return <CustomerPreferencePage />;
    case "security-customer":
      return <CustomerSecurityPage />;
    case "security-restaurant":
      return <RestaurantSecurityPage />;
    case "security-driver":
      return <DriverSecurityPage />;
    case "orders-customer":
      return <CustomerOrderPage />;
    case "vehicle-driver":
      return <DriverVehiclePage />;
    case "vehicle-restaurant":
      return <DriverVehiclePage />;
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

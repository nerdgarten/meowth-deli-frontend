"use client";
import { FileArchive } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import type {
  AdminGenericResponse,
  AdminManageUserFile,
  AdminFileStatusFile,
  AdminFileResponse,
} from "@/queries/admin";

import { authenticatedAs } from "@/libs/authentication";
// Image import removed (unused)
import {
  adminVerifyDriver,
  adminVerifyRestaurant,
  getAdminDriverCertificates,
  getAdminRestaurantCertificates,
  getDriverProfileById,
  getRestaurantProfileById,
  getAdminDriverCertificateStatus,
  getAdminRestaurantCertificateStatus,
} from "@/queries/admin";

interface License {
  id: number;
  name: string;
  status: "Pending" | "Approved";
  // vehicleName: string;
  licenseId: string;
  documentUrl: string;
  vehicleName?: string;
  restaurantStyleName?: string;
  role?: "driver" | "restaurant";
}
interface DriverLicense extends License {
  vehicleName: string;
}
interface RestaurantLicense extends License {
  restaurantStyleName: string;
}

interface ManageUserFile {
  id: string;
  is_verified_decided: "yes" | "no";
  status_path: string;
}

interface FileStatusFile {
  id: string;
  filename: string;
  uploadedAt: string;
  status: "pending" | "verified" | "rejected";
}

interface DriverProfile {
  user?: { email?: string };
  vehicle?: string;
  licence?: string;
  verification_status?: string;
}

interface RestaurantProfile {
  user?: { email?: string };
  name?: string;
  restaurant_style_name?: string;
  licenseId?: string;
  verification_status?: string;
}

const ReportCard = ({
  Icon,
  data,
  onView,
  onApprove,
  onRequestUpdate,
}: {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  data: License;
  onView?: () => void;
  onApprove?: () => void;
  onRequestUpdate?: () => void;
}) => {
  return (
    <div className="group border-app-tan/30 relative flex h-full w-full flex-col gap-5 overflow-hidden rounded-xl border p-10 px-16 shadow-sm transition">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,192,82,0.25),transparent_60%)] opacity-0 mix-blend-overlay transition" />
      <div className="flex items-center justify-between">
        {Icon && (
          <div className="mr-6 flex items-center justify-center">
            <Icon className="text-app-tan h-6 w-6" />
          </div>
        )}
        <h1 className="text-app-brown text-2xl font-bold tracking-tight">
          {data.name}
        </h1>
        <div className="text-sm font-semibold text-white">
          <span
            className={`rounded-full px-3 py-1 ${data.status === "Approved" ? "bg-green-600" : "bg-yellow-500"}`}
          >
            {data.status}
          </span>
        </div>
      </div>
      <div className="flex justify-between gap-12">
        <div className="flex w-5/8 flex-col gap-4">
          <h2>{data.vehicleName ?? data.restaurantStyleName ?? ""}</h2>
          <h3>{data.licenseId}</h3>
          <div className="my-8 w-full rounded-xl border-2 border-amber-900/40 bg-gray-200/30 py-8">
            Test
          </div>
          <div className="flex gap-4">
            <button
              className="text-md flex items-center justify-center rounded-full border-2 border-black/10 bg-white px-4 py-2 font-semibold whitespace-nowrap text-black/60 shadow-md hover:bg-gray-200/20 active:bg-gray-200/30"
              onClick={onView}
            >
              <FileArchive size={20} className="mr-2" />
              View PDF
            </button>
            <button
              className="text-md flex items-center justify-center rounded-full border-2 border-black/10 bg-white px-4 py-2 font-semibold whitespace-nowrap text-black/60 shadow-md hover:bg-gray-200/20 active:bg-gray-200/30"
              onClick={onApprove}
            >
              {/* <FileArchive size={20} className="mr-2" /> */}
              Approve
            </button>
            <button
              className="text-md flex items-center justify-center rounded-full border-2 border-black/10 bg-white px-4 py-2 font-semibold whitespace-nowrap text-black/60 shadow-md hover:bg-gray-200/20 active:bg-gray-200/30"
              onClick={onRequestUpdate}
            >
              {/* <FileArchive size={20} className="mr-2" /> */}
              Request Update
            </button>
          </div>
          {/* <h2>
              {data.type == "driver" ? data.driverName : data.restaurantName}
            </h2> */}
        </div>
        {/* <div
          className="text-md my-4 h-full w-full rounded-lg bg-red-100 px-16 font-semibold text-red-900 shadow-md"
          onClick={onClick}
        ></div> */}
      </div>

      <div className="bg-app-yellow mt-auto h-1 w-0 rounded-full transition-all duration-300" />
    </div>
  );
};
export function AdminLicense() {
  const [driverLicense, setDriverLicense] = useState<DriverLicense[]>([]);
  const [driversLimit, setDriversLimit] = useState<number>(10);
  const [driversOffset, setDriversOffset] = useState<number>(0);
  const [driversTotal, setDriversTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);

  const [restaurantLicense, setRestaurantLicense] = useState<
    RestaurantLicense[]
  >([]);
  const [restaurantsLimit, setRestaurantsLimit] = useState<number>(10);
  const [restaurantsOffset, setRestaurantsOffset] = useState<number>(0);
  const [restaurantsTotal, setRestaurantsTotal] = useState<number>(0);

  const fetchDrivers = useCallback(async () => {
    try {
      const driversRes = (await getAdminDriverCertificates(
        driversLimit,
        driversOffset
      )) as AdminGenericResponse<AdminManageUserFile>;
      if (!driversRes.success) {
        setError(driversRes.message ?? "Failed to load driver certificates");
        return;
      }
      const entries = (driversRes.data ?? []) as ManageUserFile[];
      const enrichedDrivers: DriverLicense[] = await Promise.all(
        (entries ?? []).map(async (d) => {
          const userId = Number(d.id ?? 0);
          let profile: DriverProfile | undefined = undefined;
          try {
            profile = (await getDriverProfileById(userId)) as DriverProfile;
          } catch (err) {
            console.warn("Driver profile not found for", userId);
          }
          let documentUrl = "#";
          try {
            const statusList = (await getAdminDriverCertificateStatus(
              userId
            )) as AdminGenericResponse<AdminFileStatusFile>;
            const statusData = Array.isArray(statusList.data)
              ? (statusList.data as AdminFileStatusFile[])
              : [];
            if (
              statusList.success &&
              Array.isArray(statusList.data) &&
              statusList.data.length > 0
            ) {
              const fileId =
                statusData.length > 0 ? statusData[0].id : undefined;
              // Build the file download URL on the client instead of fetching the file directly
              const rel = `/admin/drivers/certificate/${userId}/${fileId}`;
              documentUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}${rel}`;
            }
          } catch (err) {
            console.warn("Failed to resolve driver file url", userId, err);
          }
          return {
            id: userId,
            name: profile?.user?.email ?? "",
            status: (profile?.verification_status as any) ?? "Pending",
            vehicleName: profile?.vehicle ?? profile?.vehicle ?? "",
            licenseId: profile?.licence ?? profile?.licence ?? "",
            documentUrl,
            role: "driver",
          } as DriverLicense;
        })
      );
      setDriverLicense(enrichedDrivers);
      setDriversTotal(driversRes.total ?? 0);
    } catch (err) {
      console.error("Error fetching drivers in AdminLicense", err);
      setError(String((err as any)?.response?.data?.message ?? err));
    }
  }, [driversLimit, driversOffset]);

  const fetchRestaurants = useCallback(async () => {
    try {
      const restaurantsRes = (await getAdminRestaurantCertificates(
        restaurantsLimit,
        restaurantsOffset
      )) as AdminGenericResponse;
      if (!restaurantsRes.success) {
        setError(
          restaurantsRes.message ?? "Failed to load restaurant certificates"
        );
        return;
      }
      const entriesR = (restaurantsRes.data ?? []) as AdminManageUserFile[];
      const enrichedRestaurants: RestaurantLicense[] = await Promise.all(
        (entriesR ?? []).map(async (r) => {
          const id = Number(r.id ?? 0);
          let profile: RestaurantProfile | undefined = undefined;
          try {
            profile = (await getRestaurantProfileById(id)) as RestaurantProfile;
          } catch (err) {
            console.warn("Restaurant profile not found for", id);
          }
          let documentUrl = "#";
          try {
            const statusList = (await getAdminRestaurantCertificateStatus(
              id
            )) as AdminGenericResponse<AdminFileStatusFile>;
            const statusDataR = Array.isArray(statusList.data)
              ? (statusList.data as AdminFileStatusFile[])
              : [];
            if (
              statusList.success &&
              Array.isArray(statusList.data) &&
              statusList.data.length > 0
            ) {
              const fileId =
                statusDataR.length > 0 ? statusDataR[0].id : undefined;
              // Construct the URL to open the file from the API directly
              const rel = `/admin/restaurants/certificate/${id}/${fileId}`;
              documentUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}${rel}`;
            }
          } catch (err) {
            console.warn("Failed to resolve restaurant file url", id, err);
          }
          return {
            id,
            name: profile?.name ?? profile?.user?.email ?? "",
            status: (profile?.verification_status as any) ?? "Pending",
            restaurantStyleName:
              profile?.restaurant_style_name ?? profile?.name ?? "",
            licenseId: profile?.licenseId ?? "",
            documentUrl,
            role: "restaurant",
          } as RestaurantLicense;
        })
      );
      setRestaurantLicense(enrichedRestaurants);
      setRestaurantsTotal(restaurantsRes.total ?? 0);
    } catch (err) {
      console.error("Error fetching restaurants in AdminLicense", err);
      setError(String((err as any)?.response?.data?.message ?? err));
    }
  }, [restaurantsLimit, restaurantsOffset]);

  useEffect(() => {
    // initial fetch both when authenticated as admin
    if (!isAdminUser) return;
    void fetchDrivers();
    void fetchRestaurants();
  }, [fetchDrivers, fetchRestaurants, isAdminUser]);

  useEffect(() => {
    // check auth on load
    async function checkAdmin() {
      try {
        const role = await authenticatedAs();
        setIsAdminUser(String(role) === "admin");
        if (String(role) !== "admin") {
          setError("Not authenticated as admin (403)");
        }
      } catch (err) {
        setError("Not authenticated as admin (403)");
      }
    }
    void checkAdmin();
  }, []);

  async function handleApprove(item: any) {
    try {
      if (item.role === "driver") {
        await adminVerifyDriver(item.id, "Approved");
        setDriverLicense((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, status: "Approved" } : d))
        );
        // refresh drivers list to get new statuses
        void fetchDrivers();
      } else if (item.role === "restaurant") {
        await adminVerifyRestaurant(item.id, "Approved");
        setRestaurantLicense((prev) =>
          prev.map((r) => (r.id === item.id ? { ...r, status: "Approved" } : r))
        );
        // refresh restaurants list to get new statuses
        void fetchRestaurants();
      }
    } catch (err) {
      console.error("Error approving license:", err);
      setError(String((err as any)?.response?.data?.message ?? err));
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 p-8">
      <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/30 p-8 shadow-md">
        <div className="flex flex-col gap-2 px-8">
          <p className="text-app-tan font-medium">LICENSE APPROVALS</p>
          <h1 className="text-3xl font-semibold">Drivers & restaurants</h1>
          <p className="text-app-tan font-medium">
            Review the submitted address, location, and paperwork before you
            approve.
          </p>
        </div>
        <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/80 p-8 shadow-md">
          <div className="flex flex-col gap-2 px-8">
            <h1 className="text-3xl font-semibold">Driver license queue</h1>
            <p className="text-app-tan font-medium">
              Keep riders, restaurants, and eaters safe with one glance.
            </p>
          </div>
          {error && <div className="px-8 py-4 text-red-600">{error}</div>}
          {isAdminUser === false && (
            <div className="px-8 py-4 text-gray-700">
              Please sign in as an admin to access this data.
            </div>
          )}
          {driverLicense.map((license) => (
            <div
              key={license.id}
              className="w-full rounded-xl bg-white/80 shadow-xl"
            >
              <ReportCard
                data={license}
                onView={() => window.open(license.documentUrl, "_blank")}
                onApprove={() => handleApprove(license)}
                onRequestUpdate={() => alert("Not implemented")}
              />
            </div>
          ))}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {Math.floor(driversOffset / driversLimit) + 1} of{" "}
              {Math.max(1, Math.ceil(driversTotal / driversLimit))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Per page:</label>
              <select
                className="rounded border p-1"
                value={driversLimit}
                onChange={(e) => {
                  setDriversLimit(Number(e.target.value));
                  setDriversOffset(0);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <button
                disabled={driversOffset === 0}
                className="rounded border px-3 py-1"
                onClick={() =>
                  setDriversOffset(Math.max(driversOffset - driversLimit, 0))
                }
              >
                Previous
              </button>
              <button
                disabled={driversOffset + driversLimit >= driversTotal}
                className="rounded border px-3 py-1"
                onClick={() => setDriversOffset(driversOffset + driversLimit)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/80 p-8 shadow-md">
          <div className="flex flex-col gap-2 px-8">
            <h1 className="text-3xl font-semibold">Restaurant license queue</h1>
            <p className="text-app-tan font-medium">
              Keep riders, restaurants, and eaters safe with one glance.
            </p>
          </div>
          {restaurantLicense.map((license) => (
            <div
              key={license.id}
              className="w-full rounded-xl bg-white/80 shadow-xl"
            >
              <ReportCard
                data={license}
                onView={() => window.open(license.documentUrl, "_blank")}
                onApprove={() => handleApprove(license)}
                onRequestUpdate={() => alert("Not implemented")}
              />
            </div>
          ))}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {Math.floor(restaurantsOffset / restaurantsLimit) + 1} of{" "}
              {Math.max(1, Math.ceil(restaurantsTotal / restaurantsLimit))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Per page:</label>
              <select
                className="rounded border p-1"
                value={restaurantsLimit}
                onChange={(e) => {
                  setRestaurantsLimit(Number(e.target.value));
                  setRestaurantsOffset(0);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <button
                disabled={restaurantsOffset === 0}
                className="rounded border px-3 py-1"
                onClick={() =>
                  setRestaurantsOffset(
                    Math.max(restaurantsOffset - restaurantsLimit, 0)
                  )
                }
              >
                Previous
              </button>
              <button
                disabled={
                  restaurantsOffset + restaurantsLimit >= restaurantsTotal
                }
                className="rounded border px-3 py-1"
                onClick={() =>
                  setRestaurantsOffset(restaurantsOffset + restaurantsLimit)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full grid-cols-2 grid-rows-2 gap-x-8 gap-y-4"></div>
      </div>
    </div>
  );
}

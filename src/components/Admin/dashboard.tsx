"use client";
import { Car, Flag, ForkKnifeCrossed, Users2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { authenticatedAs } from "@/libs/authentication";
import { getAdminDrivers, getAdminRestaurants } from "@/queries/admin";

// Image import removed (unused)
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
const DashboardCard = ({
  header,
  Icon,
  content,
}: {
  header: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  content: React.ReactNode;
}) => {
  return (
    <div className="group border-app-tan/30 relative flex h-full w-full flex-col gap-5 overflow-hidden rounded-xl border p-6 shadow-sm transition">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,192,82,0.25),transparent_60%)] opacity-0 mix-blend-overlay transition" />
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="relative">
            <div className="bg-app-tan/90 ring-app-brown/20 flex h-14 w-14 items-center justify-center rounded-lg shadow-inner ring-2">
              <Icon className="text-app-dark-brown h-8 w-8 stroke-2" />
            </div>

            <div className="bg-app-peanut/20 absolute inset-0 -z-10 rounded-lg blur-lg" />
          </div>
        )}
        <h1 className="text-app-brown text-lg font-semibold tracking-tight">
          {header}
        </h1>
      </div>
      <div className="text-app-dark-brown mt-1">{content}</div>
      <div className="bg-app-yellow mt-auto h-1 w-0 rounded-full transition-all duration-300" />
    </div>
  );
};
export function AdminDashboard() {
  const [driversCount, setDriversCount] = useState<number | null>(null);
  const [restaurantsCount, setRestaurantsCount] = useState<number | null>(null);
  const [pendingDriversCount, setPendingDriversCount] = useState<number | null>(
    null
  );
  const [pendingRestaurantsCount, setPendingRestaurantsCount] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        setLoading(true);
        setError(null);
        const role = await authenticatedAs();
        if (!role) {
          setError("Not authenticated (401)");
          setLoading(false);
          return;
        }
        if (String(role) !== "admin") {
          setError("Not authorized as admin (403)");
          setLoading(false);
          return;
        }
        const drivers = await getAdminDrivers();
        const restaurants = await getAdminRestaurants();
        setDriversCount(drivers?.data?.length ?? drivers?.length ?? 0);
        setRestaurantsCount(
          restaurants?.data?.length ?? restaurants?.length ?? 0
        );
        const pendingDrivers = await getAdminDrivers("pending");
        const pendingRestaurants = await getAdminRestaurants("pending");
        setPendingDriversCount(
          pendingDrivers?.data?.length ?? pendingDrivers?.length ?? 0
        );
        setPendingRestaurantsCount(
          pendingRestaurants?.data?.length ?? pendingRestaurants?.length ?? 0
        );
      } catch (err: any) {
        console.error("Error fetching admin dashboard counts:", err);
        if (err?.response && err.response.status === 403) {
          setError("Forbidden — you must be an admin");
        } else if (err?.response && err.response.status === 401) {
          setError("Unauthorized — please sign in");
        } else {
          setError(String(err?.response?.data?.message ?? err));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);
  const totalUsersCount = (driversCount ?? 0) + (restaurantsCount ?? 0);

  return (
    <div className="flex w-full flex-col gap-8 p-8">
      <div className="flex h-160 w-full flex-col gap-6 rounded-2xl bg-white/30 p-8 shadow-md">
        <div className="flex flex-col gap-2 px-8">
          <p className="text-app-tan font-medium">SAFETY CONTROL ROOM</p>
          <h1 className="text-3xl font-semibold">User well-being dashboard</h1>
          <p className="text-app-tan font-medium">
            Keep riders, restaurants, and eaters safe with one glance.
          </p>
          {error && (
            <p className="text-sm text-red-600">
              Error fetching dashboard: {error}
            </p>
          )}
        </div>
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-x-8 gap-y-4">
          <div className="col-span-1 row-span-1 rounded-xl bg-white/80 shadow-xl">
            <DashboardCard
              header={"Total users"}
              Icon={Users2}
              content={
                <div>
                  {loading ? (
                    <p className="text-app-dark-brown text-3xl font-extrabold">
                      --
                    </p>
                  ) : (
                    <p className="text-app-dark-brown text-3xl font-extrabold">
                      {totalUsersCount.toLocaleString()}
                    </p>
                  )}
                </div>
              }
            />
          </div>
          <div className="col-span-1 row-span-1 rounded-xl bg-white/80 shadow-xl">
            <DashboardCard
              header={"Total drivers"}
              Icon={Car}
              content={
                <div>
                  {loading ? (
                    <p className="text-app-dark-brown text-3xl font-extrabold">
                      --
                    </p>
                  ) : (
                    <div>
                      <p className="text-app-dark-brown text-3xl font-extrabold">
                        {(driversCount ?? 0).toLocaleString()}
                      </p>
                      <p className="text-app-dark-brown/50 mt-4 text-sm font-medium">
                        {(pendingDriversCount ?? 0).toLocaleString()} Drivers
                        pending
                      </p>
                    </div>
                  )}
                </div>
              }
            />
          </div>
          <div className="col-span-1 row-span-1 rounded-xl bg-white/80 shadow-xl">
            <DashboardCard
              header={"Restaurants partner"}
              Icon={ForkKnifeCrossed}
              content={
                <div>
                  {loading ? (
                    <p className="text-app-dark-brown text-3xl font-extrabold">
                      --
                    </p>
                  ) : (
                    <div>
                      <p className="text-app-dark-brown text-3xl font-extrabold">
                        {(restaurantsCount ?? 0).toLocaleString()}
                      </p>
                      <p className="text-app-dark-brown/50 mt-4 text-sm font-medium">
                        {(pendingRestaurantsCount ?? 0).toLocaleString()}{" "}
                        restaurant partners pending
                      </p>
                    </div>
                  )}
                </div>
              }
            />
          </div>
          <div className="col-span-1 row-span-1 rounded-xl bg-white/80 shadow-xl">
            <DashboardCard
              header={"Unsolved reports"}
              Icon={Flag}
              content={
                <div>
                  {loading ? (
                    <p className="text-app-dark-brown text-3xl font-extrabold">
                      --
                    </p>
                  ) : (
                    <p className="text-app-dark-brown text-3xl font-extrabold">
                      {(
                        (pendingDriversCount ?? 0) +
                        (pendingRestaurantsCount ?? 0)
                      ).toLocaleString()}
                    </p>
                  )}
                  <Link href={"/"}>
                    <p className="text-app-dark-brown/50 mt-4 text-sm font-medium underline">
                      Handle Now
                    </p>
                  </Link>
                </div>
              }
            />
          </div>
        </div>
      </div>
      <div className="flex h-160 w-full flex-col gap-6 rounded-2xl bg-white/30 p-8 shadow-md">
        <div className="flex flex-col gap-2 px-8">
          <p className="text-app-tan font-medium">SOFT DELETE MONITOR</p>
          <h1 className="text-3xl font-semibold">
            Accounts awaiting permanent removal
          </h1>
          <p className="text-app-tan font-medium">
            Classify soft-deleted profiles to plan restorations.
          </p>
        </div>
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-x-8 gap-y-4">
          <div className="col-span-1 row-span-1 rounded-xl bg-white/80 shadow-xl">
            <DashboardCard
              header={"CUSTOMERS"}
              content={
                <p className="text-app-dark-brown text-3xl font-extrabold">
                  --
                </p>
              }
            />
          </div>
          <div className="col-span-1 row-span-1 rounded-xl bg-white/80 shadow-xl">
            <DashboardCard
              header={"DRIVERS"}
              content={
                <div>
                  {loading ? (
                    <p className="text-app-dark-brown text-3xl font-extrabold">
                      --
                    </p>
                  ) : (
                    <p className="text-app-dark-brown text-3xl font-extrabold">
                      {(driversCount ?? 0).toLocaleString()}
                    </p>
                  )}
                  <p className="text-app-dark-brown/50 mt-4 text-sm font-medium">
                    {/* 32 Drivers pending */}
                  </p>
                </div>
              }
            />
          </div>
          <div className="col-span-1 row-span-1 rounded-xl bg-white/80 shadow-xl">
            <DashboardCard
              header={"RESTAURANT PARTNERS"}
              content={
                <div>
                  <p className="text-app-dark-brown text-3xl font-extrabold">
                    {(restaurantsCount ?? 0).toLocaleString()}
                  </p>
                  <p className="text-app-dark-brown/50 mt-4 text-sm font-medium">
                    {/* 11 restaurant partners pending */}
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

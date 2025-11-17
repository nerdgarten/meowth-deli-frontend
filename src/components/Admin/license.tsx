"use client";

import { FileArchive } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { authenticatedAs } from "@/libs/authentication";
import {
  adminVerifyDriver,
  getAdminDriverCertificateStatus,
  getAdminDrivers,
} from "@/queries/admin";

interface License {
  id: number;
  name: string;
  status: "Pending" | "Approved" | "Rejected";
  licenseId: string;
  documentUrl: string;
  vehicleName?: string;
  role: "driver";
}

interface DriverData {
  id: number;
  verification_status: string;
  is_available: boolean;
  firstname: string;
  lastname: string;
  vehicle?: string;
  licence?: string;
}

const ReportCard = ({
  data,
  onView,
  onApprove,
  onReject,
  onRequestUpdate,
}: {
  data: License;
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestUpdate?: () => void;
}) => {
  return (
    <div className="group border-app-tan/30 relative flex h-full w-full flex-col gap-6 overflow-hidden rounded-xl border bg-white p-6 shadow-lg transition hover:shadow-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,192,82,0.15),transparent_60%)] opacity-0 transition group-hover:opacity-100" />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-app-brown text-2xl font-bold">{data.name}</h2>
          <p className="mt-1 text-sm text-gray-600">Driver ID: {data.id}</p>
        </div>
        <div className="ml-4">
          <span
            className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-sm ${
              data.status === "Approved"
                ? "bg-green-600"
                : data.status === "Rejected"
                  ? "bg-red-600"
                  : "bg-yellow-500"
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="relative grid gap-4 rounded-lg bg-gray-50/50 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Vehicle
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {data.vehicleName ?? "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              License ID
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {data.licenseId ?? "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative flex flex-wrap gap-3">
        <button
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
          onClick={onView}
        >
          <FileArchive size={18} />
          View Certificate
        </button>
        {data.status === "Pending" && (
          <>
            <button
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-green-600 bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-green-700 hover:bg-green-700 active:bg-green-800"
              onClick={onApprove}
            >
              Approve
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-red-700 hover:bg-red-700 active:bg-red-800"
              onClick={onReject}
            >
              Reject
            </button>
          </>
        )}
        <button
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
          onClick={onRequestUpdate}
        >
          Request Update
        </button>
      </div>
    </div>
  );
};
export function AdminLicense() {
  const [driverLicense, setDriverLicense] = useState<License[]>([]);
  const [driversLimit, setDriversLimit] = useState<number>(10);
  const [driversOffset, setDriversOffset] = useState<number>(0);
  const [driversTotal, setDriversTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);

  const fetchDrivers = useCallback(async () => {
    try {
      const driversRes = await getAdminDrivers();
      const entries = (driversRes ?? []) as DriverData[];
      const enrichedDrivers: License[] = await Promise.all(
        entries.map(async (driver) => {
          const userId = driver.id;
          let documentUrl = "#";
          try {
            const statusList = await getAdminDriverCertificateStatus(userId);
            const statusData =
              statusList?.data && Array.isArray(statusList.data)
                ? (statusList.data as Array<{
                    id?: string;
                    filename?: string;
                    uploadedAt?: string;
                    status?: string;
                  }>)
                : [];
            if (
              statusList.success &&
              Array.isArray(statusList.data) &&
              statusList.data.length > 0 &&
              Array.isArray(statusData) &&
              statusData.length > 0
            ) {
              const firstFile = statusData[0] as { id?: string };
              const fileId = firstFile?.id;
              // Build the file download URL on the client instead of fetching the file directly
              const rel = `/admin/drivers/certificate/${userId}/${fileId}`;
              documentUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}${rel}`;
            }
          } catch (err) {
            console.warn("Failed to resolve driver file url", userId, err);
          }
          return {
            id: userId,
            name: `${driver.firstname} ${driver.lastname}`,
            status:
              driver.verification_status === "approved"
                ? "Approved"
                : driver.verification_status === "rejected"
                  ? "Rejected"
                  : "Pending",
            vehicleName: driver.vehicle ?? "",
            licenseId: driver.licence ?? "",
            documentUrl,
            role: "driver" as const,
          };
        })
      );
      setDriverLicense(enrichedDrivers);
      setDriversTotal(entries.length ?? 0);
    } catch (err) {
      console.error("Error fetching drivers in AdminLicense", err);
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to fetch drivers")
          : err instanceof Error
            ? err.message
            : "Failed to fetch drivers";
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    // initial fetch when authenticated as admin
    if (!isAdminUser) return;
    void fetchDrivers();
  }, [fetchDrivers, isAdminUser]);

  useEffect(() => {
    // check auth on load
    async function checkAdmin() {
      try {
        const role = await authenticatedAs();
        setIsAdminUser(String(role) === "admin");
        if (String(role) !== "admin") {
          setError("Not authenticated as admin (403)");
        }
      } catch {
        setError("Not authenticated as admin (403)");
      }
    }
    void checkAdmin();
  }, []);

  async function handleApprove(item: License) {
    try {
      await adminVerifyDriver(item.id, "approved");
      setDriverLicense((prev) =>
        prev.map((d) =>
          d.id === item.id ? { ...d, status: "Approved" as const } : d
        )
      );
      // refresh drivers list to get new statuses
      void fetchDrivers();
    } catch (err) {
      console.error("Error approving license:", err);
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to approve license")
          : err instanceof Error
            ? err.message
            : "Failed to approve license";
      setError(errorMessage);
    }
  }

  async function handleReject(item: License) {
    try {
      await adminVerifyDriver(item.id, "rejected");
      setDriverLicense((prev) =>
        prev.map((d) =>
          d.id === item.id ? { ...d, status: "Rejected" as const } : d
        )
      );
      // refresh drivers list to get new statuses
      void fetchDrivers();
    } catch (err) {
      console.error("Error rejecting license:", err);
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to reject license")
          : err instanceof Error
            ? err.message
            : "Failed to reject license";
      setError(errorMessage);
    }
  }

  async function handleRequestUpdate(_item: License) {
    // TODO: Implement request update functionality when API endpoint is available
    alert("Request update functionality coming soon");
  }

  return (
    <div className="flex w-full flex-col gap-8 p-8">
      <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/30 p-8 shadow-md">
        <div className="flex flex-col gap-2 px-8">
          <p className="text-app-tan font-medium">LICENSE APPROVALS</p>
          <h1 className="text-3xl font-semibold">Driver Licenses</h1>
          <p className="text-app-tan font-medium">
            Review the submitted driver licenses and paperwork before you
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

          {/* License Cards Grid */}
          <div className="grid gap-4">
            {driverLicense
              .slice(driversOffset, driversOffset + driversLimit)
              .map((license) => (
                <div key={license.id}>
                  <ReportCard
                    data={license}
                    onView={() => window.open(license.documentUrl, "_blank")}
                    onApprove={() => handleApprove(license)}
                    onReject={() => handleReject(license)}
                    onRequestUpdate={() => handleRequestUpdate(license)}
                  />
                </div>
              ))}
          </div>

          {/* No results message */}
          {driverLicense.length === 0 && isAdminUser && !error && (
            <div className="px-8 py-12 text-center text-gray-500">
              <p className="text-lg font-medium">No driver licenses found</p>
              <p className="mt-2 text-sm">
                There are no pending driver licenses to review at this time.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {driverLicense.length > 0 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {driversOffset + 1} to{" "}
                  {Math.min(driversOffset + driversLimit, driversTotal)} of{" "}
                  {driversTotal} licenses
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Items per page:
                </label>
                <select
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={driversLimit}
                  onChange={(e) => {
                    setDriversLimit(Number(e.target.value));
                    setDriversOffset(0);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <div className="flex gap-2">
                  <button
                    disabled={driversOffset === 0}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                    onClick={() =>
                      setDriversOffset(
                        Math.max(driversOffset - driversLimit, 0)
                      )
                    }
                  >
                    Previous
                  </button>
                  <button
                    disabled={driversOffset + driversLimit >= driversTotal}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                    onClick={() =>
                      setDriversOffset(driversOffset + driversLimit)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

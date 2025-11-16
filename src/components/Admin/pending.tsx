"use client";
// removed unused imports
import {
  ArrowRight,
  Car,
  Flag,
  ForkKnifeCrossed,
  MoveRight,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { AdminReport, AdminGenericResponse } from "@/queries/admin";
import { getAdminReports, resolveAdminReport } from "@/queries/admin";
import { useResolveReport } from "./ResolveReport";

// Image import removed (unused)
interface Report {
  id: number;
  type: "restaurant" | "driver";
  description: string;
  dateSubmitted: string;
  status: "Pending" | "Resolved";
  customerName: string;
  restaurantName?: string;
  driverName?: string;
}

const ReportCard = ({
  Icon,
  data,
  onClick,
}: {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  data: Report;
  onClick?: () => void;
}) => {
  return (
    <div className="group border-app-tan/30 relative flex h-full w-full flex-col gap-5 overflow-hidden rounded-xl border p-10 shadow-sm transition">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,192,82,0.25),transparent_60%)] opacity-0 mix-blend-overlay transition" />
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="relative">
                <div className="bg-app-tan/90 ring-app-brown/20 flex h-14 w-14 items-center justify-center rounded-lg shadow-inner ring-2">
                  <Icon className="text-app-dark-brown h-8 w-8 stroke-2" />
                </div>

                <div className="bg-app-peanut/20 absolute inset-0 -z-10 rounded-lg blur-lg" />
              </div>
            )}
            <h1 className="text-app-brown text-2xl font-bold tracking-tight">
              {data.description}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xl font-semibold text-gray-500">
            <h2>{data.customerName}</h2>
            <MoveRight
              size={20}
              className="text-app-tan top-6 right-6 stroke-3 transition"
            />
            <h2>
              {data.type == "driver" ? data.driverName : data.restaurantName}
            </h2>
          </div>
        </div>
        <button
          className="text-md my-4 rounded-lg bg-red-100 px-16 font-semibold text-red-900 shadow-md hover:bg-red-200 active:bg-red-300"
          onClick={onClick}
        >
          Resolve
        </button>
      </div>
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="bg-app-white/90 col-span-2 h-full rounded-2xl border-2 border-orange-100/80 px-10 py-4">
          <p className="text-app-tan font-medium">REPORTED BY</p>
          <h1 className="text-2xl font-semibold">{data.customerName}</h1>
          <p className="text-app-tan font-medium">
            Escalations waiting for admin reply.
          </p>
        </div>
        <ArrowRight
          size={60}
          className="text-app-tan border-app-tan rouneded-full col-span-1 row-span-1 self-center justify-self-center rounded-full border-4 stroke-2 p-1 transition"
        />
        <div className="bg-app-white/90 col-span-2 h-full rounded-2xl border-2 border-orange-100/80 px-10 py-4">
          <p className="text-app-tan font-medium">REPORTED BY</p>
          <h1 className="text-2xl font-semibold">{data.customerName}</h1>
          <p className="text-app-tan font-medium">
            Escalations waiting for admin reply.
          </p>
        </div>
      </div>
      <div className="bg-app-white/90 col-span-2 flex h-full justify-between rounded-2xl border-2 border-orange-100/80 px-10 py-4">
        <div className="flex flex-col gap-4">
          <p className="text-app-tan font-medium">ORDER ID</p>
          <h1 className="text-2xl font-semibold">{data.customerName}</h1>
          <p className="text-app-tan font-medium">
            Escalations waiting for admin reply.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="font-medium text-gray-500">ISSUE TYPE</h1>
          <div className="not-odd:text-md my-4 flex w-40 items-center justify-center rounded-lg bg-red-100 px-4 py-2 font-semibold text-red-900 shadow-md">
            <p>{data.status}</p>
          </div>
        </div>
      </div>

      <div className="bg-app-yellow mt-auto h-1 w-0 rounded-full transition-all duration-300" />
    </div>
  );
};
export function AdminPending() {
  const { open } = useResolveReport();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminReports(limit, offset);
      if (res.success) {
        const mappedReports: Report[] = res.data.map((r: AdminReport) => ({
          id: r.id,
          type: r.reported.role === "restaurant" ? "restaurant" : "driver",
          description: r.reason,
          dateSubmitted: new Date(r.created_at).toLocaleDateString(),
          status: "Pending",
          customerName: r.customer.user.email,
          restaurantName: r.reported.restaurant?.name,
          driverName: r.reported.driver?.name,
        }));
        setReports(mappedReports);
        setTotal(res.total ?? 0);
      } else {
        setError(res.message ?? "Failed to load reports");
      }
    } catch (err) {
      setError("Failed to load reports");
    }
    setLoading(false);
  }, [limit, offset]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const handleResolveClick = (reportId: number) => {
    // open confirm modal and resolve once confirmed
    open(async () => {
      try {
        const result: AdminGenericResponse = await resolveAdminReport(reportId);
        if (result?.success) {
          // Remove the resolved report from the list
          setReports((prev) => prev.filter((r) => r.id !== reportId));
          // Optionally refresh list or adjust total
          setTotal((t) => Math.max(0, t - 1));
        } else {
          console.error(result?.message ?? "Failed to resolve report");
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="flex w-full flex-col gap-8 p-8">
      <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/30 p-8 shadow-md">
        <div className="flex flex-col gap-2 px-8">
          <p className="text-app-tan font-medium">PENDING REPORTS</p>
          <h1 className="text-3xl font-semibold">Customer follow-ups</h1>
          <p className="text-app-tan font-medium">
            Escalations waiting for admin reply.
          </p>
        </div>
        <div className="flex w-full flex-col gap-8">
          {loading ? (
            <p>Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reports.length === 0 ? (
            <p>No pending reports.</p>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                className="w-full rounded-xl bg-white/80 shadow-xl"
              >
                <ReportCard
                  data={report}
                  onClick={() => handleResolveClick(report.id)}
                />
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {Math.floor(offset / limit) + 1} of{" "}
            {Math.max(1, Math.ceil(total / limit))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Per page:</label>
            <select
              className="rounded border p-1"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setOffset(0);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <button
              disabled={offset === 0}
              className="rounded border px-3 py-1"
              onClick={() => setOffset(Math.max(offset - limit, 0))}
            >
              Previous
            </button>
            <button
              disabled={offset + limit >= total}
              className="rounded border px-3 py-1"
              onClick={() => setOffset(offset + limit)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Truck, Users } from "lucide-react";
import { useParams } from "next/navigation";

import { getDriver } from "@/queries/driver";

export default function DashboardPage() {
  const params = useParams();
  const driverId = params.id as string;

  const { data: driverData, isLoading } = useQuery({
    queryKey: ["driver", driverId],
    queryFn: async () => getDriver(parseInt(driverId)),
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl flex-1 px-6 py-8">
        <section className="rounded-3xl bg-gradient-to-br from-[#fdf0d4] via-[#fde7bd] to-[#f8dca2] p-8 shadow-2xl ring-1 ring-[#f1d39a]">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#c7731b]">
              Welcome back, {driverData?.firstname} {driverData?.lastname}!
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  driverData?.is_available
                    ? "bg-[#d4edda] text-[#155724]"
                    : "bg-[#f8d7da] text-[#721c24]"
                }`}
              >
                {driverData?.is_available ? "Available" : "Unavailable"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  driverData?.verification_status === "approved"
                    ? "bg-[#d4edda] text-[#155724]"
                    : driverData?.verification_status === "pending"
                      ? "bg-[#fff3cd] text-[#856404]"
                      : "bg-[#f8d7da] text-[#721c24]"
                }`}
              >
                {driverData?.verification_status === "approved"
                  ? "Verified"
                  : driverData?.verification_status === "pending"
                    ? "Pending Verification"
                    : "Rejected"}
              </span>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)]">
            <div className="space-y-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#f2dcba]">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#d7891b]">
                  Delivery Performance
                </h3>
                <p className="text-xs text-[#b89463] uppercase">
                  January - June 2024
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-[#f9e1b9] p-8 text-center shadow-inner">
                <div className="relative h-56 w-56 rounded-full bg-gradient-to-br from-[#f7a23a] via-[#fdd15d] to-[#f36f36] shadow-lg">
                  <div className="absolute inset-8 rounded-full bg-white shadow-inner" />
                  <div className="absolute inset-16 flex items-center justify-center rounded-full bg-[#fef5dd] text-2xl font-semibold text-[#8f5a20]">
                    342
                  </div>
                </div>
                <p className="text-sm text-[#7a572f]">
                  Trending up by 8.5% this month · Showing total deliveries for
                  the last 6 months
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#f2dcba]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#d7891b]">
                      Earnings Trend
                    </h3>
                    <p className="text-xs text-[#b89463] uppercase">
                      January - June 2024
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#7a572f]">
                    <TrendingUp className="size-4 text-[#d7891b]" />
                    Trending up by 12.4% this month
                  </div>
                </div>
                <div className="mt-6 h-48 rounded-xl bg-gradient-to-r from-[#ffe6bd] via-[#fddca7] to-[#f9c47d] p-4 text-[#7a572f] shadow-inner">
                  <div className="h-full rounded-lg border border-dashed border-[#e9c48f] opacity-70" />
                </div>
                <p className="mt-4 text-xs text-[#7a572f]">
                  Showing total earnings for the last 6 months
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DashboardStat
                  label="Total Deliveries"
                  value="342"
                  detail="Completed this month"
                  trend="+8.5%"
                  accent="from-[#f8a348] to-[#f57b38]"
                />
                <DashboardStat
                  label="Total Earnings"
                  value="฿18,450"
                  detail="Up from last month"
                  trend="+12.4%"
                  accent="from-[#fddfa4] to-[#f9c572]"
                />
                <DashboardStat
                  label="Average Rating"
                  value="4.9★"
                  detail="Based on customer reviews"
                  trend="Excellent"
                  accent="from-[#fddfa4] to-[#f9c572]"
                />
                <DashboardStat
                  label="Active Orders"
                  value="3"
                  detail="Currently in progress"
                  trend="Real-time"
                  accent="from-[#f7e6c1] to-[#f2cd88]"
                />
                <DashboardStat
                  label="Response Time"
                  value="2.3 min"
                  detail="Average acceptance time"
                  trend="-0.5 min"
                  accent="from-[#f6e0b7] to-[#f3c67a]"
                />
                <DashboardStat
                  label="Success Rate"
                  value="98.5%"
                  detail="On-time delivery rate"
                  trend="+1.2%"
                  accent="from-[#f8a348] to-[#f57b38]"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#f2dcba]">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#d7891b]">
                Driver Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoItem
                  label="Vehicle"
                  value={driverData?.vehicle ?? "N/A"}
                />
                <InfoItem
                  label="License"
                  value={driverData?.licence ?? "N/A"}
                />
                <InfoItem
                  label="Fee Rate"
                  value={
                    driverData?.fee_rate ? `${driverData.fee_rate}%` : "N/A"
                  }
                />
                <InfoItem label="Phone" value={driverData?.tel ?? "N/A"} />
                <InfoItem
                  label="Status"
                  value={
                    driverData?.verification_status === "approved"
                      ? "Verified"
                      : driverData?.verification_status === "pending"
                        ? "Pending"
                        : "Rejected"
                  }
                />
                <InfoItem
                  label="Availability"
                  value={driverData?.is_available ? "Available" : "Unavailable"}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

type DashboardStatProps = {
  label: string;
  value: string;
  detail: string;
  trend: string;
  accent: string;
};

function DashboardStat({
  label,
  value,
  detail,
  trend,
  accent,
}: DashboardStatProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-[#f2dcba]">
      <div className="flex items-center justify-between gap-2 text-sm text-[#7a572f]">
        <span className="font-medium">{label}</span>
        <Truck className="size-4 text-[#d7891b]" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-[#8f5a20]">{value}</p>
          <p className="text-xs text-[#b89463]">{detail}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-[#f7e7c8] px-3 py-1 text-xs text-[#8f5a20]">
          <TrendingUp className="size-3" />
          {trend}
        </div>
      </div>
      <div
        className={`mt-4 h-2 rounded-full bg-gradient-to-r ${accent} shadow-inner`}
      />
      <div className="mt-3 flex items-center gap-2 text-xs text-[#7a572f]">
        <Users className="size-3" />
        Performance metric
      </div>
    </div>
  );
}

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-lg bg-[#fdf0d4] p-3">
      <p className="text-xs font-semibold tracking-wide text-[#a27a3a] uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm text-[#3b2f26]">{value}</p>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ForkKnifeCrossed,
  Flag,
  Car,
  Users2,
  MoveRight,
  ArrowRight,
} from "lucide-react";
import { useResolveReport } from "./ResolveReport";

import Image from "next/image";
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
  const handleResolveClick = () => {
    open();
  };
  const pendingReports: Report[] = [
    {
      id: 1,
      type: "driver",
      description: "My order arrived 2 hours late.",
      dateSubmitted: "2024-06-10",
      status: "Pending",
      customerName: "Alice Johnson",
      driverName: "Bob the Driver",
    },
    {
      id: 2,
      type: "restaurant",
      description: "I received the wrong item in my order.",
      dateSubmitted: "2024-06-11",
      status: "Pending",
      customerName: "Michael Smith",
      restaurantName: "Pasta Palace",
    },
  ];
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
          {pendingReports.map((report) => {
            return (
              <div
                key={report.id}
                className="w-full rounded-xl bg-white/80 shadow-xl"
              >
                <ReportCard data={report} onClick={handleResolveClick} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

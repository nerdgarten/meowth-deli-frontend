"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ForkKnifeCrossed, Flag, Car, Users2 } from "lucide-react";

import Image from "next/image";
const ReportCard = ({
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
export function AdminPending() {
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
        <div className="flex w-full grid-cols-2 grid-rows-2 gap-x-8 gap-y-4">
          <div className="w-full rounded-xl bg-white/80 shadow-xl">
            <ReportCard
              header={"Total users"}
              Icon={Users2}
              content={
                <p className="text-app-dark-brown text-3xl font-extrabold">
                  1,234
                </p>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ForkKnifeCrossed,
  Flag,
  Car,
  Users2,
  TriangleAlert,
} from "lucide-react";

import Image from "next/image";
const DeleteRoleCard = ({
  src,
  header,
  content,
  color = "yellow-100",
  onClick,
}: {
  src: string;
  header: string;
  content: string;
  color: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`w-full rounded-lg bg-${color} flex flex-col items-center justify-center gap-2 p-4`}
    >
      <h1 className="text-xl font-bold text-white">{header}</h1>
      <div className="flex gap-2">
        <Image src={src} alt="Eater Role" width={110} height={110} />
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-md font-medium text-white">{content}</p>
          <button
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-500 shadow-md hover:bg-white active:bg-white/80"
            onClick={onClick}
          >
            Tap to select
          </button>
        </div>
      </div>
    </div>
  );
};
export function AdminDelete() {
  return (
    <div className="flex w-full flex-col gap-8 p-8">
      <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/30 p-8 shadow-md">
        <div className="flex items-center justify-between px-8">
          <div className="flex flex-col gap-2">
            <p className="text-app-tan font-medium">CRITICAL ACTION</p>
            <h1 className="text-3xl font-semibold">Delete user warning</h1>
            <p className="text-app-tan font-medium">
              Soft deleting action require double confirmation.
            </p>
          </div>
          <TriangleAlert size={60} className="text-red-900" />
        </div>
        <div className="border-app-tan/30 grid w-full rounded-xl border bg-white/80 p-4 shadow-xl">
          <div className="flex flex-col gap-2 px-4">
            <p className="text-app-tan text-sm font-medium">ROLE FILTER</p>
            <h1 className="text-2xl font-semibold">
              Filter users by persona before deleting
            </h1>
            <p className="text-app-tan text-sm font-medium">
              Tap one of the cartoon badges to load only those accounts.
            </p>
          </div>
          <div className="mt-4 flex w-full items-center gap-6 px-4">
            <DeleteRoleCard
              src="/images/meowth-eating.webp"
              header="Customer"
              content="Close wallet credits, saved addresses, and promo streeams for diners"
              color="red-500"
              onClick={() => {}}
            />
            <DeleteRoleCard
              src="/images/meowth-driving.webp"
              header="Driver"
              content="Revoke fleet credentials and freeze active delivery slots."
              color="sky-400"
              onClick={() => {}}
            />
            <DeleteRoleCard
              src="/images/meowth-cooking.webp"
              header="Restaurant"
              content="Detach menus, earnings, and kitchen from network"
              color="yellow-500"
              onClick={() => {}}
            />
          </div>

          <p className="mt-4 px-4 text-sm font-light text-gray-500">
            Select one role to continue for deletion
          </p>
        </div>
      </div>
    </div>
  );
}

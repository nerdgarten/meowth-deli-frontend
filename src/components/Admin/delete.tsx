"use client";
import Link from "next/link";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Trash2, TriangleAlert } from "lucide-react";
import { useWarningDialog } from "./WarningDialog";

import Image from "next/image";
const DeleteRoleCard = ({
  src,
  header,
  content,
  color,
  onClick,
  active,
}: {
  src: string;
  header: string;
  content: string;
  color: "red" | "sky" | "yellow";
  onClick?: () => void;
  active?: boolean;
}) => {
  let mapColor = "";
  switch (color) {
    case "red":
      mapColor = "red-500";
      break;
    case "sky":
      mapColor = "sky-400";
      break;
    case "yellow":
      mapColor = "yellow-500";
      break;
    default:
      mapColor = "gray-500";
  }
  return (
    <div
      className={`w-full rounded-lg border-3 bg-${mapColor} flex flex-col items-center justify-center gap-2 p-4 ${
        active ? "border-black" : "border-transparent"
      }`}
    >
      <h1 className="text-xl font-bold text-white">{header}</h1>
      <div className="flex gap-2">
        <div className="relative h-35 w-45">
          <Image
            src={src}
            alt="Eater Role"
            width={110}
            height={110}
            className="absolute"
          />
        </div>
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
  const [select, setSelect] = useState<number>(0);
  const { open } = useWarningDialog();
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
              color="red"
              onClick={() => {
                setSelect(1);
              }}
              active={1 == select}
            />
            <DeleteRoleCard
              src="/images/meowth-driving.webp"
              header="Driver"
              content="Revoke fleet credentials and freeze active delivery slots."
              color="sky"
              onClick={() => {
                setSelect(2);
              }}
              active={2 == select}
            />
            <DeleteRoleCard
              src="/images/meowth-cooking.webp"
              header="Restaurant"
              content="Detach menus, earnings, and kitchen from network"
              color="yellow"
              onClick={() => {
                setSelect(3);
              }}
              active={3 == select}
            />
          </div>

          <p className="mt-4 px-4 text-sm font-light text-gray-500">
            Select one role to continue for deletion
          </p>
        </div>
        <div className="border-app-tan/30 bg-app-peanut/20 grid w-full rounded-xl border border-dashed p-4 shadow-xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold">Checklist before deletion</h1>
            <ul className="list-inside list-disc px-4 py-2">
              <li>Make sure the customer has no pending orders or payments.</li>
              <li>Check if any wallet balance or discount is left.</li>
              <li>Send a goodbye message to the customer automatically.</li>
            </ul>
          </div>
        </div>
        <button
          className="border-app-tan/30 flex w-full items-center justify-center gap-4 rounded-full border bg-red-800/90 px-8 py-2 text-white shadow-md hover:bg-red-900 active:bg-red-950"
          onClick={() => open("user", "Customer")}
        >
          <Trash2 />
          Delete
        </button>
      </div>
    </div>
  );
}

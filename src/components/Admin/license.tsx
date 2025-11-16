"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ForkKnifeCrossed, Flag, Car, Users2, FileArchive } from "lucide-react";

import Image from "next/image";

interface License {
  id: number;
  name: string;
  status: "Pending" | "Approved";
  // vehicleName: string;
  licenseId: string;
  documentUrl: string;
  vehicleName?: string;
  restaurantStyleName?: string;
}
interface DriverLicense extends License {
  vehicleName: string;
}
interface RestaurantLicense extends License {
  restaurantStyleName: string;
}

const ReportCard = ({
  Icon,
  data,
  onClick,
}: {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  data: License;
  onClick?: () => void;
}) => {
  return (
    <div className="group border-app-tan/30 relative flex h-full w-full flex-col gap-5 overflow-hidden rounded-xl border p-10 px-16 shadow-sm transition">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,192,82,0.25),transparent_60%)] opacity-0 mix-blend-overlay transition" />
      <h1 className="text-app-brown text-2xl font-bold tracking-tight">
        {data.name}
      </h1>
      <div className="flex justify-between gap-12">
        <div className="flex w-5/8 flex-col gap-4">
          <h2>
            {data.vehicleName
              ? data.vehicleName
              : data.restaurantStyleName
                ? data.restaurantStyleName
                : ""}
          </h2>
          <h3>{data.licenseId}</h3>
          <div className="my-8 w-full rounded-xl border-2 border-amber-900/40 bg-gray-200/30 py-8">
            Test
          </div>
          <div className="flex gap-4">
            <button
              className="text-md flex items-center justify-center rounded-full border-2 border-black/10 bg-white px-4 py-2 font-semibold whitespace-nowrap text-black/60 shadow-md hover:bg-gray-200/20 active:bg-gray-200/30"
              onClick={onClick}
            >
              <FileArchive size={20} className="mr-2" />
              View PDF
            </button>
            <button
              className="text-md flex items-center justify-center rounded-full border-2 border-black/10 bg-white px-4 py-2 font-semibold whitespace-nowrap text-black/60 shadow-md hover:bg-gray-200/20 active:bg-gray-200/30"
              onClick={onClick}
            >
              {/* <FileArchive size={20} className="mr-2" /> */}
              Approve
            </button>
            <button
              className="text-md flex items-center justify-center rounded-full border-2 border-black/10 bg-white px-4 py-2 font-semibold whitespace-nowrap text-black/60 shadow-md hover:bg-gray-200/20 active:bg-gray-200/30"
              onClick={onClick}
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
  const driverLicense: DriverLicense[] = [
    {
      id: 1,
      name: "John Doe",
      status: "Pending",
      vehicleName: "Toyota Camry",
      licenseId: "D12345",
      documentUrl: "#",
    },
    {
      id: 2,
      name: "Jane Smith",
      status: "Approved",
      vehicleName: "Honda Accord",
      licenseId: "D67890",
      documentUrl: "#",
    },
    {
      id: 3,
      name: "Mike Johnson",
      status: "Pending",
      vehicleName: "Ford Focus",
      licenseId: "D54321",
      documentUrl: "#",
    },
  ];

  const restaurantLicense: RestaurantLicense[] = [
    {
      id: 1,
      name: "Pizza Palace",
      status: "Pending",
      restaurantStyleName: "",
      licenseId: "",
      documentUrl: "#",
    },
    {
      id: 2,
      name: "Sushi World",
      status: "Approved",
      restaurantStyleName: "",
      licenseId: "",
      documentUrl: "#",
    },
    {
      id: 3,
      name: "Burger Barn",
      status: "Pending",
      restaurantStyleName: "",
      licenseId: "",
      documentUrl: "#",
    },
  ];

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
          {driverLicense.map((license) => (
            <div
              key={license.id}
              className="w-full rounded-xl bg-white/80 shadow-xl"
            >
              <ReportCard data={license} />
            </div>
          ))}
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
              <ReportCard data={license} />
            </div>
          ))}
        </div>
        <div className="flex w-full grid-cols-2 grid-rows-2 gap-x-8 gap-y-4"></div>
      </div>
    </div>
  );
}

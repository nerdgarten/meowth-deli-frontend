"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AddressCard } from "./addressCard";
import { useSettingFloatPanel } from "../SettingFloatPanelProvider";
import { AddAddressCard } from "./addAddressCard";
import {
  getCustomerLocations,
  getDefaultCustomerLocation,
  setDefaultCustomerLocation,
} from "@/libs/location";
import type { ICreateLocation } from "@/types/location";
import { de } from "zod/v4/locales";

export function CustomerAddressPage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <CustomerAddressList />
      </div>
    </main>
  );
}

export function CustomerAddressList() {
  const { data: profile } = useQuery({
    queryKey: ["address-profile"],
    queryFn: getCustomerLocations,
  });
  const [defaultLocation, setDefaultLocation] =
    useState<ICreateLocation | null>(null);

  const { data: defaultL } = useQuery({
    queryKey: ["default-customer-location"],
    queryFn: async () => {
      const response = await getDefaultCustomerLocation();
      return response;
    },
  });

  const [addressList, setAddressList] = useState<ICreateLocation[]>([]);
  const { showPanel, setShowCloseButton, hidePanel } = useSettingFloatPanel();

  useEffect(() => {
    if (profile) setAddressList(profile);
    if (defaultL !== undefined && defaultL !== null)
      setDefaultLocation(defaultL);
  }, [profile, defaultL]);

  if (profile === undefined || defaultL === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <section className="rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(64,56,49,0.08)]">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-start gap-4">
          <span className="text-app-dark-brown flex size-12 items-center justify-center rounded-full">
            <MapPin className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-app-dark-brown text-xl font-semibold">
              Delivery Addresses
            </h2>
            <p className="text-app-brown/80 mt-1 text-sm">
              Manage your delivery addresses for faster checkout.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          {addressList.length === 0 ? (
            <p className="text-app-brown/80">No addresses found.</p>
          ) : (
            addressList.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isDefault={address.id === defaultLocation?.id}
                setDefault={async (location: ICreateLocation) => {
                  await setDefaultCustomerLocation(String(location.id));
                  setDefaultLocation(location);
                }}
              />
            ))
          )}
        </div>
        <Button
          onClick={() => {
            setShowCloseButton(true);
            showPanel(
              <AddAddressCard
                type="customer"
                onClose={(data: ICreateLocation) => {
                  setAddressList((prev) => [...prev, data]);
                  hidePanel();
                }}
              />
            );
          }}
          type="submit"
          className="bg-app-dark-brown mt-16 w-full rounded-xl text-sm font-semibold text-white shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-[#2F2721] active:bg-[#2c2621]"
        >
          + Add New Address
        </Button>
      </div>
    </section>
  );
}

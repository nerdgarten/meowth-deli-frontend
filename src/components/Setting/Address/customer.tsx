"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { queryCustomerProfile } from "@/queries/profile";
import type { ICustomerProfile } from "@/types/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditProfileFormSchema,
  updateCustomerProfileMutation,
} from "@/queries/profile";
import { AddressCard } from "./addressCard";

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
      </div>
    </section>
  );
}

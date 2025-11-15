"use client";

import { useForm, type FieldErrors } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import {
  VehicleFormSchema,
  queryVehicle,
  updateDriverProfileMutation,
  updateVehicleProfileMutation,
} from "@/libs/driver";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { IVehicle } from "@/types/user";

const ChangePasswordFormSchema = z.object({
  vehicleType: z
    .string()
    .min(1, "Please enter your Vehicle Type.")
    .max(128, "Vehicle Type is too long."),
  numberPlate: z
    .string()
    .min(1, "Your Number is Wrong.")
    .max(8, "Your Number is Wrong."),
  description: z
    .string()
    .min(1, "Please enter your Description.")
    .max(128, "Description is too long."),
});

type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;

const changePassword = async (_payload: ChangePasswordFormValues) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
};

export function DriverVehiclePage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <DriverVehicleFormCard />
      </div>
    </main>
  );
}

export function DriverVehicleFormCard() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(64,56,49,0.08)]">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-start gap-4">
          <span className="text-app-dark-brown flex size-12 items-center justify-center rounded-full">
            <MapPin className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-app-dark-brown text-xl font-semibold">
              Your vehicle
            </h2>
            <p className="text-app-brown/80 mt-1 text-sm">
              Your Vehicle Type is now here.
            </p>
          </div>
        </div>
        <DriverVehicleForm />
      </div>
    </section>
  );
}

// ...existing imports...

const DriverVehicleForm = () => {
  const { data: profileData } = useQuery<IVehicle>({
    queryKey: ["vehicle-profile"],
    queryFn: queryVehicle,
  });

  const vehicleForm = useForm<z.infer<typeof VehicleFormSchema>>({
    resolver: zodResolver(VehicleFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: profileData ?? {
      vehicle: "",
      licence: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      vehicleForm.reset(profileData);
    }
  }, [profileData, vehicleForm]);

  const handleMutation = useMutation({
    mutationFn: updateVehicleProfileMutation,
    onSuccess: () => {
      toast.success("Vehicle updated.");
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    },
  });

  const onSubmit = (data: z.infer<typeof VehicleFormSchema>) => {
    handleMutation.mutate(data);
  };

  return (
    <Form {...vehicleForm}>
      <form
        className="w-full rounded-2xl px-6 py-5 shadow-none"
        onSubmit={vehicleForm.handleSubmit(onSubmit)}
      >
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <FormField
              control={vehicleForm.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem className="text-app-dark-brown flex w-60 flex-col space-y-2 text-sm font-semibold">
                  <FormLabel>Vehicle Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:ring-2 focus:outline-none"
                      placeholder="Vehicle Type"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={vehicleForm.control}
              name="licence"
              render={({ field }) => (
                <FormItem className="text-app-dark-brown flex w-60 flex-col space-y-2 text-sm font-semibold">
                  <FormLabel>Plate Number</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:ring-2 focus:outline-none"
                      placeholder="Plate Number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex w-full justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="text-app-dark-brown hover:bg-app-brown/10 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition"
            disabled={handleMutation.isPending}
            onClick={() =>
              vehicleForm.reset(profileData ?? { vehicle: "", licence: "" })
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-app-dark-brown rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-[#2F2721] active:bg-[#2c2621]"
            disabled={handleMutation.isPending}
          >
            {handleMutation.isPending ? "Saving..." : "Save Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

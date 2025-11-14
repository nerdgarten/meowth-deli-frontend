"use client";

import { useForm, type FieldErrors } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
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

const DriverVehicleForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const vehicleForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      vehicleType: "",
      numberPlate: "",
      description: "",
    },
  });

  const securityMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated successfully!");
      vehicleForm.reset();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Password update failed. Please try again.");
      }
    },
  });

  const onSubmit = vehicleForm.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      // replace with real API call
      console.log("submit payload", { ...data });
      // await api.saveAddress({ ...data, default: setAsDefault });

      vehicleForm.reset();
    } catch (err) {
      console.error(err);
      // optionally show toast / error state
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Form {...vehicleForm}>
      <form
        className="w-full rounded-2xl px-6 py-5 shadow-none"
        onSubmit={onSubmit}
      >
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <FormField
              control={vehicleForm.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem className="text-app-dark-brown flex w-60 flex-col space-y-4 text-lg font-semibold">
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
              name="numberPlate"
              render={({ field }) => (
                <FormItem className="text-app-dark-brown flex w-60 flex-col space-y-4 text-lg font-semibold">
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

            <FormField
              control={vehicleForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="text-app-dark-brown flex w-full flex-col space-y-4 text-lg font-semibold">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={4}
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 flex w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:ring-2 focus:outline-none"
                      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-app-dark-brown rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-[#2F2721] active:bg-[#2c2621]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

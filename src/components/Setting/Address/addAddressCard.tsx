import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AddAddressSchema = z.object({
  address: z
    .string()
    .min(1, "Please enter your Address.")
    .max(128, "Address is too long."),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
import toast from "react-hot-toast";

import {
  createCustomerLocation,
  createRestaurantLocation,
} from "@/libs/location";
import type { ICreateLocation } from "@/types/location";
type AddAddressFormValues = z.infer<typeof AddAddressSchema>;

export function AddAddressCard({
  type,
  onClose,
}: {
  type: "customer" | "restaurant";
  onClose: (data: ICreateLocation) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);

  const addressForm = useForm<AddAddressFormValues>({
    resolver: zodResolver(AddAddressSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      address: "",
    },
  });
  const getCurrentPosition = (
    opts?: PositionOptions
  ): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, opts);
    });

  const onSubmit = async (data: z.infer<typeof AddAddressSchema>) => {
    setIsSubmitting(true);
    console.log("Submitting address:", data);
    try {
      // replace with real API call
      console.log("submit payload", { ...data, default: setAsDefault });

      addressForm.reset();

      try {
        console.log("Getting current position...");
        const pos = await getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
        console.log("Position obtained:", pos);
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        if (latitude === undefined || longitude === undefined)
          throw new Error("No coordinates found");
        data.latitude = latitude!;
        data.longitude = longitude!;
        let d = null;
        console.log("Creating location for type:", type);
        if (type === "customer") {
          console.log("Creating customer location...");
          d = await createCustomerLocation({
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
          });
        } else {
          d = await createRestaurantLocation({
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }

        onClose(d);
      } catch (err) {
        toast.error(
          "Could not get your location. Please enter address manually."
        );
        console.error("Error getting location:", err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...addressForm}>
      <form
        className="w-200 rounded-2xl px-6 py-5 shadow-none"
        onSubmit={addressForm.handleSubmit(onSubmit, (errs) => {
          console.log("validation errors:", errs);
        })}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-4">
              <FormField
                control={addressForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="text-app-dark-brown flex w-60 flex-col space-y-4 text-lg font-semibold">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <textarea
                        rows={3}
                        {...field}
                        className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:ring-2 focus:outline-none"
                        placeholder="Address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                className="text-app-dark-brown hover:bg-app-brown/10 shad rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition"
                onClick={() => setSetAsDefault((s) => !s)}
              >
                {setAsDefault ? "Default ✓" : "Set as Default"}
              </Button>
            </div>
            <div className="h-80 w-1/2 rounded-2xl bg-amber-200">test</div>
          </div>

          <div className="flex w-full justify-end gap-4">
            <Button
              type="submit"
              className="bg-app-dark-brown rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-[#2F2721] active:bg-[#2c2621]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

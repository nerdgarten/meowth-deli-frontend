import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AddAddressSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your name Address.")
    .max(128, "Password is too long."),
  number: z
    .string()
    .min(10, "Your Number is Wrong.")
    .max(10, "Your Number is Wrong."),
  address: z
    .string()
    .min(1, "Please enter your Address.")
    .max(128, "Address is too long."),
});

type AddAddressFormValues = z.infer<typeof AddAddressSchema>;

export function AddAddressCard({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);

  const addressForm = useForm<AddAddressFormValues>({
    resolver: zodResolver(AddAddressSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      number: "",
      address: "",
    },
  });

  const onSubmit = addressForm.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      // replace with real API call
      console.log("submit payload", { ...data, default: setAsDefault });
      // await api.saveAddress({ ...data, default: setAsDefault });

      addressForm.reset();
      onClose();
    } catch (err) {
      console.error(err);
      // optionally show toast / error state
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Form {...addressForm}>
      <form
        className="w-200 rounded-2xl px-6 py-5 shadow-none"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <FormField
                control={addressForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="text-app-dark-brown flex w-60 flex-col space-y-4 text-lg font-semibold">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:ring-2 focus:outline-none"
                        placeholder="Label (e.g., Home, Work)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="text-app-dark-brown flex w-60 flex-col space-y-4 text-lg font-semibold">
                    <FormLabel>Number</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:ring-2 focus:outline-none"
                        placeholder="Number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="text-app-dark-brown flex w-60 flex-col space-y-4 text-lg font-semibold">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition focus:ring-2 focus:outline-none"
                        placeholder="Address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="text-app-dark-brown hover:bg-app-brown/10 shad rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition"
              onClick={onClose}
            >
              Set as Default
            </Button>
          </div>

          <div className="flex w-full justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="text-app-dark-brown hover:bg-app-brown/10 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition"
              onClick={onClose}
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
        </div>
      </form>
    </Form>
  );
}

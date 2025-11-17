"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { type FieldErrors,useForm } from "react-hook-form";
import toast from "react-hot-toast";
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

const ChangePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Please enter your current password.")
      .max(128, "Password is too long."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(128, "Password is too long."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password.")
      .max(128, "Password is too long."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;

const changePassword = async (_payload: ChangePasswordFormValues) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
};

export function RestaurantSecurityPage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <RestaurantSecurityFormCard />
      </div>
    </main>
  );
}

export function RestaurantSecurityFormCard() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(64,56,49,0.08)]">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-start gap-4">
          <span className="text-app-dark-brown flex size-12 items-center justify-center rounded-full">
            <Lock className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-app-dark-brown text-xl font-semibold">
              Security Settings
            </h2>
            <p className="text-app-brown/80 mt-1 text-sm">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>
        <RestaurantSecurityForm />
      </div>
    </section>
  );
}

const RestaurantSecurityForm = () => {
  const securityForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const securityMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated successfully!");
      securityForm.reset();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Password update failed. Please try again.");
      }
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) =>
    securityMutation.mutate(data);

  const onInvalid = (errors: FieldErrors<ChangePasswordFormValues>) => {
    const message = errors.confirmPassword?.message;
    if (message === "Passwords do not match.") {
      toast.error(message);
    }
  };

  return (
    <Form {...securityForm}>
      <form
        className="mt-10 space-y-10"
        onSubmit={securityForm.handleSubmit(onSubmit, onInvalid)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={securityForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-app-dark-brown text-sm font-semibold">
                  Current Password
                </FormLabel>
                <FormControl>
                  <input
                    type="password"
                    className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                    {...field}
                    autoComplete="current-password"
                    placeholder="Enter current password"
                  />
                </FormControl>
                <FormMessage className="text-app-brown/70 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={securityForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-app-dark-brown text-sm font-semibold">
                  New Password
                </FormLabel>
                <FormControl>
                  <input
                    type="password"
                    className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                    {...field}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                  />
                </FormControl>
                <FormMessage className="text-app-brown/70 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={securityForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-app-dark-brown text-sm font-semibold">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <input
                    type="password"
                    className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                    {...field}
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                  />
                </FormControl>
                <FormMessage className="text-app-brown/70 text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            type="submit"
            onClick={() => securityForm.reset()}
            variant="outline"
            disabled={securityMutation.isPending}
            className="rounded-xl bg-white px-8 py-5 text-sm font-semibold text-black shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-gray-200 active:scale-95 active:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-app-dark-brown rounded-xl px-8 py-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-[#2F2721] active:scale-95 active:bg-[#2c2621]"
            disabled={securityMutation.isPending}
          >
            {securityMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { UserRound, ShoppingBag, Clock } from "lucide-react";

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
import { email, number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditProfileFormSchema,
  updateCustomerProfileMutation,
} from "@/queries/profile";

const RestaurantProfileSchema = z.object({
  restaurantName: z
    .string()
    .min(1, "Please enter your Restaurant name.")
    .max(128, "Restaurant name is too long."),
  description: z
    .string()
    .min(8, "Please enter at least 8 characters.")
    .max(128, "Description is too long."),
  address: z
    .string()
    .min(1, "Please enter your Address.")
    .max(128, "Address is too long."),
  email: z
    .string()
    .min(1, "Please enter your Email.")
    .max(128, "Email is too long.")
    .email("Please enter a valid Email."),
  number: z
    .string()
    .min(10, "Your Number is Wrong.")
    .max(10, "Your Number is Wrong."),
  website: z
    .string()
    .min(1, "Please enter your Website.")
    .max(128, "Website is too long."),
});

export function RestaurantProfilePage() {
  return (
    <main className="bg-app-background flex h-full w-full flex-col items-center pt-8">
      <div className="w-full px-20">
        <RestaurantProfileFormCard />
      </div>
    </main>
  );
}

export function RestaurantProfileFormCard() {
  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="col-span-1 row-span-1 w-full rounded-2xl bg-white p-4 px-10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-app-dark-brown flex size-12 items-center justify-center rounded-full">
            <ShoppingBag className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-app-dark-brown text-xl font-semibold">
              Store Profile
            </h2>
          </div>
        </div>
        <p className="text-app-brown/80 mt-1 text-sm">
          Update your personal information.
        </p>
        <RestaurantProfileForm />
      </div>
      <div className="col-span-1 row-span-1 w-full rounded-2xl bg-white p-4 px-10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-app-dark-brown flex size-12 items-center justify-center rounded-full">
            <Clock className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-app-dark-brown text-xl font-semibold">
              Opening Hours
            </h2>
          </div>
        </div>
        <p className="text-app-brown/80 mt-1 text-sm">
          Set your restaurant's operating hours for each day
        </p>
        <RestaurantDateForm />
      </div>
    </section>
  );
}
const RestaurantProfileForm = () => {
  const { data: profileData } = useQuery<ICustomerProfile>({
    queryKey: ["customer-profile"],
    queryFn: async () => {
      const profile = await queryCustomerProfile();
      return profile;
    },
  });

  const restaurantProfileForm = useForm<
    z.infer<typeof RestaurantProfileSchema>
  >({
    resolver: zodResolver(RestaurantProfileSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      restaurantName: "",
      description: "",
      address: "",
      email: "",
      number: "",
      website: "",
    },
  });

  // useEffect(() => {
  //   if (!profileData) {
  //     return;
  //   }
  //   restaurantProfileSchema.reset(profileData);
  // }, [profileData, restaurantProfileSchema]);

  const profileMutation = useMutation({
    mutationFn: updateCustomerProfileMutation,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Profile update failed! Please try again.");
      }
    },
  });

  const onSubmit = (data: z.infer<typeof RestaurantProfileSchema>) => {
    console.log("Submitted data:", data);
  };
  // profileMutation.mutate(data);

  // State for file upload
  const [uploading, setUploading] = useState(false);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3030/file/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      toast.success("File uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...restaurantProfileForm}>
      <form
        className="mt-10 w-full space-y-10"
        onSubmit={restaurantProfileForm.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="mt-6 w-full">
          <div className="flex w-full items-center gap-4 border-b-2 border-gray-500/40 pb-4">
            <div className="aspect-square w-5/11 rounded-lg bg-amber-200">
              test
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="text-app-dark-brown file:bg-app-dark-brown mt-2 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-white hover:file:bg-[#2F2721]"
              disabled={uploading}
            />
          </div>
        </div>
        <div className="mt-6">
          <FormLabel className="text-app-dark-brown text-sm font-semibold">
            Verification
          </FormLabel>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="text-app-dark-brown file:bg-app-dark-brown mt-2 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-white hover:file:bg-[#2F2721]"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-app-brown/70 mt-2 text-sm">Uploading...</p>
          )}
        </div>
        <div className="grid grid-cols-2 grid-rows-5 gap-6">
          <div className="col-span-2 row-span-1">
            <FormField
              control={restaurantProfileForm.control}
              name="restaurantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-app-dark-brown text-sm font-semibold">
                    Restaurant Name
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                      {...field}
                      placeholder="John"
                    />
                  </FormControl>
                  <FormMessage className="text-app-brown/70 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 row-span-1">
            <FormField
              control={restaurantProfileForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-app-dark-brown text-sm font-semibold">
                    About Your Restaurant
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                      {...field}
                      placeholder="Doe"
                    />
                  </FormControl>
                  <FormMessage className="text-app-brown/70 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 row-span-1">
            <FormField
              control={restaurantProfileForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-app-dark-brown text-sm font-semibold">
                    Address
                  </FormLabel>
                  <FormControl>
                    <input
                      type="tel"
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                      {...field}
                      placeholder="+66 12 345 6789"
                    />
                  </FormControl>
                  <FormMessage className="text-app-brown/70 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 row-span-1">
            <FormField
              control={restaurantProfileForm.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-app-dark-brown text-sm font-semibold">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <input
                      type="tel"
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                      {...field}
                      placeholder="+66 12 345 6789"
                    />
                  </FormControl>
                  <FormMessage className="text-app-brown/70 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 row-span-1">
            <FormField
              control={restaurantProfileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-app-dark-brown text-sm font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <input
                      type="tel"
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                      {...field}
                      placeholder="+66 12 345 6789"
                    />
                  </FormControl>
                  <FormMessage className="text-app-brown/70 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 row-span-1">
            <FormField
              control={restaurantProfileForm.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-app-dark-brown text-sm font-semibold">
                    Website
                  </FormLabel>
                  <FormControl>
                    <input
                      type="tel"
                      className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                      {...field}
                      placeholder="+66 12 345 6789"
                    />
                  </FormControl>
                  <FormMessage className="text-app-brown/70 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => restaurantProfileForm.reset()}
            className="text-app-dark-brown hover:bg-app-brown/10 rounded-xl border-black/10 bg-white px-6 py-3 text-sm font-semibold shadow-none transition"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-app-dark-brown rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-[#2F2721]"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

const RestaurantDateForm = () => {
  const { data: profileData } = useQuery<ICustomerProfile>({
    queryKey: ["customer-profile"],
    queryFn: async () => {
      const profile = await queryCustomerProfile();
      return profile;
    },
  });
  const day_in_week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const customerProfileForm = useForm<z.infer<typeof EditProfileFormSchema>>({
    resolver: zodResolver(EditProfileFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: profileData ?? {
      firstname: "",
      lastname: "",
      tel: "",
    },
  });

  useEffect(() => {
    if (!profileData) {
      return;
    }
    customerProfileForm.reset(profileData);
  }, [profileData, customerProfileForm]);

  const profileMutation = useMutation({
    mutationFn: updateCustomerProfileMutation,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Profile update failed! Please try again.");
      }
    },
  });

  const onSubmit = (data: z.infer<typeof EditProfileFormSchema>) =>
    profileMutation.mutate(data);

  // State for file upload
  const [uploading, setUploading] = useState(false);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3030/file/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      toast.success("File uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...customerProfileForm}>
      <form
        className="mt-10 space-y-10"
        onSubmit={customerProfileForm.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex h-full flex-col justify-between gap-2">
          <div className="flex flex-col gap-2">
            {day_in_week.map((day) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-app-dark-brown text-sm font-medium">
                  {day}
                </span>

                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="accent-app-dark-brown border-app-brown/20 bg-app-white focus:ring-app-dark-brown/20 h-20 w-20 rounded-md"
                  />
                  <input
                    type="time"
                    className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-2 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                    placeholder="09:00 AM"
                  />
                  <span className="text-app-dark-brown text-sm font-medium">
                    -
                  </span>
                  <input
                    type="time"
                    className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 w-full rounded-xl border px-4 py-2 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                    placeholder="05:00 PM"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => customerProfileForm.reset()}
              className="text-app-dark-brown hover:bg-app-brown/10 rounded-xl border-black/10 bg-white px-6 py-3 text-sm font-semibold shadow-none transition"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-app-dark-brown rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-[#2F2721]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

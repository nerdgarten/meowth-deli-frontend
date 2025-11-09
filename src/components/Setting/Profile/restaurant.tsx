"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { UserRound } from "lucide-react";

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

export function RestaurantProfilePage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <RestaurantProfileFormCard />
      </div>
    </main>
  );
}

export function RestaurantProfileFormCard() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(64,56,49,0.08)]">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-start gap-4">
          <span className="text-app-dark-brown flex size-12 items-center justify-center rounded-full">
            <UserRound className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-app-dark-brown text-xl font-semibold">
              Profile Information
            </h2>
            <p className="text-app-brown/80 mt-1 text-sm">
              Update your personal information.
            </p>
          </div>
        </div>
        <CustomerProfileForm />
      </div>
    </section>
  );
}

const CustomerProfileForm = () => {
  const { data: profileData } = useQuery<ICustomerProfile>({
    queryKey: ["customer-profile"],
    queryFn: async () => {
      const profile = await queryCustomerProfile();
      return profile;
    },
  });

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={customerProfileForm.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-app-dark-brown text-sm font-semibold">
                  First Name
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

          <FormField
            control={customerProfileForm.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-app-dark-brown text-sm font-semibold">
                  Last Name
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

          <FormField
            control={customerProfileForm.control}
            name="tel"
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

        {/* File Upload Section */}
        <div className="mt-6">
          <FormLabel className="text-app-dark-brown text-sm font-semibold">
            Upload File (PDF)
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
      </form>
    </Form>
  );
};

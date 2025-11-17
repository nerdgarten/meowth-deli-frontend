"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DriverProfileFormSchema,
  queryDriverProfile,
  updateDriverProfileMutation,
} from "@/libs/driver";
<<<<<<< HEAD
=======
import { driverUploadFile } from "@/queries/file";
>>>>>>> 395ec7da9f5a72d7d27ae8deb89c416d10faca98
import { queryCustomerProfile } from "@/queries/profile";
import type { IDriverProfile } from "@/types/user";
import type { ICustomerProfile } from "@/types/user";

export function DriverProfilePage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <DriverProfileFormCard />
      </div>
    </main>
  );
}

export function DriverProfileFormCard() {
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
  const { data: profileData } = useQuery<IDriverProfile>({
    queryKey: ["driver-profile"],
    queryFn: async () => {
      const profile = await queryDriverProfile();
      return profile;
    },
  });

  const driverProfileForm = useForm<z.infer<typeof DriverProfileFormSchema>>({
    resolver: zodResolver(DriverProfileFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: profileData ?? {
      firstname: "",
      lastname: "",
      tel: "",
      profilePicture: null,
    },
  });

  useEffect(() => {
    if (!profileData) {
      return;
    }
    driverProfileForm.reset(profileData);
  }, [profileData, driverProfileForm]);

  const drivereMutation = useMutation({
    mutationFn: updateDriverProfileMutation,
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

  const onSubmit = (data: z.infer<typeof DriverProfileFormSchema>) => {
    const { profilePicture, firstname, lastname, tel } = data;
    drivereMutation.mutate({
      firstname,
      lastname,
      tel,
      profilePicture, // image can be File or string (depending on your schema)
    });
  };

  // State for file upload
  const [uploading, setUploading] = useState(false);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      await driverUploadFile(file);
      toast.success("File uploaded successfully!");
    } catch {
      toast.error( "File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const imageValue = driverProfileForm.watch("profilePicture");
  const [preview, setPreview] = useState<string>("");
  useEffect(() => {
    if (!imageValue) {
      // fallback to existing backend URL if present
      setPreview(
        typeof profileData?.image === "string" ? profileData.image : ""
      );
      return;
    }
    if (typeof imageValue === "string") {
      setPreview(imageValue);
      return;
    }
    // File selected
    const url = URL.createObjectURL(imageValue);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageValue, profileData?.image]);

  return (
    <Form {...driverProfileForm}>
      <form
        className="mt-10 space-y-10"
        onSubmit={driverProfileForm.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={driverProfileForm.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-app-dark-brown text-sm font-semibold">
                  Profile Picture
                </FormLabel>
                <div className="flex items-center gap-4 border-b-2 border-gray-500/40 pb-4">
                  <div className="size-20 overflow-hidden rounded-lg bg-gray-200">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="size-20 object-cover"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        field.onChange(f);
                      }}
                      className="text-app-dark-brown file:bg-app-dark-brown mt-2 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-white hover:file:bg-[#2F2721]"
                    />
                  </FormControl>
                  {field.value && typeof field.value !== "string" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        driverProfileForm.setValue("profilePicture", null)
                      }
                      className="rounded-lg"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <FormMessage className="text-app-brown/70 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={driverProfileForm.control}
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
            control={driverProfileForm.control}
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
            control={driverProfileForm.control}
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
            onChange={async(e) => {
              const file = e.target.files?.[0];
              if (file) await handleFileUpload(file);
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
            onClick={() => driverProfileForm.reset()}
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

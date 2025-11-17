"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Clock,ShoppingBag, UserRound } from "lucide-react";
import Image from "next/image";
import { useEffect,useState } from "react";
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
  queryRestaurantProfile,
  RestaurantProfileFormSchema,
  updateRestaurantProfileMutation,
} from "@/libs/restaurant";
import { restaurantUploadFile } from "@/queries/file";
import { queryCustomerProfile } from "@/queries/profile";
import type { ICustomerProfile, IRestaurantProfile } from "@/types/user";

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
      <div className="col-span-2 row-span-1 w-full rounded-2xl bg-white p-4 px-10">
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
    </section>
  );
}
const RestaurantProfileForm = () => {
  const { data: restaurantData } = useQuery<IRestaurantProfile>({
    queryKey: ["restaurant-profile"],
    queryFn: async () => {
      const profile = await queryRestaurantProfile();
      return profile;
    },
  });

  const restaurantProfileForm = useForm<
    z.infer<typeof RestaurantProfileFormSchema>
  >({
    resolver: zodResolver(RestaurantProfileFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: restaurantData ?? {
      name: "",
      detail: "",
      tel: "",
      is_available: false,
      restaurantBanner: null,
    },
  });

  // useEffect(() => {
  //   if (!profileData) {
  //     return;
  //   }
  //   restaurantProfileSchema.reset(profileData);
  // }, [profileData, restaurantProfileSchema]);

  const restaurantMutation = useMutation({
    mutationFn: updateRestaurantProfileMutation,
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

  const onSubmit = (data: z.infer<typeof RestaurantProfileFormSchema>) => {
    const { name, detail, tel, is_available, restaurantBanner } = data;
    restaurantMutation.mutate({
      name,
      detail,
      tel,
      is_available,
      restaurantBanner,
    });
  };
  // profileMutation.mutate(data);

  // State for file upload
  const [uploading, setUploading] = useState(false);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      await restaurantUploadFile(file);
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("File upload failed!");
    } finally {
      setUploading(false);
    }
  };
  const imageValue = restaurantProfileForm.watch("restaurantBanner");
  const [preview, setPreview] = useState<string>("");
  useEffect(() => {
    if (!imageValue) {
      // fallback to existing backend URL if present
      setPreview(
        typeof restaurantData?.banner === "string" ? restaurantData.banner : ""
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
  }, [imageValue, restaurantData?.banner]);
  return (
    <Form {...restaurantProfileForm}>
      <form
        className="mt-10 w-full space-y-10"
        onSubmit={restaurantProfileForm.handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          control={restaurantProfileForm.control}
          name="restaurantBanner"
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
                      restaurantProfileForm.setValue("restaurantBanner", null)
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

        <div className="grid grid-cols-2 grid-rows-5 gap-6">
          <div className="col-span-2 row-span-1">
            <FormField
              control={restaurantProfileForm.control}
              name="name"
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
                      placeholder={restaurantData?.name ?? "Restaurant Name"}
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
              name="detail"
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
                      placeholder={restaurantData?.detail ?? "Description"}
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
                      placeholder={restaurantData?.tel ?? "+668888888"}
                    />
                  </FormControl>
                  <FormMessage className="text-app-brown/70 text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-6">
            <FormLabel className="text-app-dark-brown text-sm font-semibold">
              Verification
            </FormLabel>
            <input
              type="file"
              accept="application/pdf"
              onChange={async (e) => {
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

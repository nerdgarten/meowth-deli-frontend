"use client";

import {
  Camera,
  ClipboardList,
  MapPin,
  Settings,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/libs/utils";

const navigationTabs = [
  {
    id: "profile",
    label: "Profile",
    href: "/customer/profile",
    icon: UserRound,
  },
  {
    id: "addresses",
    label: "Addresses",
    href: "/customer/addresses",
    icon: MapPin,
  },
  {
    id: "preferences",
    label: "Preferences",
    href: "/customer/preferences",
    icon: Settings,
  },
  {
    id: "security",
    label: "Security",
    href: "/customer/security",
    icon: ShieldCheck,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/customer/orders",
    icon: ClipboardList,
  },
] as const;

const defaultProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+66 12 345 6789",
  bio: "Food enthusiast who loves trying new cuisines and exploring local restaurants.",
} as const;

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
};

export default function CustomerProfilePage() {
  const pathname = usePathname();
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: defaultProfile.firstName,
      lastName: defaultProfile.lastName,
      email: defaultProfile.email,
      phone: defaultProfile.phone,
      bio: defaultProfile.bio,
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    console.log("Profile submitted", values);
  };

  return (
    <main className="bg-app-background pt-8 pb-12">
      <div className="mx-auto mt-[4rem] w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(64,56,49,0.08)]">
          <header className="border-b border-black/5 px-4 pt-6 pb-4 md:px-8">
            <h1 className="sr-only">Customer Profile</h1>
            <nav aria-label="Profile sections">
              <ul className="flex flex-wrap gap-3">
                {navigationTabs.map((tab) => {
                  const isActive =
                    tab.href === "/customer/profile"
                      ? pathname === tab.href
                      : pathname.startsWith(tab.href);
                  const Icon = tab.icon;

                  return (
                    <li key={tab.id}>
                      <Link
                        href={tab.href}
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition",
                          isActive
                            ? "bg-app-dark-brown border-transparent text-white shadow-[0_10px_24px_rgba(64,56,49,0.18)]"
                            : "text-app-brown/70 hover:border-app-brown/30 hover:bg-app-brown/10 hover:text-app-dark-brown border-black/10 bg-white"
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                        <span>{tab.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </header>

          <div className="px-4 py-6 md:px-8 md:py-8">
            <div className="flex flex-wrap items-start gap-4">
              <span className="bg-app-dark-brown/10 text-app-dark-brown flex size-12 items-center justify-center rounded-full">
                <UserRound className="size-6" aria-hidden />
              </span>
              <div>
                <h2 className="text-app-dark-brown text-xl font-semibold">
                  Profile Information
                </h2>
                <p className="text-app-brown/80 mt-1 text-sm">
                  Update your personal information and profile picture.
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                className="mt-10 space-y-10"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-app-brown/10 text-app-dark-brown border-app-brown/30 flex size-28 items-center justify-center rounded-2xl border border-dashed">
                      <Camera className="size-8" aria-hidden />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-app-dark-brown hover:bg-app-dark-brown rounded-xl border-black/10 bg-white px-5 py-3 text-sm font-semibold shadow-[0_12px_28px_rgba(64,56,49,0.12)] transition hover:text-white"
                    >
                      <UploadCloud className="size-4" aria-hidden />
                      Upload Photo
                    </Button>
                  </div>
                  <p className="text-app-brown/60 text-xs">
                    Recommended: JPG or PNG, up to 2MB.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-app-dark-brown text-sm font-semibold">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            placeholder="John"
                            className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-app-brown/70 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-app-dark-brown text-sm font-semibold">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            placeholder="Doe"
                            className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-app-brown/70 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-app-dark-brown text-sm font-semibold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            placeholder="john.doe@example.com"
                            className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-app-brown/70 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-app-dark-brown text-sm font-semibold">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <input
                            type="tel"
                            placeholder="+66 12 345 6789"
                            className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-app-brown/70 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-app-dark-brown text-sm font-semibold">
                          Bio / Notes
                        </FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Food enthusiast who loves trying new cuisines..."
                            rows={4}
                            className="border-app-brown/20 placeholder:text-app-brown/40 text-app-dark-brown bg-app-white focus:border-app-dark-brown focus:ring-app-dark-brown/20 rounded-xl border px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus:ring-2 focus:outline-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-app-brown/70 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
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
          </div>
        </section>
      </div>
    </main>
  );
}

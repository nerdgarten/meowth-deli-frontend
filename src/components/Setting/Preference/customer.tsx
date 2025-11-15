"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllergy, updateAllergy } from "@/libs/customer";

import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";

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

export function CustomerPreferencePage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
        <CustomerPreference />
      </div>
    </main>
  );
}

export function CustomerPreference() {
  const dietaries = [
    "gluten",
    "peanuts",
    "seafood",
    "dairy",
    "eggs",
    "soy",
    "tree_nuts",
    "wheat",
    "fish",
    "shellfish",
  ];
  const [dietaryData, setDietaryData] = useState(
    () =>
      new Map<string, boolean>([
        ["gluten", false],
        ["peanuts", true],
        ["seafood", true],
        ["dairy", true],
        ["eggs", true],
        ["soy", true],
        ["tree_nuts", true],
        ["wheat", true],
        ["fish", true],
        ["shellfish", true],
      ])
  );
  const [memDietary, setMemDietary] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );
  const { data: d } = useQuery<Map<string, boolean>>({
    queryKey: ["allergy-profile"],
    queryFn: async () => {
      const allergy = await getAllergy();
      const next = new Map<string, boolean>();
      dietaries.forEach((item) => {
        next.set(item, allergy.includes(item));
      });
      setDietaryData(next);
      setMemDietary(new Map(next));
      return next;
    },
  });
  if (d === undefined) {
    return <div>Loading...</div>;
  }

  const toggleDietary = (item: string) => {
    setDietaryData((prev) => {
      const next = new Map(prev);
      const cur = next.get(item) ?? false;
      next.set(item, !cur);
      return next;
    });
  };

  return (
    <div>
      <section className="rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(64,56,49,0.08)]">
        <div className="flex flex-col gap-14 px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-wrap items-start gap-4">
            <span className="text-app-dark-brown flex size-12 items-center justify-center rounded-full">
              <Settings className="size-6" aria-hidden />
            </span>
            <div>
              <h2 className="text-app-dark-brown text-xl font-semibold">
                Food Preferences
              </h2>
              <p className="text-app-brown/80 mt-1 text-sm">
                Set your dietary preferences and notification settings.
              </p>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dietary Restrictions</h1>
            <div className="mt-4 inline-grid w-full grid-cols-6 gap-4">
              {dietaries.map((item) => (
                <div
                  key={item}
                  className={`col-span-1 flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300/50 px-4 py-2 text-center text-sm font-medium shadow-sm ${dietaryData.get(item) ? "bg-[#B8A27B] text-white hover:opacity-80" : "bg-gray-100/50 hover:bg-gray-200"} `}
                  onClick={() => {
                    toggleDietary(item);
                  }}
                >
                  <h1>{item}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="mt-8 flex justify-end gap-4">
        <Button
          onClick={() => {
            setDietaryData(memDietary);
          }}
          type="submit"
          className="rounded-xl bg-white px-8 py-5 text-sm font-semibold text-black shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-gray-200 active:scale-95 active:bg-gray-300"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            const selected = Array.from(dietaryData.entries())
              .filter(([, v]) => v)
              .map(([k]) => k);

            await updateAllergy(selected);
            setMemDietary(new Map(dietaryData));
            toast.success("Update Dietary Preference Successfully");
            return;
          }}
          type="submit"
          className="bg-app-dark-brown rounded-xl px-8 py-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(64,56,49,0.18)] transition hover:bg-[#2F2721] active:scale-95 active:bg-[#2c2621]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

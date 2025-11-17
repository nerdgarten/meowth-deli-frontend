"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bean,
  Egg,
  Fish,
  ImageIcon,
  Info,
  Leaf,
  Milk,
  Nut,
  Shell,
  Shrimp,
  Wheat,
} from "lucide-react";

import { MenuFormDialog } from "@/components/Restaurant/MenuFormDialog";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/libs/axios";
import { deleteMenu, getMenusByRestaurant } from "@/libs/menus";
import type { Allergy, IDish } from "@/types/dish";

const ALLERGENS: Record<
  Allergy,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  eggs: { label: "Eggs", Icon: Egg },
  dairy: { label: "Dairy", Icon: Milk },
  soy: { label: "Soy", Icon: Bean },
  tree_nuts: { label: "Nuts", Icon: Nut },
  seafood: { label: "Sea Foods", Icon: Shrimp },
  fish: { label: "Fish", Icon: Fish },
  peanuts: { label: "Peanuts", Icon: Leaf },
  wheat: { label: "Wheat", Icon: Wheat },
  shellfish: { label: "Shellfish", Icon: Shell },
  gluten: { label: "Gluten", Icon: Info },
};

export default function RestaurantMenusPage() {
  const queryClient = useQueryClient();

  // Get the current authenticated user's restaurant profile
  // For restaurant users, their user.id IS their restaurant.id
  const { data: restaurantProfile } = useQuery({
    queryKey: ["restaurant-profile"],
    queryFn: async () => {
      const response = await apiClient.get<{ id: number }>(
        "/restaurant/profile"
      );
      return response.data;
    },
    staleTime: Infinity, // Restaurant ID won't change during the session
  });

  const restaurantId = restaurantProfile?.id?.toString();

  const { data: menus = [], isLoading } = useQuery<IDish[]>({
    queryKey: ["menus", restaurantId],
    queryFn: () => getMenusByRestaurant(restaurantId!),
    enabled: !!restaurantId, // Only fetch when we have the restaurant ID
  });

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteMenu(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["menus"] });
      await queryClient.refetchQueries({ queryKey: ["menus"] });
    },
  });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <section className="border-b-app-background rounded-[36px] border bg-white px-8 py-10 shadow-[0_30px_60px_rgba(93,66,17,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#c0a476] uppercase">
              Restaurant Menu
            </p>
            <h1 className="text-app-black text-3xl font-semibold">
              The Sushi Restaurant&apos;s Menus
            </h1>
            <p className="text-app-brown text-sm">
              Review photo, menu story, and listed prices before uploading or
              editing.
            </p>
          </div>

          <MenuFormDialog dish={null} />
        </div>

        <div className="mt-8 space-y-6">
          {isLoading ? (
            <p>Loading menus...</p>
          ) : (
            menus.map((menu) => (
              <article
                key={menu.id}
                className="flex flex-col gap-6 rounded-2xl border border-[#ecdfcf] bg-[#fff9ef] px-6 py-5 shadow-[0_16px_40px_rgba(52,31,10,0.08)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-app-black text-2xl font-semibold">
                      {menu.name}
                    </h2>
                  </div>

                  <div className="space-y-1">
                    <p className="text-app-black text-sm font-semibold">
                      detail
                    </p>
                    <p className="text-app-brown text-sm leading-relaxed">
                      {menu.detail}
                    </p>
                  </div>

                  {menu.allergy && menu.allergy.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-app-black text-sm font-semibold">
                        Allergens
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {menu.allergy.map((allergen) => {
                          const allergenInfo = ALLERGENS[allergen];
                          if (!allergenInfo) return null;
                          const Icon = allergenInfo.Icon;
                          return (
                            <div
                              key={allergen}
                              className="flex items-center gap-1.5 rounded-full border border-[#d6c8b0] bg-white px-3 py-1.5 text-xs font-medium text-[#6f553a] shadow-sm"
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span>{allergenInfo.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-app-black text-sm font-semibold">
                        Price
                      </p>
                      <p className="text-app-black text-2xl font-semibold">
                        {menu.price.toLocaleString("en-US")}
                      </p>
                    </div>
                    <div className="flex-auto"></div>
                    <div className="flex flex-wrap gap-3">
                      <MenuFormDialog dish={menu} />
                      <Button
                        className="rounded-full bg-[#fb6d2c] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 active:translate-y-[1px] active:brightness-90"
                        onClick={() => void delMutation.mutate(menu.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-[4/3] w-full max-w-[320px] overflow-hidden rounded-xl border border-[#e7d3b0] bg-[#f7e6cc] shadow-inner sm:w-auto">
                  {menu.image ? (
                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f7e6cc]">
                      <div className="flex flex-col items-center justify-center text-[#8c7254]">
                        <ImageIcon className="mb-2 h-16 w-16" />
                        <p className="text-xs font-medium">No Image</p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

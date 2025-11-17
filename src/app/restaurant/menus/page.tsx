"use client";

import { MenuFormDialog } from "@/components/Restaurant/MenuFormDialog";
import { Button } from "@/components/ui/button";
import type { IDish } from "@/types/dish";

const MENU_ITEMS: IDish[] = [
  {
    id: "1",
    restaurant_id: "1",
    name: "Sashimi Size XL",
    detail:
      "A quick and healthy with Omega and mineral featuring succulent Salmon to perfection raw fish, and a side of fruit. This dish is not only packed with rice. If you don't like the vegetable, feel free to inform us.",
    price: 1299,
    allergy: ["eggs", "fish", "seafood"],
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    is_out_of_stock: false,
  },
  {
    id: "2",
    restaurant_id: "1",
    name: "Sashimi Size L",
    detail:
      "A quick and healthy with Omega and mineral featuring succulent Salmon to perfection raw fish, and a side of fruit. This dish is not only packed with rice. If you don't like the vegetable, feel free to inform us.",
    price: 999,
    allergy: [],
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    is_out_of_stock: false,
  },
];

export default function RestaurantMenusPage() {
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
          {MENU_ITEMS.map((menu) => (
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
                  <p className="text-app-black text-sm font-semibold">detail</p>
                  <p className="text-app-brown text-sm leading-relaxed">
                    {menu.detail}
                  </p>
                </div>

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
                    <Button className="rounded-full bg-[#fb6d2c] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 active:translate-y-[1px] active:brightness-90">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full max-w-[240px] overflow-hidden rounded-xl border border-[#e7d3b0] bg-[#f7e6cc] shadow-inner sm:w-auto">
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

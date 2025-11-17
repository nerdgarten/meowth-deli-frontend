<<<<<<< HEAD
// ...existing code...
import { Heart,Minus, Plus } from "lucide-react";
import { useState } from "react";

import { createFavouriteDish, deleteFavouriteDish } from "@/libs/favourite";
import type { IDish } from "@/types/dish";
=======
import { Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { createFavouriteDish, deleteFavouriteDish } from "@/libs/favourite";
import type { Allergy, IDish } from "@/types/dish";
import { DishCard } from "./DishCard";

import {
  Bean,
  Egg,
  Fish,
  Info,
  Leaf,
  Milk,
  Nut,
  Shell,
  Shrimp,
  Wheat,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getAllergy } from "@/libs/customer";
import { cn } from "@/libs/utils";

const ALLERGENS: Array<{
  key: Allergy;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "eggs", label: "Eggs", Icon: Egg },
  { key: "dairy", label: "Dairy", Icon: Milk },
  { key: "soy", label: "Soy", Icon: Bean },
  { key: "tree_nuts", label: "Nuts", Icon: Nut },
  { key: "seafood", label: "Sea Foods", Icon: Shrimp },
  { key: "fish", label: "Fish", Icon: Fish },
  { key: "peanuts", label: "peanuts", Icon: Leaf },
  { key: "wheat", label: "Wheat", Icon: Wheat },
  { key: "shellfish", label: "Shellfish", Icon: Shell },
  { key: "gluten", label: "Gluten", Icon: Info },
];
>>>>>>> 395ec7da9f5a72d7d27ae8deb89c416d10faca98

interface SelectMenuProps {
  dish: IDish;
  recommendations: IDish[];
  addToCart: (dish: IDish, quantity: number) => void;
  onDishClick: (dish: IDish) => void;
  favourite_dish: boolean;
}

export const SelectMenu = ({
  dish,
  recommendations,
  addToCart,
  onDishClick,
  favourite_dish,
}: SelectMenuProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState("");
  const [fav, setFav] = useState<boolean>(favourite_dish);
  const [favPending, setFavPending] = useState(false);

  const handleAddToCart = () => {
    addToCart(dish, quantity);
  };

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(99, q + 1));

  const toggleFav = async () => {
    if (favPending) return;
    setFavPending(true);
    try {
      if (!fav) {
        setFav(true); // optimistic
        await createFavouriteDish(Number(dish.id));
      } else {
        setFav(false); // optimistic
        await deleteFavouriteDish(Number(dish.id));
      }
    } catch (e) {
      // revert on error
      setFav((v) => !v);
      console.error("Failed to toggle favourite", e);
    } finally {
      setFavPending(false);
    }
  };

  const { data: allergy } = useQuery<Allergy[]>({
    queryKey: ["allergy-profile"],
    queryFn: () => {
      return getAllergy();
    },
  });

  if (!dish) {
    return (
      <div className="grid-row-2 mx-4 grid h-full grid-cols-1 gap-4 rounded-sm bg-white p-4">
        <div className="text-center text-gray-500">No dish data available</div>
      </div>
    );
  }

  const priceText = new Intl.NumberFormat("en-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(dish.price);

  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-black/5 p-4 lg:grid-cols-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-200 lg:aspect-auto lg:min-h-[400px]">
          {dish.image && (
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="col-span-1 flex w-full flex-col gap-4 p-4 sm:p-6 lg:col-span-2 lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <h1 className="text-3xl font-bold text-balance md:text-4xl">
                {dish.name}
              </h1>
              <button
                type="button"
                aria-pressed={fav}
                aria-label={
                  fav ? "Remove from favourites" : "Add to favourites"
                }
                disabled={favPending}
                onClick={toggleFav}
                className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-50`}
                title={fav ? "Remove from favourites" : "Add to favourites"}
              >
                <Heart
                  size={28}
                  className={`cursor-pointer ${fav ? "fill-red-500 text-red-500" : "fill-white text-black"}`}
                />
              </button>
            </div>
            <div className="flex flex-col items-start rounded-xl border border-slate-200 px-4 py-2 md:items-end">
              <p className="text-xs tracking-wide text-slate-500 uppercase">
                Base price
              </p>
              <h2 className="text-2xl font-bold text-black sm:text-3xl">
                {priceText}
              </h2>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold">Description</h2>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {dish.detail}
            </p>
          </div>

          {dish.allergy.length > 0 && (
            <div>
              <h2 className="text-lg font-bold">Allergy</h2>
              <div className="mt-2 flex gap-2">
                {dish.allergy.map((a) => {
                  const item = ALLERGENS.find((allergen) => allergen.key === a);
                  if (!item) return null;
                  const isAllergic = allergy && allergy.includes(item.key);
                  return (
                    <Badge
                      key={item.key}
                      className={cn(
                        "flex w-fit items-center gap-2 rounded-full text-sm shadow-sm",
                        isAllergic ? "text-app-white" : "text-app-black"
                      )}
                      variant={isAllergic ? "destructive" : "outline"}
                    >
                      <item.Icon className="size-4" />
                      {item.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Note to Restaurant</h3>
              <span className="flex h-fit items-center justify-center rounded-sm bg-slate-200 px-2 py-1 text-xs font-semibold">
                Optional
              </span>
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="focus:border-app-brown focus:ring-app-brown w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm transition focus:ring-2 focus:outline-none"
              placeholder="E.g. No onions, extra spicy, etc."
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center gap-6 sm:justify-start">
              <button
                type="button"
                onClick={dec}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black/70 bg-white transition active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus size={24} />
              </button>
              <h1 className="min-w-[3rem] text-center text-3xl font-bold select-none">
                {quantity}
              </h1>
              <button
                type="button"
                onClick={inc}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black/70 bg-white transition active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus size={24} />
              </button>
            </div>

            <button
              type="button"
              className="bg-app-yellow active:bg-app-bronze w-full rounded-full px-6 py-3 transition hover:bg-amber-500 disabled:opacity-50 sm:w-auto sm:flex-1"
              onClick={handleAddToCart}
            >
              <span className="text-xl font-bold text-white sm:text-2xl">
                Add to Basket
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold md:text-3xl">Pairing Suggestion</h3>
        <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 sm:gap-6">
          {recommendations.map((dish) => (
            <DishCard dish={dish} onDishClick={onDishClick} />
          ))}
        </div>
      </div>
    </div>
  );
};
// ...existing code...

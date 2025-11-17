import { Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createFavouriteDish, deleteFavouriteDish } from "@/libs/favourite";

import type { IDish } from "@/types/dish";

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
    <div className="grid-row-2 mx-4 grid h-full grid-cols-1 gap-4 rounded-2xl bg-white p-4">
      <div className="col-span-1 row-span-1 grid grid-cols-3 grid-rows-1 overflow-hidden rounded-2xl border border-black/5 p-4">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-200">
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
        <div className="col-span-2 grid w-full grid-cols-2 grid-rows-7 gap-4 p-6 md:p-8">
          <div className="col-span-1 row-span-2 flex items-start gap-3">
            <h1 className="text-3xl font-bold text-balance md:text-4xl">
              {dish.name}
            </h1>
            <button
              type="button"
              aria-pressed={fav}
              aria-label={fav ? "Remove from favourites" : "Add to favourites"}
              disabled={favPending}
              onClick={toggleFav}
              className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-50`}
              title={fav ? "Remove from favourites" : "Add to favourites"}
            >
              {/* Lucide Heart is stroke-only; color the stroke. */}
              <Heart
                size={28}
                className={fav ? "text-pink-600" : "text-black"}
              />
            </button>
          </div>

          <div className="col-span-1 row-span-2 flex flex-col items-end">
            <h2 className="text-3xl font-bold text-black">{priceText}</h2>
            <h2 className="text-sm text-slate-500 md:text-base">Base Price</h2>
          </div>

          <div className="col-span-2 row-span-2">
            <h2 className="text-lg font-bold">Description</h2>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {dish.detail}
            </p>
          </div>

          <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-3 gap-3 md:gap-4">
            <h3 className="col-span-1 row-span-1 text-lg font-bold">
              Note to Restaurant
            </h3>
            <div className="col-span-1 row-span-1 flex w-full justify-end">
              <span className="fond-semibold flex h-fit items-center justify-center rounded-sm bg-slate-200 px-2 py-1 text-xs">
                Optional
              </span>
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="focus:border-app-brown focus:ring-app-brown col-span-2 row-span-2 mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm transition focus:ring-2 focus:outline-none"
              placeholder="E.g. No onions, extra spicy, etc."
            />
          </div>

          <div className="col-span-2 row-span-1 grid grid-cols-7 grid-rows-1 gap-6 md:gap-12">
            <div className="col-span-3 row-span-1 flex items-center justify-between">
              <button
                type="button"
                onClick={dec}
                className="flex aspect-square h-full items-center justify-center rounded-full border-2 border-black/70 bg-white transition active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus size={28} />
              </button>
              <h1 className="text-3xl font-bold select-none">{quantity}</h1>
              <button
                type="button"
                onClick={inc}
                className="flex aspect-square h-full items-center justify-center rounded-full border-2 border-black/70 bg-white transition active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus size={28} />
              </button>
            </div>

            <button
              type="button"
              className="bg-app-yellow active:bg-app-bronze col-span-4 row-span-1 rounded-full px-4 py-3 transition hover:bg-amber-500 disabled:opacity-50"
              onClick={handleAddToCart}
            >
              <span className="text-2xl font-bold text-white">
                Add to Basket
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-1 row-span-1 grid grid-cols-4 grid-rows-5 gap-4">
        <h3 className="col-span-4 row-span-1 text-2xl font-bold md:text-3xl">
          Pairing Suggestion
        </h3>
        <div className="col-span-4 row-span-4 flex w-full snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth p-3">
          {recommendations.map((item) => (
            <button
              key={item.id}
              type="button"
              className="h-full w-72 flex-shrink-0 snap-start overflow-hidden rounded-lg bg-white p-2 text-left shadow-2xl ring-1 ring-black/5 transition hover:scale-[1.01] active:scale-[0.99]"
              onClick={() => onDishClick(item)}
              aria-label={`View ${item.name}`}
            >
              <div className="relative h-40 w-full overflow-hidden rounded-lg bg-slate-200">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="grid h-24 grid-cols-3 grid-rows-2 text-black">
                <h4 className="col-span-2 row-span-1 truncate font-semibold">
                  {item.name}
                </h4>
                <h3 className="col-span-1 row-span-1 text-right text-xl font-bold">
                  ฿{item.price.toFixed(2)}
                </h3>
                <p className="col-span-3 row-span-1 line-clamp-2 text-sm text-slate-600">
                  {item.detail}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
// ...existing code...

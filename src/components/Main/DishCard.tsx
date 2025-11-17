"use client";

import Image from "next/image";

import type { IDish } from "@/types/dish";

interface DishCardProps {
  dish: IDish;
  onDishClick: (dish: IDish) => void;
}

export const DishCard = ({ dish, onDishClick }: DishCardProps) => {
  return (
    <button
      key={dish.id}
      type="button"
      className="h-full w-72 flex-shrink-0 snap-start overflow-hidden rounded-lg border bg-white p-2 text-left ring-1 ring-black/5 transition hover:scale-[1.01] active:scale-[0.99]"
      onClick={() => onDishClick(dish)}
      aria-label={`View ${dish.name}`}
    >
      <div className="relative h-40 w-full overflow-hidden rounded-lg bg-slate-200">
        {dish.image && (
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="grid h-24 grid-cols-3 grid-rows-2 text-black">
        <h4 className="col-span-2 row-span-1 truncate font-semibold">
          {dish.name}
        </h4>
        <h3 className="col-span-1 row-span-1 text-right text-xl font-bold">
          ฿{dish.price.toFixed(2)}
        </h3>
        <p className="col-span-3 row-span-1 text-sm text-slate-600">
          <div className="line-clamp-2">{dish.detail}</div> 
        </p>
      </div>
    </button>
  );
};

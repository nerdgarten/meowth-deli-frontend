"use client"

import { Icon } from "lucide-react";
import { Plus, Minus } from "lucide-react";
import type { IDish } from "@/types/dish";
import { useState } from "react";

interface SelectMenuProps {
  dish: IDish;
  recommendations: IDish[];
  addToCart: (dish: IDish, quantity: number) => void;
}

export const SelectMenu = ({
  dish,
  recommendations,
  addToCart,
} : SelectMenuProps
  
) => {


    const [quantity, setQuantity] = useState<number>(1);
    const handleAddToCart = () =>{
      addToCart(dish, quantity);
    }

    if (!dish) {
      return (
        <div className="grid-row-2 mx-4 grid h-full grid-cols-1 gap-4 rounded-sm bg-white p-4">
          <div className="text-center text-gray-500">
            No dish data available
          </div>
        </div>
      );
    }
  return (
    <div className="grid-row-2 mx-4 grid h-full grid-cols-1 gap-4 rounded-sm bg-white p-4">
      <div className="col-span-1 row-span-1 grid grid-cols-3 grid-rows-1 overflow-hidden rounded-2xl p-4">
        <div className="bg-app-blue h-full w-full rounded-2xl"></div>
        <div className="col-span-2 grid w-full grid-cols-2 grid-rows-7 gap-4 p-8">
          <div className="col-span-1 row-span-2 text-4xl">
            <h1 className="font-bold">{dish.name}</h1>
            <div className="fond-semibold mt-2 flex gap-2 text-sm">
              {/* {detailed.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex w-14 items-center justify-center rounded-sm bg-slate-200"
                >
                  {tag}
                </div>
              ))} */}
            </div>
          </div>
          <div className="col-span-1 row-span-2 flex flex-col items-end">
            <h2 className="text-4xl font-bold text-black">{dish.price} THB</h2>
            <h2 className="text-xl text-slate-500">Base Price</h2>
          </div>
          <div className="col-span-2 row-span-2">
            <h1 className="text-lg font-bold">Description</h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {dish.detail}
            </p>
          </div>
          <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-3 gap-4">
            <h1 className="col-span-1 row-span-1 text-lg font-bold">
              Note to Restaurant
            </h1>
            <div className="flex w-full justify-end">
              <div className="fond-semibold flex h-fit w-18 items-center justify-center gap-2 rounded-sm bg-slate-200 text-sm">
                Optional
              </div>
            </div>
            <input
              type="text"
              className="focus:border-app-brown focus:ring-app-brown col-span-2 row-span-2 mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:ring-1 focus:outline-none"
              placeholder="E.g. No onions, extra spicy, etc."
            />
          </div>
          <div className="col-span-2 row-span-1 grid grid-cols-7 grid-rows-1 gap-12">
            <div className="col-span-3 row-span-1 flex items-center justify-between">
              <div
                className="flex aspect-square h-full items-center justify-center rounded-full border-4 border-black transition active:scale-90"
                onClick={() => {
                  if (quantity >= 2) {
                    setQuantity(quantity - 1);
                  }
                }}
              >
                <Minus size={40} />
              </div>
              <h1 className="text-4xl font-bold">{quantity}</h1>
              <div
                className="flex aspect-square h-full items-center justify-center rounded-full border-4 border-black transition active:scale-90"
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
              >
                <Plus size={40} />
              </div>
            </div>
            <button
              className="bg-app-yellow active:bg-app-bronze col-span-4 row-span-1 rounded-full transition hover:bg-amber-500"
              onClick={handleAddToCart}
            >
              <h1 className="text-2xl font-bold text-white">Add to Basket</h1>
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-1 row-span-1 grid grid-cols-4 grid-rows-5 gap-4">
        <h3 className="col-span-4 row-span-1 text-3xl font-bold">
          Pairing Suggestion
        </h3>
        <div className="col-span-4 row-span-4 flex w-full gap-20 overflow-x-auto p-3">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="h-full w-72 flex-shrink-0 overflow-hidden rounded-lg bg-white p-2 shadow-2xl"
              // onClick={() => onDishClick(item)}
            >
              <div className="h-3/5 rounded-lg bg-slate-800"></div>
              <div className="grid h-2/5 grid-cols-3 grid-rows-2 text-black">
                <h4 className="col-span-2 row-span-1 font-semibold">
                  {item.name}
                </h4>
                <h3 className="col-span-1 row-span-1 text-right text-2xl font-bold">
                  ${item.price.toFixed(2)}
                </h3>
                <p className="col-span-2 row-span-1">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
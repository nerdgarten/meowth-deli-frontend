"use client";
import type { IDish } from "@/types/dish";

interface RestaurantListProps {
  dishes: IDish[];
  restaurant: string;
  onDishClick: (dish: IDish) => void;
}

export const RestaurantList = ({
  dishes,
  restaurant,
  onDishClick,
}: RestaurantListProps) => {
  return (
    <div className="grid-row-6 mx-4 grid h-full grid-cols-1 gap-4 rounded-sm bg-white p-4">
      <div className="bg-app-background relative col-span-1 row-span-4 flex items-center justify-start overflow-hidden rounded-2xl">
        <div className="absolute grid grid-rows-2 gap-4 p-16">
          <h2 className="text-app-brown text-4xl font-semibold">
            {restaurant}
          </h2>
        </div>
        <div className="bg-app-yellow absolute inset-0 h-full w-full origin-left translate-x-113 skew-x-12 transform"></div>
        <div className="absolute inset-0 h-full w-full origin-left translate-x-120 skew-x-20 transform bg-black"></div>
      </div>
      <div className="col-span-1 row-span-1 grid grid-cols-4 grid-rows-5 gap-4">
        <h3 className="col-span-4 row-span-1 text-3xl font-bold">
          Your Favourite Food
        </h3>
        <div className="col-span-4 row-span-4 flex w-full gap-20 overflow-x-auto p-3">
          {dishes.map((item) => (
            <div
              key={item.id}
              className="h-full w-72 flex-shrink-0 overflow-hidden rounded-lg bg-white p-2 shadow-2xl"
              onClick={() => onDishClick(item)}
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
      <div className="col-span-1 row-span-1 grid grid-cols-4 grid-rows-5 gap-4">
        <h3 className="col-span-4 row-span-1 text-3xl font-bold">Recommend</h3>
        <div className="col-span-4 row-span-4 flex w-full gap-20 overflow-x-auto p-3">
          {dishes.map((item) => (
            <div
              key={item.id}
              className="h-full w-72 flex-shrink-0 overflow-hidden rounded-lg bg-white p-2 shadow-2xl transition hover:bg-gray-100 active:bg-gray-400"
              onClick={() => onDishClick(item)}
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

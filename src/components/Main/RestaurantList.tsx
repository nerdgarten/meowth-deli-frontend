"use client";
import type { IDish } from "@/types/dish";
import { useState } from "react";
import {
  checkFavouriteRestaurant,
  createFavouriteRestaurant,
  deleteFavouriteRestaurant,
} from "@/libs/favourite";
import { Heart } from "lucide-react";
import type { IRestaurant } from "@/types/restaurant";
import Image from "next/image";
interface RestaurantListProps {
  dishes: IDish[];
  favourite_dish: IDish[];
  restaurant: IRestaurant | undefined;
  onDishClick: (dish: IDish) => void;
  favourite_restaurant: boolean;
}

export const RestaurantList = ({
  dishes,
  favourite_dish,
  restaurant,
  onDishClick,
  favourite_restaurant,
}: RestaurantListProps) => {
  const [fav, setFav] = useState<boolean>(favourite_restaurant);
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-app-background relative aspect-video overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[320px]">
          {restaurant?.banner && (
            <Image
              src={restaurant.banner}
              alt={`${restaurant.name} banner`}
              fill
              className="object-cover"
              priority
            />
          )}
          <Heart
            size={40}
            className={`absolute top-4 right-4 z-10 cursor-pointer ${fav ? "fill-pink-600 text-pink-600" : "fill-white text-white"}`}
            onClick={async () => {
              if (!fav) {
                await createFavouriteRestaurant(Number(restaurant?.id));
                setFav(true);
              } else {
                await deleteFavouriteRestaurant(Number(restaurant?.id));
                setFav(false);
              }
            }}
          />
        </div>
        <div className="bg-app-background flex flex-col justify-center gap-4 rounded-2xl p-6 lg:p-8">
          <h2 className="text-4xl font-bold text-gray-900">
            {restaurant?.name}
          </h2>
          <p className="text-lg text-gray-700">{restaurant?.detail}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>📞 {restaurant?.tel}</span>
            {restaurant?.location && (
              <span>📍 {restaurant.location.address}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold sm:text-3xl">Recommend</h3>
        <div className="flex w-full gap-4 overflow-x-auto pb-4 sm:gap-6">
          {dishes.map((item) => (
            <div
              key={item.id}
              className="h-full w-72 flex-shrink-0 overflow-hidden rounded-lg bg-white p-2 shadow-2xl transition hover:bg-gray-100 active:bg-gray-400"
              onClick={() => onDishClick(item)}
            >
              <div className="relative h-3/5 overflow-hidden rounded-lg bg-slate-200">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="grid h-2/5 grid-cols-3 grid-rows-2 text-black">
                <h4 className="col-span-2 row-span-1 font-semibold">
                  {item.name}
                </h4>
                <h3 className="col-span-1 row-span-1 text-right text-2xl font-bold">
                  ฿{item.price.toFixed(2)}
                </h3>
                <p className="col-span-2 row-span-1">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {favourite_dish.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Your Favourite Food
          </h3>
          <div className="flex w-full gap-4 overflow-x-auto pb-4 sm:gap-6">
            {favourite_dish.map((item) => {
              return (
                <div
                  key={item.id}
                  className="h-full w-72 flex-shrink-0 overflow-hidden rounded-lg bg-white p-2 shadow-2xl"
                  onClick={() => onDishClick(item)}
                >
                  <div className="relative h-3/5 overflow-hidden rounded-lg bg-slate-200">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="grid h-2/5 grid-cols-3 grid-rows-2 text-black">
                    <h4 className="col-span-2 row-span-1 font-semibold">
                      {item.name}
                    </h4>
                    <h3 className="col-span-1 row-span-1 text-right text-2xl font-bold">
                      ฿{item.price.toFixed(2)}
                    </h3>
                    <p className="col-span-2 row-span-1">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

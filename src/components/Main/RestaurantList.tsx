"use client";
import type { IDish } from "@/types/dish";
import { useDeferredValue, useMemo, useState } from "react";
import {
  checkFavouriteRestaurant,
  createFavouriteRestaurant,
  deleteFavouriteRestaurant,
} from "@/libs/favourite";
import { Heart } from "lucide-react";
import type { IRestaurant } from "@/types/restaurant";
import Image from "next/image";
import { commandScore } from "@/libs/command-score";
import { Toolbar } from "../Landing/Toolbar";
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
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredDishes = useMemo(() => {
    if (!dishes || !dishes.length) return [];
    const term = deferredSearch.trim();
    if (!term) return dishes;

    return dishes
      .map((dish) => {
        const score = commandScore(dish.name, term, [dish.detail ?? ""]);
        return { dish, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ dish }) => dish);
  }, [dishes, deferredSearch]);

  const filteredFavouriteDishes = useMemo(() => {
    if (!favourite_dish || !favourite_dish.length) return [];
    const term = deferredSearch.trim();
    if (!term) return favourite_dish;

    return favourite_dish
      .map((dish) => {
        const score = commandScore(dish.name, term, [dish.detail ?? ""]);
        return { dish, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ dish }) => dish);
  }, [favourite_dish, deferredSearch]);

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

      <div className="flex items-center">
        <h3 className="text-2xl font-bold sm:text-3xl">Recommend</h3>
        <div className="mb-2 grow">
          <Toolbar
            placeholder="Search dishes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {!filteredDishes.length && dishes.length ? (
        <p className="text-app-brown text-center text-lg">
          No dishes match your search.
        </p>
      ) : (
        <div className="col-span-1 row-span-1 grid h-80 grid-cols-4 grid-rows-5 gap-4">
          <div className="col-span-4 row-span-4 flex w-full gap-4 overflow-x-auto p-3">
            {filteredDishes.map((item) => (
              <div
                key={item.id}
                className="h-full w-72 flex-shrink-0 overflow-hidden rounded-lg border bg-white p-2 transition hover:bg-gray-100 active:bg-gray-400"
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
      )}
      {filteredFavouriteDishes.length > 0 ? (
        <div className="col-span-1 row-span-1 grid h-80 grid-cols-4 grid-rows-5 gap-4">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Your Favourite Food
          </h3>
          <div className="col-span-4 row-span-4 flex w-full gap-4 overflow-x-auto p-3">
            {filteredFavouriteDishes.map((item) => {
              return (
                <div
                  key={item.id}
                  className="h-full w-72 flex-shrink-0 overflow-hidden rounded-lg border bg-white p-2"
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

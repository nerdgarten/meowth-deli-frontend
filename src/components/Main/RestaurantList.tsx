"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import {
  checkFavouriteRestaurant,
  createFavouriteRestaurant,
  deleteFavouriteRestaurant,
} from "@/libs/favourite";
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";
import Image from "next/image";
import { commandScore } from "@/libs/command-score";
import { Toolbar } from "../Landing/Toolbar";
import { DishCard } from "./DishCard";
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
            className={`absolute top-4 right-4 z-10 cursor-pointer ${fav ? "fill-red-500 text-red-500" : "fill-white text-white"}`}
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

      {!filteredDishes.length && dishes.length ? (
        <p className="text-app-brown text-center text-lg">
          No dishes match your search.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <h3 className="text-2xl font-bold md:text-3xl">Recommend</h3>
            <div className="mb-2 grow">
              <Toolbar
                placeholder="Search dishes..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 sm:gap-6">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} onDishClick={onDishClick} />
            ))}
          </div>
        </div>
      )}
      {filteredFavouriteDishes.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold md:text-3xl">
            Your Favourite Food
          </h3>
          <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 sm:gap-6">
            <div className="col-span-4 row-span-4 flex w-full gap-4 overflow-x-auto p-3">
              {filteredFavouriteDishes.map((dish) => (
                // <div key={dish.id}>
                <DishCard key={dish.id} dish={dish} onDishClick={onDishClick} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

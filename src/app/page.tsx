"use client";

import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useMemo, useState } from "react";
import { Spinner } from "@ui/shadcn-io/spinner";

import { RestaurantCard } from "@/components/common/RestaurantCard";
import { LandingCarousel } from "@/components/Landing/Carousel";
import { Toolbar } from "@/components/Landing/Toolbar";
import { commandScore } from "@/libs/command-score";
import { getAllRestaurant } from "@/libs/restaurant";
import { getFavouriteRestaurant } from "@/libs/favourite";

export default function HomePage() {
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-all"],
    queryFn: () => {
      return getAllRestaurant();
    },
  });
  const { data: favourite_restaurant, isLoading } = useQuery({
    queryKey: ["favourite-restaurant"],
    queryFn: () => {
      return getFavouriteRestaurant();
    },
  });

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredRestaurants = useMemo(() => {
    if (!restaurant || !restaurant.length) return [];
    const term = deferredSearch.trim();
    if (!term) return restaurant;

    return restaurant
      .map((entry) => {
        const score = commandScore(entry.name, term, [
          entry.detail ?? "",
          entry.location?.address ?? "",
        ]);
        return { entry, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ entry }) => entry);
  }, [restaurant, deferredSearch]);

  return (
    <main className="mt-[5.5rem]">
      {/* <LandingCarousel /> */}
      <Toolbar
        placeholder="Search for restaurants..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="no-scrollbar flex w-full flex-nowrap gap-4 overflow-x-scroll py-4">
        <div className="min-w-5"></div>
        {filteredRestaurants.length ? (
          filteredRestaurants.map((data) => (
            <RestaurantCard key={data.id} restaurant={data} />
          ))
        ) : (
          <p className="text-app-brown mx-auto my-10 text-center">
            No results found.
          </p>
        )}
        <div className="min-w-5"></div>
      </div>
      {!isLoading ? (
        <>
          <h1 className="mt-10 mb-5 text-center text-5xl font-bold">
            Your Favourite
          </h1>
          <div className="no-scrollbar flex w-full flex-nowrap gap-4 overflow-x-scroll py-4">
            <div className="min-w-5"></div>
            {favourite_restaurant && favourite_restaurant?.length > 0 ? (
              favourite_restaurant.map((data) => (
                <RestaurantCard key={data.id} restaurant={data} />
              ))
            ) : (
              <p className="text-app-brown mx-auto my-10 text-center">
                No results found.
              </p>
            )}
            <div className="min-w-5"></div>
          </div>
        </>
      ) : (
        <Spinner className="text-app-brown mx-auto my-10" variant="circle" />
      )}
    </main>
  );
}

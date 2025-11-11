"use client";

import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@ui/shadcn-io/spinner";

import { RestaurantCard } from "@/components/common/RestaurantCard";
import { LandingCarousel } from "@/components/Landing/Carousel";
import { Toolbar } from "@/components/Landing/Toolbar";
import { getAllRestaurant } from "@/libs/restaurant";
import { getFavouriteRestaurant } from "@/libs/favourite";

export default function HomePage() {
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-all"],
    queryFn: () => {
      return getAllRestaurant();
    },
  });
  const { data: favourite_restaurant } = useQuery({
    queryKey: ["favourite-restaurant"],
    queryFn: () => {
      return getFavouriteRestaurant();
    },
  });

  return (
    <main className="mt-[4rem]">
      <LandingCarousel />
      <Toolbar />
      {Array.from({ length: 1 }).map((_, index) => (
        <div className="no-scrollbar w-full overflow-x-scroll" key={index}>
          <div className="flex flex-nowrap gap-4 py-4">
            <div className="min-w-5"></div>
            {restaurant?.map((data, index_2) => (
              <RestaurantCard key={index_2} restaurant={data} />
            ))}
            <div className="min-w-5"></div>
          </div>
        </div>
      ))}
      <h1 className="mt-10 mb-5 text-center text-5xl font-bold">
        Your Favourite
      </h1>
      {favourite_restaurant ? (
        Array.from({ length: 1 }).map((_, index) => (
          <div className="no-scrollbar w-full overflow-x-scroll" key={index}>
            <div className="flex flex-nowrap gap-4 py-4">
              <div className="min-w-5"></div>
              {favourite_restaurant?.map((data, index_2) => (
                <RestaurantCard key={index_2} restaurant={data} />
              ))}
              <div className="min-w-5"></div>
            </div>
          </div>
        ))
      ) : (
        <Spinner className="text-app-brown mx-auto my-10" variant="circle" />
      )}
    </main>
  );
}

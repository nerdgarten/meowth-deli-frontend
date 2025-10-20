"use client";

import { Spinner } from "@ui/shadcn-io/spinner";
import { Skeleton } from "@ui/skeleton";

import { LandingCarousel } from "@/components/Landing/Carousel";
import { Toolbar } from "@/components/Landing/Toolbar";
import { RestaurantCard } from "@/components/common/RestaurantCard";

import type { Restaurant } from "@/types/restaurant";

import { useQuery } from "@tanstack/react-query";


import { getAllRestaurant } from "@/libs/restaurant";

export default function HomePage() {

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-all"],
    queryFn: () => {
      return getAllRestaurant();
    },
  });
  
  return (
    <main className="mt-[4rem]">
      <LandingCarousel />
      <Toolbar />
      {Array.from({ length: 2 }).map((_, index) => (
        <div className="no-scrollbar w-full overflow-x-scroll" key={index}>
          <div className="flex flex-nowrap gap-4 py-4">
            <div className="min-w-5"></div>
            {restaurant?.map((data, index) => (
              <RestaurantCard restaurant={data} />
            ))}
            <div className="min-w-5"></div>
          </div>
        </div>
      ))}
      <Spinner className="text-app-brown mx-auto my-10" variant="circle" />
    </main>
  );
}

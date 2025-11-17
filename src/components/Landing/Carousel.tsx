"use client";

import { useQuery } from "@tanstack/react-query";
import { Carousel, CarouselContent, CarouselItem } from "@ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Coffee, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { MS_IN_SEC } from "@/constants/misc";
import { getAllRestaurant } from "@/libs/restaurant";
// import { cn } from "@/libs/utils"; // not needed after hero removal
import { getDishesByRestaurnatId } from "@/queries/dish";
import { getRestaurantReviews } from "@/queries/reviews";
// zod not used here
import type { IDish } from "@/types/dish";
import type { IRestaurant } from "@/types/restaurant";
import type { ReviewResponse } from "@/types/review";

import { TopCarouselCard } from "./TopCarouselCard";

export const LandingCarousel = () => {
  // hero index state removed (static hero image)

  const { data: restaurants } = useQuery<IRestaurant[]>({
    queryKey: ["restaurant-all"],
    queryFn: getAllRestaurant,
  });

  const [randomRestaurant, setRandomRestaurant] = useState<IRestaurant | null>(
    null
  );

  const { data: dishes = [] } = useQuery<IDish[]>({
    queryKey: ["restaurant-all-dish", randomRestaurant?.id],
    queryFn: async () => {
      if (!randomRestaurant) return [] as IDish[];
      return await getDishesByRestaurnatId(randomRestaurant.id);
    },
    enabled: !!randomRestaurant,
  });

  const { data: restaurantReviews, isLoading: isReviewLoading } = useQuery<
    ReviewResponse[] | undefined
  >({
    queryKey: ["restaurant-review", randomRestaurant?.id],
    queryFn: async () => {
      if (!randomRestaurant) return undefined;
      return await getRestaurantReviews({
        restaurantId: randomRestaurant.id,
        limit: 1,
        offset: 0,
      });
    },
    enabled: !!randomRestaurant,
  });

  useEffect(() => {
    if (!restaurants) return;
    const idx = Math.floor(Math.random() * restaurants.length);
    setRandomRestaurant(restaurants[idx]!);
  }, [restaurants, setRandomRestaurant]);

  // No hero carousel — single background image only.

  // hero nav removed

  return (
    <div className="relative">
      <div className="relative h-[calc(100svh-4rem)] w-full bg-gray-300">
        <Image
          src={"/images/landing-carousel-1.jpg"}
          // src={randomRestaurant?.banner ?? "/images/landing-carousel-1.jpg"}
          alt="Landing Carousel 1"
          fill={true}
          className="object-cover"
        />
      </div>
      <div className="absolute top-[5.5rem] right-4 flex w-140 flex-col gap-y-6">
        <TopCarouselCard>
          <div className="text-app-dark-brown flex flex-row items-center gap-x-2">
            <Coffee className="h-8 w-8 stroke-2" />
            <h2 className="text-2xl font-bold select-none">Most Ordered</h2>
          </div>
          <Carousel
            className="mt-3"
            plugins={[
              Autoplay({
                delay: 10 * MS_IN_SEC,
              }),
            ]}
          >
            <CarouselContent className="-ml-3">
              {dishes.slice(0, 10).map((dish, index) => (
                <CarouselItem
                  key={index}
                  className="pl-3 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="bg-app-brown h-[24vh] w-full rounded-lg">
                    <Image
                      className="bg-app-brown h-[24vh] w-full rounded-lg"
                      src={dish.image ?? "/images/meowth-eating.webp"}
                      alt={dish.name ?? dish ?? "Dish"}
                      width={100}
                      height={100}
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </TopCarouselCard>
        <TopCarouselCard>
          <div className="text-app-dark-brown flex flex-row items-center gap-x-2">
            <MessageSquare className="h-8 w-8 stroke-2" />
            <h2 className="text-2xl font-bold">Reviews</h2>
          </div>
          <div className="mt-3 flex flex-row gap-x-4">
            {restaurantReviews &&
            restaurantReviews.length > 0 &&
            restaurantReviews[0]?.customer?.image ? (
              <Image
                className="h-25 w-25 shrink-0 rounded-md"
                src={restaurantReviews[0]?.customer?.image}
                alt={randomRestaurant?.name ?? "Restaurant Banner"}
                width={50}
                height={50}
                objectFit="cover"
              />
            ) : (
              <div className="bg-app-brown h-25 w-25 shrink-0 rounded-md" />
            )}
            {randomRestaurant ? (
              restaurantReviews ? (
                <div>
                  <p className="text-app-brown text-lg font-semibold">
                    {restaurantReviews[0]?.review_text ?? "No review text"}
                  </p>
                  <p className="text-app-dark-brown mt-2 text-sm">
                    — {restaurantReviews[0]?.customer?.firstname ?? "Anonymous"}{" "}
                    {restaurantReviews[0]?.customer?.lastname ?? ""}
                  </p>
                </div>
              ) : isReviewLoading ? (
                <p className="text-app-brown text-lg font-semibold">
                  Loading review…
                </p>
              ) : (
                <p className="text-app-brown text-lg font-semibold">
                  No reviews
                </p>
              )
            ) : (
              <p className="text-app-brown text-lg font-semibold">No reviews</p>
            )}
          </div>
        </TopCarouselCard>
      </div>
    </div>
  );
};

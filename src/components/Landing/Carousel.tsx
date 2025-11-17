"use client";

import { Carousel, CarouselContent, CarouselItem } from "@ui/carousel";
// import landing1 from "@/public/images/landing-carousel-1.jpg";
import Image from "next/image";
import {
  Carousel as LandingCarouselContainer,
  type CarouselApi as LandingCarouselApi,
  CarouselContent as LandingCarouselContent,
  CarouselItem as LandingCarouselItem,
} from "@ui/custom/LandingCarousel";
import Autoplay from "embla-carousel-autoplay";
import { Circle, Coffee, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { MS_IN_SEC } from "@/constants/misc";
import { cn } from "@/libs/utils";

import { TopCarouselCard } from "./TopCarouselCard";
import { getAllRestaurant } from "@/libs/restaurant";
import type { IRestaurant } from "@/types/restaurant";
import { set } from "zod";
import type { IDish } from "@/types/dish";
import { getDishesByRestaurnatId } from "@/queries/dish";

export const LandingCarousel = () => {
  const [api, setApi] = useState<LandingCarouselApi>();
  const [currentIdx, setCurrentIdx] = useState(0);

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

  useEffect(() => {
    if (!restaurants) return;
    const idx = Math.floor(Math.random() * restaurants.length);
    console.log(restaurants);
    setRandomRestaurant(restaurants[idx]!);
    console.log("Random Restaurant:", randomRestaurant);
  }, [restaurants, setRandomRestaurant, randomRestaurant]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("scroll", () => {
      setCurrentIdx(api.selectedScrollSnap());
    });
  }, [api, currentIdx]);

  const setCarouselIndex = (idx: number) => {
    if (!api) {
      return;
    }

    setCurrentIdx(idx);
    api.scrollTo(idx);
  };

  return (
    <div className="relative">
      <LandingCarouselContainer
        setApi={setApi}
        plugins={[Autoplay({ delay: 15 * MS_IN_SEC })]}
      >
        <LandingCarouselContent>
          <LandingCarouselItem key="1">
            <div className="h-[calc(100svh-4rem)] w-full bg-gray-300">
              <Image
                src={"/images/landing-carousel-1.jpg"}
                alt="Landing Carousel 1"
                fill={true}
              />
            </div>
          </LandingCarouselItem>
          <LandingCarouselItem key="2">
            <div className="h-[calc(100svh-4rem)] w-full bg-gray-400" />
          </LandingCarouselItem>
          <LandingCarouselItem key="3">
            <div className="h-[calc(100svh-4rem)] w-full bg-gray-500" />
          </LandingCarouselItem>
        </LandingCarouselContent>
      </LandingCarouselContainer>
      <div className="absolute bottom-3 left-1/2 flex gap-x-4">
        {[0, 1, 2].map((idx) => (
          <button key={idx} onClick={() => setCarouselIndex(idx)}>
            <Circle
              className={cn(
                `${currentIdx === idx ? "text-app-yellow fill-app-yellow rounded-full" : "fill-white text-white"}`,
                "hover:fill-app-yellow hover:text-app-yellow h-4 w-4 transition-colors"
              )}
            />
          </button>
        ))}
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
                  {/* <div className="bg-app-brown h-[24vh] w-full rounded-lg">
                    <div className="text-app-yellow flex h-full w-full items-center justify-center select-none">
                      {index}
                    </div>
                  </div> */}
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
            <div className="bg-app-brown h-25 w-25 shrink-0 rounded-md" />
            <p className="text-app-brown text-lg font-semibold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
              minima, repellendus asperiores impedit cum quasi tenetur sequi,
              dolor maxime numquam totam quisquam ea! Esse nemo error quaerat
              sed alias provident!
            </p>
          </div>
        </TopCarouselCard>
      </div>
    </div>
  );
};

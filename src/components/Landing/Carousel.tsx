"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Circle } from "lucide-react";
import { cn } from "@/libs/utils";

export const LandingCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIdx, setCurrentIdx] = useState(0);

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
    <>
      <Carousel setApi={setApi} plugins={[Autoplay({ delay: 15 * 1000 })]}>
        <CarouselContent>
          <CarouselItem key="1">
            <div className="h-[calc(100vh-3.75rem)] w-full bg-gray-300" />
          </CarouselItem>
          <CarouselItem key="2">
            <div className="h-[calc(100vh-3.75rem)] w-full bg-gray-400" />
          </CarouselItem>
          <CarouselItem key="3">
            <div className="h-[calc(100vh-3.75rem)] w-full bg-gray-500" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-3 left-1/2 flex gap-x-4">
        {[0, 1, 2].map((idx) => (
          <button key={idx} onClick={() => setCarouselIndex(idx)}>
            <Circle
              className={cn(
                `${currentIdx === idx ? "fill-app-yellow" : "fill-transparent"}`,
                "text-app-yellow hover:fill-app-background hover:text-app-background h-4 w-4 transition-colors"
              )}
            />
          </button>
        ))}
      </div>
    </>
  );
};

"use client";

import { Carousel, CarouselContent, CarouselItem } from "@ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const LandingCarousel = () => {
  return (
    <>
      <Carousel plugins={[Autoplay({ delay: 4000 })]}>
        <CarouselContent>
          <CarouselItem>
            <div className="h-[calc(100vh-3.75rem)] w-full bg-gray-300" />
          </CarouselItem>
          <CarouselItem>
            <div className="h-[calc(100vh-3.75rem)] w-full bg-gray-400" />
          </CarouselItem>
          <CarouselItem>
            <div className="h-[calc(100vh-3.75rem)] w-full bg-gray-500" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </>
  );
};

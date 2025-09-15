"use client";

import { LandingCarousel } from "@/components/Landing/Carousel";
import { Toolbar } from "@/components/Landing/Toolbar";
import { Spinner } from "@ui/shadcn-io/spinner";
import { Skeleton } from "@ui/skeleton";

export default function HomePage() {
  // TODO: Fetch Data from API
  return (
    <main className="mt-[4rem]">
      <LandingCarousel />
      <Toolbar />
      {Array.from({ length: 2 }).map((_, index) => (
        <div className="no-scrollbar w-full overflow-x-scroll" key={index}>
          <div className="flex flex-nowrap gap-4 py-4">
            <div className="min-w-5"></div>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                className="h-[250px] min-w-[375px] rounded-xl"
                key={index}
              />
            ))}
            <div className="min-w-5"></div>
          </div>
        </div>
      ))}
      <Spinner className="text-app-brown mx-auto my-10" variant="circle" />
    </main>
  );
}

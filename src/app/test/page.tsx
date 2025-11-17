"use client";

import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@ui/shadcn-io/spinner";

import { RestaurantCard } from "@/components/common/RestaurantCard";
import { LandingCarousel } from "@/components/Landing/Carousel";
import { Toolbar } from "@/components/Landing/Toolbar";
import { getAllRestaurant } from "@/libs/restaurant";
import { getFavouriteRestaurants } from "@/libs/favourite";
// import { WarningDialog } from "@/components/common/WarningDialog";

// export default function TestPage() {
//   return (
//     <main className="mt-[4rem]">
//       <WarningDialog />
//     </main>
//   );
// }

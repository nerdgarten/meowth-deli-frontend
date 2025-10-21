"use client";

// import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { IRestaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: IRestaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/menu/${restaurant.id}`);
  };

  return (
    <Card
      className="h-[300px] w-[375px] cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
          {/* {restaurant.imageUrl ? (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          ) : ( */}
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-500">No Image</span>
            </div>
          {/* )} */}
          <div className="absolute top-2 right-2">
            {/* <Badge variant={restaurant.isOpen ? "default" : "destructive"}> */}
              {/* {restaurant.isOpen ? "Open" : "Closed"} */}
            {/* </Badge> */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="truncate text-lg font-bold">{restaurant.name}</h3>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {restaurant.detail}
        </p>

        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="max-w-[120px] truncate">{restaurant.location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">

      </CardFooter>
    </Card>
  );
}

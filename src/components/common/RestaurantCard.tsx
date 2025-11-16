"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAllowed } from "../context/AllowedContext";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { IRestaurant } from "@/types/restaurant";
import toast from "react-hot-toast";

interface RestaurantCardProps {
  restaurant: IRestaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter();
  const { checkAllowed } = useAllowed();

  const handleCardClick = () => {
    if (checkAllowed(`/menu/${restaurant.id}`)) {
      router.push(`/menu/${restaurant.id}`);
      return;
    }
    toast.error("You have to be logged in to access the menu.");
  };

  return (
    <Card
      className="h-[300px] w-[375px] flex-shrink-0 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
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
            <Image
              src={
                restaurant.banner
                  ? restaurant.banner
                  : "http://localhost:3030/uploads/dish_pictures/restaurant/128/image_128_1763221253977_e81b156b6bf.jpg"
              }
              alt={restaurant.name}
              fill
              className="object-cover"
            />
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
          <div className="flex items-center gap-1"></div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="max-w-[120px] truncate">
              {restaurant.location ? restaurant.location.address : "No address"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0"></CardFooter>
    </Card>
  );
}

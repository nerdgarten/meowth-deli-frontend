"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import React, { useEffect, useRef } from "react";

import ReviewCardSkeleton from "@/components/Review/ReviewCardSkeleton";
import ReviewsList from "@/components/Review/ReviewsList";
import { getRestaurant } from "@/queries/restaurant";
import { getRestaurantReviews } from "@/queries/reviews";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Restaurant({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const restaurantId = parseInt(unwrappedParams.id, 10);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch restaurant data
  const {
    data: restaurant,
    error: restaurantError,
    isLoading: isRestaurantLoading,
  } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurant(restaurantId),
  });

  // Fetch reviews with infinite scroll
  const {
    data: reviewsData,
    error: reviewsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: reviewsStatus,
  } = useInfiniteQuery({
    queryKey: ["reviews", restaurantId],
    queryFn: ({ pageParam = 0 }) =>
      getRestaurantReviews({
        restaurantId,
        limit: 10,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const totalLoaded = pages.reduce(
        (acc, page) => acc + page.data.length,
        0
      );
      return totalLoaded < lastPage.pagination.total ? totalLoaded : undefined;
    },
    enabled: !!restaurant, // Only fetch reviews after restaurant data is loaded
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || !hasNextPage || isFetchingNextPage)
        return;

      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const threshold = 100; // Load more when 100px from the end

      if (scrollLeft + clientWidth >= scrollWidth - threshold) {
        void fetchNextPage();
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isRestaurantLoading) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <div className="animate-pulse">
          <div className="mb-4 h-64 rounded-lg bg-gray-200"></div>
          <div className="mb-2 h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (restaurantError) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-red-600">
            Error Loading Restaurant
          </h1>
          <p className="text-gray-600">
            {restaurantError.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <p>Restaurant not found</p>
      </div>
    );
  }

  const allReviews = reviewsData?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="container mx-auto mt-20 p-4">
      {/* Restaurant Header */}
      <div className="mb-8">
        <div className="relative mb-4 h-64 overflow-hidden rounded-lg md:h-80">
          <img
            src={restaurant.banner}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          {!restaurant.is_available && (
            <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
              <span className="text-xl font-bold text-white">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {restaurant.name}
            </h1>
            <div className="mb-4 flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{restaurant.location?.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone size={16} />
                <span>{restaurant.tel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>
                  {restaurant.verification_status === "approved"
                    ? "Verified"
                    : "Unverified"}
                </span>
              </div>
            </div>
            <p className="leading-relaxed text-gray-700">{restaurant.detail}</p>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4 md:mt-0 md:ml-8">
            <h3 className="mb-2 font-semibold text-gray-900">
              Restaurant Info
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Fee Rate:</span>{" "}
                {(restaurant.fee_rate * 100).toFixed(1)}%
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    restaurant.is_available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {restaurant.is_available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Star size={24} className="text-yellow-500" />
          Customer Reviews
        </h2>

        {reviewsStatus === "pending" && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
          </div>
        )}

        {reviewsStatus === "error" && (
          <div className="py-8 text-center">
            <p className="text-red-600">
              Error loading reviews: {reviewsError?.message || "Unknown error"}
            </p>
          </div>
        )}

        {reviewsStatus === "success" && (
          <>
            <ReviewsList
              reviews={allReviews}
              isLoadingNextPage={isFetchingNextPage}
              scrollContainerRef={scrollContainerRef}
            />
            <div className="mt-4 text-center">
              {isFetchingNextPage && <p>Loading more reviews...</p>}
              {!hasNextPage && allReviews.length === 0 && (
                <p>No reviews yet. Be the first to review!</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

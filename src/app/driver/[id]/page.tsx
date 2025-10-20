"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Car, Phone, Shield, Star, User } from "lucide-react";
import React, { useEffect, useRef } from "react";

import DriverReviewCardSkeleton from "@/components/Review/DriverReviewCardSkeleton";
import DriverReviewsList from "@/components/Review/DriverReviewsList";
import { getDriver } from "@/queries/driver";
import { getDriverReviews } from "@/queries/reviews";
import type { Driver } from "@/types/driver";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Driver({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const driverId = parseInt(unwrappedParams.id, 10);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch driver data
  const {
    data: driver,
    error: driverError,
    isLoading: isDriverLoading,
  } = useQuery({
    queryKey: ["driver", driverId],
    queryFn: () => getDriver(driverId),
  });

  // Fetch driver reviews with infinite scroll
  const {
    data: reviewsData,
    error: reviewsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: reviewsStatus,
  } = useInfiniteQuery({
    queryKey: ["driver-reviews", driverId],
    queryFn: ({ pageParam = 0 }) =>
      getDriverReviews({
        driverId,
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
    enabled: !!driver, // Only fetch reviews after driver data is loaded
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

  if (isDriverLoading) {
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
        <div className="mt-8">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <DriverReviewCardSkeleton />
            <DriverReviewCardSkeleton />
            <DriverReviewCardSkeleton />
            <DriverReviewCardSkeleton />
            <DriverReviewCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (driverError) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-red-600">
            Error Loading Driver
          </h1>
          <p className="text-gray-600">
            {driverError.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="container mx-auto mt-20 p-4">
        <p>Driver not found</p>
      </div>
    );
  }
  const allReviews = reviewsData?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="container mx-auto mt-20 p-4">
      {/* Driver Header */}
      <div className="mb-8">
        <div className="relative mb-4 h-64 overflow-hidden rounded-lg md:h-80">
          <img
            src={driver.image}
            alt={`${driver.firstname} ${driver.lastname}`}
            className="h-full w-full object-cover"
          />
          {!driver.is_available && (
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
              {driver.firstname} {driver.lastname}
            </h1>
            <div className="mb-4 flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Phone size={16} />
                <span>{driver.tel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Car size={16} />
                <span>{driver.vehicle}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={16} />
                <span>
                  {driver.verification_status === "approved"
                    ? "Verified"
                    : "Unverified"}
                </span>
              </div>
            </div>
            <div className="text-gray-700">
              <p className="mb-2">
                <span className="font-medium">License:</span> {driver.licence}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4 md:mt-0 md:ml-8">
            <h3 className="mb-2 font-semibold text-gray-900">Driver Info</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Fee Rate:</span>{" "}
                {(driver.fee_rate * 100).toFixed(1)}%
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    driver.is_available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {driver.is_available ? "Available" : "Unavailable"}
                </span>
              </div>
              <div>
                <span className="font-medium">Driver ID:</span> {driver.id}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Star size={24} className="text-yellow-500" />
          Customer Reviews
        </h2>

        {reviewsStatus === "pending" && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <DriverReviewCardSkeleton />
            <DriverReviewCardSkeleton />
            <DriverReviewCardSkeleton />
            <DriverReviewCardSkeleton />
            <DriverReviewCardSkeleton />
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
            <DriverReviewsList
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

      {/* Additional Info Section */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
          <User size={20} className="text-blue-500" />
          Driver Details
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-gray-900">Contact Information</h3>
            <p className="text-gray-600">{driver.tel}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Vehicle</h3>
            <p className="text-gray-600">{driver.vehicle}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">License Number</h3>
            <p className="text-gray-600">{driver.licence}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Verification Status</h3>
            <p className="text-gray-600 capitalize">
              {driver.verification_status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

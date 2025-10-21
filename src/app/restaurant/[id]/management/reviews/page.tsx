"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

import RestaurantSidebar from "@/components/Navigation/RestaurantSidebar";
import ReviewCardSkeleton from "@/components/Review/ReviewCardSkeleton";
import ReviewsList from "@/components/Review/ReviewsList";
import { getRestaurantReviews } from "@/queries/reviews";

export default function ReviewsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // TODO: Replace with actual restaurant ID from auth/session
  // For now, using a placeholder ID
  const restaurantId = 1;

  // Fetch reviews with infinite scroll
  const {
    data: reviewsData,
    error: reviewsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: reviewsStatus,
  } = useInfiniteQuery({
    queryKey: ["restaurant-management-reviews", restaurantId],
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

  const allReviews = reviewsData?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="bg-app-white flex min-h-screen">
      <RestaurantSidebar />

      {/* Main Content Area */}
      <main className="ml-[290px] flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-app-bronze mb-2 flex items-center gap-3 text-4xl font-bold">
            <Star size={36} className="text-yellow-500" />
            Customer Reviews
          </h1>
          <p className="mb-8 text-lg text-gray-500">
            View and manage customer feedback and ratings for your restaurant.
          </p>

          {/* Reviews Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
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
                  Error loading reviews:{" "}
                  {reviewsError?.message || "Unknown error"}
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
                  {isFetchingNextPage && (
                    <p className="text-gray-600">Loading more reviews...</p>
                  )}
                  {!hasNextPage && allReviews.length === 0 && (
                    <p className="text-gray-500">
                      No reviews yet. Waiting for your first customer review!
                    </p>
                  )}
                  {!hasNextPage && allReviews.length > 0 && (
                    <p className="text-sm text-gray-500">
                      All reviews loaded ({allReviews.length} total)
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import type { FC, RefObject } from "react";

import type { DriverReview } from "@/types/review";

import DriverReviewCard from "./DriverReviewCard";
import DriverReviewCardSkeleton from "./DriverReviewCardSkeleton";

interface DriverReviewsListProps {
  reviews: DriverReview[];
  isLoadingNextPage?: boolean;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

const DriverReviewsList: FC<DriverReviewsListProps> = ({
  reviews,
  isLoadingNextPage,
  scrollContainerRef,
}) => {
  return (
    <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4">
      {reviews.map((review) => (
        <DriverReviewCard key={review.id} review={review} />
      ))}
      {isLoadingNextPage && (
        <>
          <DriverReviewCardSkeleton />
          <DriverReviewCardSkeleton />
          <DriverReviewCardSkeleton />
        </>
      )}
    </div>
  );
};

export default DriverReviewsList;

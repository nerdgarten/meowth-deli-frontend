import type { FC } from "react";
import type { RefObject } from "react";

import type { Review } from "@/types/review";

import ReviewCard from "./ReviewCard";
import ReviewCardSkeleton from "./ReviewCardSkeleton";

interface ReviewsListProps {
  reviews: Review[];
  isLoadingNextPage?: boolean;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

const ReviewsList: FC<ReviewsListProps> = ({
  reviews,
  isLoadingNextPage,
  scrollContainerRef,
}) => {
  return (
    <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {isLoadingNextPage && (
        <>
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
        </>
      )}
    </div>
  );
};

export default ReviewsList;

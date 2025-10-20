import type { FC } from "react";

const ReviewCardSkeleton: FC = () => {
  return (
    <div className="w-80 flex-shrink-0 animate-pulse rounded-lg bg-white p-4 font-sans shadow-sm">
      {/* Header: User Email and Rating */}
      <div className="mb-2 flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-gray-200"></div>
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-3.5 w-3.5 rounded bg-gray-200"
              ></div>
            ))}
          </div>
          <div className="h-3 w-4 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Review Body Text */}
      <div className="space-y-1">
        <div className="h-3 w-full rounded bg-gray-200"></div>
        <div className="h-3 w-4/5 rounded bg-gray-200"></div>
        <div className="h-3 w-3/5 rounded bg-gray-200"></div>
      </div>

      {/* Date */}
      <div className="mt-2 h-3 w-16 rounded bg-gray-200"></div>
    </div>
  );
};

export default ReviewCardSkeleton;

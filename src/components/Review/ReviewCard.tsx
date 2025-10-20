import { Star } from "lucide-react";
import type { FC } from "react";

import type { Review } from "@/types/review";

interface ReviewCardProps {
  review?: Review;
}

const ReviewCard: FC<ReviewCardProps> = ({ review }) => {
  if (!review) {
    return (
      <div className="w-80 flex-shrink-0 rounded-lg bg-white p-4 font-sans shadow-sm">
        <p className="text-gray-500">No review data available.</p>
      </div>
    );
  }

  const { rate, review_text, user, created_at } = review;

  // Format the date
  const formattedDate = new Date(created_at).toLocaleDateString();

  // Render stars based on rate (assuming rate is out of 5)
  const maxStars = 5;
  const starRating = Math.round(rate);

  return (
    <div className="w-80 flex-shrink-0 rounded-lg bg-white p-4 font-sans shadow-sm">
      {/* Header: User Email and Rating */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {user.email}
        </h3>
        <div className="flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: maxStars }).map((_, index) => (
              <Star
                key={index}
                size={14}
                className={
                  index < starRating ? "text-yellow-400" : "text-gray-300"
                }
                fill={index < starRating ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-700">{rate}</span>
        </div>
      </div>

      {/* Review Body Text */}
      {review_text ? (
        <p
          className="overflow-hidden text-xs leading-relaxed text-gray-600"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {review_text}
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-gray-400 italic">
          No review text provided.
        </p>
      )}

      {/* Date */}
      <p className="mt-2 text-xs text-gray-500">{formattedDate}</p>
    </div>
  );
};

export default ReviewCard;

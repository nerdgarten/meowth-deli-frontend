"use client";

import Image from "next/image";
import { ImageIcon, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/libs/axios";
import type { DriverReview } from "@/types/review";

export default function DriverReviewsPage() {
  // Get the current authenticated driver's profile
  const { data: driverProfile } = useQuery({
    queryKey: ["driver-profile"],
    queryFn: async () => {
      const response = await apiClient.get<{
        id: number;
        firstname: string;
        lastname: string;
      }>("/driver/profile");
      return response.data;
    },
    staleTime: Infinity,
  });

  const driverId = driverProfile?.id;

  const { data: reviews = [], isLoading } = useQuery<DriverReview[]>({
    queryKey: ["driver-reviews", driverId],
    queryFn: async () => {
      const response = await apiClient.get<DriverReview[]>(
        `/review/driver/${driverId}`
      );
      return response.data;
    },
    enabled: !!driverId,
  });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 text-[#2a1a0f]">
      <section className="border-b-app-background rounded-[36px] border bg-white px-8 py-10 shadow-[0_30px_60px_rgba(93,66,17,0.08)]">
        <header className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.2em] text-[#c0a476] uppercase">
            Driver Reviews
          </p>
          <h1 className="text-3xl font-semibold text-[#1d140d]">
            {driverProfile
              ? `${driverProfile.firstname} ${driverProfile.lastname}`
              : "Loading..."}
          </h1>
        </header>

        <div className="mt-10 space-y-6">
          {isLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="py-8 text-center text-[#8a7a70]">No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

const ratingColor = {
  fill: "#F7B308",
  empty: "#E9D7B9",
};

function ReviewCard({ review }: { review: DriverReview }) {
  // Format the date
  const reviewDate = new Date(review.created_at);
  const formattedDate = reviewDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = reviewDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="border-b-app-background bg-app-white flex w-full flex-col gap-6 rounded-[32px] border p-6 shadow-[0_15px_30px_rgba(93,66,17,0.06)] md:flex-row md:items-start md:gap-8">
      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const isFilled = index < review.rate;
                return (
                  <Star
                    key={index}
                    className="size-5"
                    strokeWidth={1.5}
                    color={isFilled ? ratingColor.fill : ratingColor.empty}
                    fill={isFilled ? ratingColor.fill : "transparent"}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6f553a]">
            <span className="font-medium">
              {review.customer.firstname} {review.customer.lastname}
            </span>
          </div>
        </div>
        {review.review_text && (
          <p className="text-sm leading-relaxed text-[#4a3a2f]">
            {review.review_text}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end justify-between gap-4 md:min-w-[160px] md:items-end">
        <div className="flex items-baseline gap-2 text-right text-sm font-medium text-[#5c4b40]">
          <p>{formattedDate}</p>
          <p className="text-[#8a7a70]">{formattedTime}</p>
        </div>
        <div className="relative flex aspect-square w-32 items-center justify-center overflow-hidden rounded-3xl border border-[#f0e3c5] bg-[#fff8eb] shadow-inner md:w-36">
          <ImageIcon className="h-12 w-12 text-[#8c7254]" />
        </div>
      </div>
    </div>
  );
}

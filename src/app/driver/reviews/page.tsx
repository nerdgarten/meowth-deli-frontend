"use client";
import { useAuth } from "@/components/context/AuthContext";
import { getDriverReviews } from "@/queries/reviews";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon, Star } from "lucide-react";
import Image from "next/image";
import { DriverReview, type DriverReviewResponse } from "@/types/review";
import { use, useMemo } from "react";

const DRIVER_NAME = "Mr. Suthinat Chonpaisarn";

// const reviews: Review[] = [
//   {
//     id: 1,
//     title: "ไม่อร่อย 2/10",
//     rating: 4,
//     tags: ["Fast", "Good Quality", "Good Packaging", "Fresh"],
//     comment:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//     date: "12/34/2098",
//     time: "23:45",
//   },
//   {
//     id: 2,
//     title: "ไม่อร่อย 2/10",
//     rating: 4,
//     tags: ["Fast", "Good Quality", "Good Packaging", "Fresh"],
//     comment:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//     date: "12/34/2098",
//     time: "23:45",
//     image: "/images/meowth-eating.webp",
//   },
// ];

const ratingColor = {
  fill: "#F7B308",
  empty: "#E9D7B9",
};

export default function DriverReviewsPage() {
  const driverId = 81;
  const { data } = useQuery<DriverReviewResponse | undefined>({
    queryKey: ["restaurant-profile", [driverId]],
    queryFn: async () => {
      console.log("Fetching driver reviews for driverId:", driverId);
      if (!driverId) return undefined;
      return getDriverReviews({ driverId: driverId });
    },
  });
  const reviews = useMemo(() => data?.data ?? [], [data]);
  console.log(reviews);
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 text-[#2a1a0f]">
      <section className="border-b-app-background rounded-[36px] border bg-white px-8 py-10 shadow-[0_30px_60px_rgba(93,66,17,0.08)]">
        <header className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.2em] text-[#c0a476] uppercase">
            Driver Reviews
          </p>
          <h1 className="text-3xl font-semibold text-[#1d140d]">
            {DRIVER_NAME}
          </h1>
        </header>

        <div className="mt-10 space-y-6">
          {reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}

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
            <h2 className="text-app-black text-xl font-semibold">TEST TITLE</h2>
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
        {false ? (
          <div className="relative aspect-square w-32 overflow-hidden rounded-3xl border border-[#f0e3c5] bg-[#fff8eb] shadow-inner md:w-36">
            <Image
              src={"TODO"}
              alt={`TEST TITLE photo`}
              fill
              className="object-cover"
              sizes="144px"
            />
          </div>
        ) : (
          <div className="relative flex aspect-square w-32 items-center justify-center overflow-hidden rounded-3xl border border-[#f0e3c5] bg-[#fff8eb] shadow-inner md:w-36">
            <ImageIcon className="h-12 w-12 text-[#8c7254]" />
          </div>
        )}
      </div>
    </div>
  );
}

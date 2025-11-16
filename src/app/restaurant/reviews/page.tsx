import Image from "next/image";
import { Star } from "lucide-react";

type Review = {
  id: number;
  title: string;
  rating: number;
  tags: string[];
  comment: string;
  date: string;
  time: string;
  image?: string;
};

const RESTAURANT_NAME = "Meowth Deli";

const reviews: Review[] = [
  {
    id: 1,
    title: "ไม่อร่อย 2/10",
    rating: 4,
    tags: ["Fast", "Good Quality", "Good Packaging", "Fresh"],
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "12/34/2098",
    time: "23:45",
  },
  {
    id: 2,
    title: "ไม่อร่อย 2/10",
    rating: 4,
    tags: ["Fast", "Good Quality", "Good Packaging", "Fresh"],
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "12/34/2098",
    time: "23:45",
    image: "/images/meowth-eating.webp",
  },
];

const ratingColor = {
  fill: "#F7B308",
  empty: "#E9D7B9",
};

export default function RestairentDriverReviewsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 text-[#2a1a0f]">
      <section className="border-b-app-background rounded-[36px] border bg-white px-8 py-10 shadow-[0_30px_60px_rgba(93,66,17,0.08)]">
        <header className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.2em] text-[#c0a476] uppercase">
            Restaurant Reviews
          </p>
          <h1 className="text-3xl font-semibold text-[#1d140d]">
            {RESTAURANT_NAME}
          </h1>
        </header>

        <div className="mt-10 space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b-app-background bg-app-white flex w-full flex-col gap-6 rounded-[32px] border p-6 shadow-[0_15px_30px_rgba(93,66,17,0.06)] md:flex-row md:items-start md:gap-8">
      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-app-black text-xl font-semibold">
              {review.title}
            </h2>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const isFilled = index < review.rating;
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
        </div>
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="border-b-app-background bg-app-background rounded-full border px-4 py-1 text-sm font-semibold text-[#6f4a00] shadow-inner"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-[#4a3a2f]">
          {review.comment}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between gap-4 md:min-w-[160px] md:items-end">
        <div className="flex items-baseline gap-2 text-right text-sm font-medium text-[#5c4b40]">
          <p>{review.date}</p>
          <p className="text-[#8a7a70]">{review.time}</p>
        </div>
        {review.image && (
          <div className="relative aspect-square w-32 overflow-hidden rounded-3xl border border-[#f0e3c5] bg-[#fff8eb] shadow-inner md:w-36">
            <Image
              src={review.image}
              alt={`${review.title} photo`}
              fill
              className="object-cover"
              sizes="144px"
            />
          </div>
        )}
      </div>
    </div>
  );
}

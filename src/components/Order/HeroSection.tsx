interface HeroSectionProps {
  message: string;
  reportLink: string;
}

export default function HeroSection({ message, reportLink }: HeroSectionProps) {
  // Parse the message to extract the restaurant name
  const parts = message.split("has");
  const restaurantName = parts[0]?.trim() ?? message;

  return (
    <div className="h-full rounded-2xl bg-white p-4 shadow-lg lg:p-6">
      <div className="flex h-full flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <svg
            className="h-20 w-20 text-gray-300 sm:h-24 sm:w-24 lg:h-32 lg:w-32"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="50"
              y="100"
              width="100"
              height="20"
              rx="10"
              fill="#FBBF24"
            />
            <rect
              x="55"
              y="120"
              width="90"
              height="15"
              rx="7.5"
              fill="#4ADE80"
            />
            <rect
              x="45"
              y="135"
              width="110"
              height="25"
              rx="12.5"
              fill="#A16207"
            />
            <path
              d="M40 90 H 160 Q 170 90 170 80 L 170 70 Q 170 60 160 60 H 40 Q 30 60 30 70 L 30 80 Q 30 90 40 90 Z"
              fill="#F59E0B"
            />
            <path
              d="M70 40 L 75 20 L 85 20 L 90 40"
              stroke="#3B82F6"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect x="110" y="10" width="10" height="50" rx="5" fill="#3B82F6" />
            <path
              d="M100 60 Q 120 40 130 10"
              stroke="#3B82F6"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Yay! <span className="text-orange-500">{restaurantName}</span> has
            received your order.
          </h1>
          <div className="mt-3">
            <p className="text-sm text-gray-600">Something went wrong?</p>
            <a
              href={reportLink}
              className="inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Click here to report problem
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

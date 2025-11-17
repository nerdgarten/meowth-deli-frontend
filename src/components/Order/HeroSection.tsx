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
  );
}

import Image from "next/image";

interface HeroSectionProps {
  message: string;
}

export default function HeroSection({ message }: HeroSectionProps) {
  // Parse the message to extract the restaurant name
  const parts = message.split("has");
  const restaurantName = parts[0]?.trim() ?? message;

  return (
    <div className="h-full rounded-2xl bg-white p-4 shadow-lg lg:p-6">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/images/meowth-cooking.webp"
          alt="Meowth Delivery Logo"
          width={150}
          height={150}
          className="mt-4 rounded-full"
        />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
          Yay! <span className="text-orange-500">{restaurantName}</span> has
          received your order.
        </h1>
      </div>
    </div>
  );
}

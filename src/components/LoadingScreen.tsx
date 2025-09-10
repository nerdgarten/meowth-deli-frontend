import Image from "next/image";

export const LoadingScreen = () => {
  return (
    <div className="bg-app-brown fixed z-100 flex h-screen w-full overflow-hidden">
      <div className="m-auto flex flex-col items-center gap-y-4">
        <div className="relative">
          <div className="bg-app-yellow h-80 w-80 rounded-full" />
          <Image
            src="/images/meowth-cooking.webp"
            alt="Logo"
            width={300}
            height={300}
            className="absolute inset-0 m-auto"
          />
        </div>
        <div className="">
          <p className="text-center text-2xl font-semibold text-white">
            <span className="text-app-yellow">Join the App</span> That Brings
            You More Orders.
          </p>
          <p className="text-lg text-[#E8C78D]">
            Thousands of hungry customers are waiting. By becoming a partner,
            your restaurant <br />
            gets instant exposure, more visibility, and a steady stream of new
            orders every day.
          </p>
        </div>
      </div>
    </div>
  );
};

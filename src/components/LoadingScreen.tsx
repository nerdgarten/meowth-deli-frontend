import Image from "next/image";

export const LoadingScreen = () => {
  return (
    <div className="bg-app-brown fixed z-100 flex h-screen w-full">
      <div className="m-auto flex flex-col items-center">
        <div className="relative">
          <div className="bg-app-yellow h-80 w-80 rounded-full" />
          <Image
            src="/images/meowth-cooking.png"
            alt="Logo"
            width={300}
            height={300}
            className="absolute inset-0 m-auto"
          />
        </div>
      </div>
    </div>
  );
};

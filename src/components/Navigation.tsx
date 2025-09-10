import { NavigateImage } from "./common/NavigateImage";

export const Navigation = () => {
  return (
    <nav className="bg-app-brown fixed top-0 flex w-screen py-4">
      <div className="flex w-full items-center justify-end">
        <div className="mr-3 flex gap-x-6">
          <NavigateImage
            href="/profile"
            src="/icons/User.svg"
            alt="User Icon"
            className="h-auto w-[1.75rem]"
          />
          <NavigateImage
            href="/settings"
            src="/icons/Hamburger.svg"
            alt="Hamburger Icon"
            className="h-auto w-[1.75rem]"
          />
        </div>
      </div>
    </nav>
  );
};

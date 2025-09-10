import { LuFilter, LuSearch } from "react-icons/lu";

export const LandingScreen = () => {
  return (
    <div className="mx-4 mt-18 mb-8 flex items-center gap-5 px-4">
      <div className="flex grow rounded-full bg-white px-6 py-3 shadow-md">
        <input
          type="text"
          className="w-full"
          placeholder="Feeling hungry? Search for something to eat..."
        />
        <LuSearch className="text-app-yellow inline stroke-2 text-2xl" />
      </div>
      <div>
        <div className="flex overflow-hidden rounded-full shadow-md">
          <div className="text-app-yellow flex items-center gap-1 bg-white py-3 pr-3 pl-6 font-semibold shadow">
            Filter
            <LuFilter className="inline stroke-2 text-2xl" />
          </div>
          <div className="bg-app-brown flex w-full items-center justify-center gap-2 px-3">
            <div className="bg-app-tan rounded-full px-3 py-1 font-semibold text-nowrap text-white">
              Burger
            </div>
            <div className="bg-app-tan rounded-full px-3 py-1 font-semibold text-nowrap text-white">
              Fast Food
            </div>
            <div className="bg-app-tan rounded-full px-3 py-1 font-semibold text-nowrap text-white">
              Meal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

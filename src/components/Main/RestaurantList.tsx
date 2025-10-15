"use client";

export const RestaurantList = () => {
    const dummyArray = [
        1,2,3,4, 5,6
    ]
  return (
    <div className="grid-row-6 mx-4 grid h-full grid-cols-1 gap-4 rounded-sm bg-white p-4">
      <div className="bg-app-background relative col-span-1 row-span-4 flex items-center justify-start overflow-hidden rounded-2xl">
        <div className="absolute grid grid-rows-2 gap-4 p-16">
          <h2 className="text-app-brown text-4xl font-bold">Text1</h2>
          <h2 className="text-app-white text-4xl font-bold">Text2</h2>
        </div>
        <div className="bg-app-yellow absolute inset-0 h-full w-full origin-left translate-x-113 skew-x-12 transform"></div>
        <div className="absolute inset-0 h-full w-full origin-left translate-x-120 skew-x-20 transform bg-black"></div>
      </div>
      <div className="col-span-1 row-span-1 grid grid-cols-4 grid-rows-5 gap-4">
        <h3 className="col-span-4 row-span-1 text-3xl font-bold">
          Your Favourite Food
        </h3>
        <div className="col-span-4 row-span-4 flex w-full gap-20 overflow-x-auto p-3">
          {dummyArray.map((item) => (
            <div
              key={item}
              className="w-72 flex-shrink-0 rounded-lg bg-slate-400 p-2 shadow-lg"
            >
              <div className="h-3/5 rounded-lg bg-slate-800"></div>
              <h4 className="font-semibold">Restaurant Name</h4>
              <p>Test Bro</p>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-1 row-span-1 grid grid-cols-4 grid-rows-5 gap-4">
        <h3 className="col-span-4 row-span-1 text-3xl font-bold">Recommend</h3>
        <div className="col-span-4 row-span-4 flex w-full gap-20 overflow-x-auto p-3">
          {dummyArray.map((item) => (
            <div
              key={item}
              className="w-72 flex-shrink-0 rounded-lg bg-slate-400 p-2 shadow-lg"
            >
              <div className="h-3/5 rounded-lg bg-slate-800"></div>
              <h4 className="font-semibold">Restaurant Name</h4>
              <p>Test Bro</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


import { ChevronLeft } from "lucide-react";
import { CartItem } from "@/types/order";
interface OrderSummaryProps {
  cartItem: CartItem[];
  restaurantName: string;
  TotalPrice: number;
}
export const OrderSummary = ({
    cartItem,
    restaurantName,
    TotalPrice
  } : OrderSummaryProps
) => {
  const dummyItems = [
    {
      restaurant: "Sushi",
      time: "12:30 PM",
      menu: [
        { name: "Sushi Platter", quantity: 1, price: 12.99 },
        { name: "Ramen", quantity: 1, price: 10.99 },
      ],
    },
    {
      restaurant: "Sushi",
      time: "12:30 PM",
      menu: [
        { name: "Sushi Platter", quantity: 1, price: 12.99 },
        { name: "Ramen", quantity: 1, price: 10.99 },
      ],
    },
  ];
    const price = 20.99;
    const fee = 2.99;
  return (
    <div className="flex flex-col rounded-sm bg-white p-4">
      <div className="h-full border-b p-4">
        <div>
          <h2 className="text-4xl font-bold">{restaurantName}</h2>
          {/* <h3 className="text-md font-semibold text-gray-400">{item.time}</h3> */}
          <div className="mx-4 mt-12 flex flex-col gap-4">
            <div className="flex justify-between">
              <h3 className="text-2xl font-bold">Order Summary</h3>
              <h4 className="text-xl font-bold text-purple-700">Add Items</h4>
            </div>

            {cartItem.map((menuItem, idx) => (
              <div key={idx} className="mt-4 flex h-full justify-between">
                <div className="flex gap-6">
                  <div className="aspect-square h-24 rounded-sm bg-slate-200" />
                  <div className="text-lg font-bold">
                    <h4 className="text-black">{menuItem.dish.name} x {menuItem.quantity}</h4>
                    <h4 className="text-purple-700">Edit</h4>
                  </div>
                </div>
                <h4 className="text-lg font-semibold">
                  {(menuItem.quantity * menuItem.dish.price).toFixed(2)} THB
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-8 mt-10 flex flex-col gap-4">
        <div className="flex h-full justify-between">
          <h2 className="text-lg font-bold">Subtotal</h2>
          <h2 className="text-lg font-semibold">{price}</h2>
        </div>

        <div className="flex h-full justify-between">
          <h2 className="text-lg font-bold">Delivery Fee</h2>
          {/* <h2 className="text-lg font-semibold">{fee}</h2> */}
        </div>
        <div className="flex h-16 w-full items-center justify-between rounded-md border border-slate-300 p-8 transition hover:bg-gray-100 active:bg-gray-300">
          <h2 className="mx-4 text-lg font-bold">Map</h2>
          <ChevronLeft size={20} />
        </div>
        <div className="flex h-full justify-between">
          <h2 className="text-lg font-bold">Total</h2>
          <h2 className="text-lg font-semibold">{TotalPrice.toFixed(2)}</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 grid-rows-6">
          <h1 className="col-span-1 row-span-1 text-lg font-bold">
            Note to Restaurant
          </h1>
          <div className="flex w-full justify-end">
            <div className="fond-semibold flex h-fit w-18 items-center justify-center gap-2 rounded-sm bg-slate-200 text-sm">
              Optional
            </div>
          </div>
          <input
            type="text"
            className="focus:border-app-brown focus:ring-app-brown col-span-2 row-span-5 mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:ring-1 focus:outline-none"
            placeholder="E.g. No onions, extra spicy, etc."
          />
        </div>
        <button className="bg-app-yellow active:bg-app-bronze mt-8 w-full rounded-full p-4 text-center text-2xl font-bold text-white transition hover:bg-amber-500">
          Place Order
        </button>
      </div>
    </div>
  );
};

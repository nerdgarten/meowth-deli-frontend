import { Clock } from "lucide-react";
import { Map } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { IOrder } from "@/types/order";
import type { StringLiteral } from "typescript";

const getStatusColor = (
  status: "pending" | "preparing" | "delivered" | "rejected" | "success"
) => {
  switch (status) {
    case "pending":
      return "text-red-500";
    case "preparing":
      return "text-amber-200";
    case "delivered":
      return "text-yellow-400";
    default:
      return "";
  }
};
const getStatusText = (
  status: "pending" | "preparing" | "delivered" | "rejected" | "success"
) => {
  switch (status) {
    case "pending":
      return "To Do";
    case "preparing":
      return "In Progress";
    case "delivered":
      return "Complete";
    default:
      return "";
  }
};


interface OrderStatusProps {
  order: IOrder;
}

export const OrderStatusMenu = ({
  order
} : OrderStatusProps ) => {

    

    return (
      <div className="grid grid-cols-6 grid-rows-7 gap-8 rounded-sm bg-white p-16">
        <div className="col-span-6 row-span-1">
          <h1 className="text-xl font-bold">Order Status</h1>
          <h2 className="text-xl font-semibold text-gray-400">
            Invoice : {order.id}
          </h2>
        </div>
        <div className="col-span-4 row-span-2"></div>
        <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-2">
          <h2 className="col-span-1 row-span-1 text-xl font-semibold">
            Driver Name:
          </h2>
          <h2 className="col-span-1 row-span-1 text-xl font-semibold">
            {order.customer_id}
          </h2>
          <h2 className="col-span-1 row-span-1 text-xl font-semibold">From:</h2>
          {/* <h2 className="col-span-1 row-span-1 text-xl font-semibold">
            {order.}
          </h2> */}
        </div>
        <div className="col-span-5 row-span-1"></div>
        <h4 className="col-span-1 row-span-1 text-xl font-bold">Status</h4>

        <div className="col-span-5 row-span-1 flex items-center gap-16">
          <Clock size={40} />
          <h4 className="text-xl font-bold">Order Received</h4>
        </div>
        <h4
          className={`col-span-1 row-span-1 text-xl font-bold ${getStatusColor(order.status)}`}
        >
          {getStatusText(order.status)}
        </h4>
        <div className="col-span-5 row-span-1 flex items-center gap-16">
          <Map size={40} />
          <h4 className="text-xl font-bold">Preparing Order</h4>
        </div>

        <h4
          className={`col-span-1 row-span-1 text-xl font-bold ${getStatusColor(order.status)}`}
        >
          {getStatusText(order.status)}
        </h4>
        <div className="col-span-5 row-span-1 flex items-center gap-16">
          <CircleCheck size={40} />
          <h4 className="text-xl font-bold">On The Way</h4>
        </div>
        <h4
          className={`col-span-1 row-span-1 text-xl font-bold ${getStatusColor(order.status)}`}
        >
          {getStatusText(order.status)}
        </h4>
      </div>
    );
};
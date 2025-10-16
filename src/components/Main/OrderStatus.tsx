import { Clock } from "lucide-react";
import { Map } from "lucide-react";
import { CircleCheck } from "lucide-react";

const getStatusColor = (status: "to_do" | "in_progress" | "complete") => {
  switch (status) {
    case "to_do":
      return "text-red-500";
    case "in_progress":
      return "text-amber-200";
    case "complete":
      return "text-yellow-400";
    default:
      return "";
  }
};
const getStatusText = (status: "to_do" | "in_progress" | "complete") => {
    switch (status) {
        case "to_do":
            return "To Do";
        case "in_progress":
            return "In Progress";
        case "complete":
            return "Complete";
        default:
            return "";
    }
}

export const OrderStatus = () => {
    interface OrderStatus {
        order_received: "to_do" | "in_progress" | "complete";
        preparing_order: "to_do" | "in_progress" | "complete";
        on_the_way: "to_do" | "in_progress" | "complete";
    }
    const invoice = "123456";
    const name = "John Doe";
    const from = "Restaurant A";
    const order_status = {
        order_received: "complete",
        preparing_order: "in_progress",
        on_the_way: "to_do",
    } as OrderStatus;

    return (
      <div className="grid grid-cols-6 grid-rows-7 gap-8 rounded-sm bg-white p-16">
        <div className="col-span-6 row-span-1">
          <h1 className="text-xl font-bold">Order Status</h1>
          <h2 className="text-xl font-semibold text-gray-400">
            Invoice : {invoice}
          </h2>
        </div>
        <div className="col-span-4 row-span-2"></div>
        <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-2">
          <h2 className="col-span-1 row-span-1 text-xl font-semibold">
            Driver Name:
          </h2>
          <h2 className="col-span-1 row-span-1 text-xl font-semibold">
            {name}
          </h2>
          <h2 className="col-span-1 row-span-1 text-xl font-semibold">From:</h2>
          <h2 className="col-span-1 row-span-1 text-xl font-semibold">
            {from}
          </h2>
        </div>
        <div className="col-span-5 row-span-1"></div>
        <h4 className="col-span-1 row-span-1 text-xl font-bold">Status</h4>

        <div className="col-span-5 row-span-1 flex items-center gap-16">
          <Clock size={40} />
          <h4 className="text-xl font-bold">Order Received</h4>
        </div>
        <h4
          className={`col-span-1 row-span-1 text-xl font-bold ${getStatusColor(order_status.order_received)}`}
        >
          {getStatusText(order_status.order_received)}
        </h4>
        <div className="col-span-5 row-span-1 flex items-center gap-16">
          <Map size={40} />
          <h4 className="text-xl font-bold">Preparing Order</h4>
        </div>

        <h4
          className={`col-span-1 row-span-1 text-xl font-bold ${getStatusColor(order_status.preparing_order)}`}
        >
          {getStatusText(order_status.preparing_order)}
        </h4>
        <div className="col-span-5 row-span-1 flex items-center gap-16">
          <CircleCheck size={40} />
          <h4 className="text-xl font-bold">On The Way</h4>
        </div>
        <h4
          className={`col-span-1 row-span-1 text-xl font-bold ${getStatusColor(order_status.on_the_way)}`}
        >
          {getStatusText(order_status.on_the_way)}
        </h4>
      </div>
    );
};
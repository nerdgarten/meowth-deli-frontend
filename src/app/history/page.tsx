"use client";

export default function OrdersPage() {
  // Mock data - replace with actual data fetching
  const orders = [
    {
      id: 1,
      orderId: "ORD-001",
      timestamp: "20 Oct 14:00",
      status: "Pending",
    },
    {
      id: 2,
      orderId: "ORD-002",
      timestamp: "20 Oct 12:00",
      status: "Cooking",
    },
    {
      id: 3,
      orderId: "ORD-003",
      timestamp: "20 Oct 14:02",
      status: "Complete",
    },
    {
      id: 4,
      orderId: "ORD-004",
      timestamp: "20 Oct 14:01",
      status: "Complete",
    },
    {
      id: 5,
      orderId: "ORD-005",
      timestamp: "20 Oct 14:05",
      status: "Cooking",
    },
    {
      id: 6,
      orderId: "ORD-006",
      timestamp: "20 Oct 14:10",
      status: "Cooking",
    },
    {
      id: 7,
      orderId: "ORD-007",
      timestamp: "20 Oct 14:23",
      status: "Cooking",
    },
    {
      id: 8,
      orderId: "ORD-008",
      timestamp: "20 Oct 14:00",
      status: "Cooking",
    },
    {
      id: 9,
      orderId: "ORD-009",
      timestamp: "20 Oct 13:57",
      status: "Pending",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-red-500";
      case "cooking":
        return "text-gray-500";
      case "complete":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-app-white flex min-h-screen pt-20">
      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-app-bronze mb-2 text-4xl font-bold">
            Order History
          </h1>
          <p className="mb-8 text-lg text-gray-500">
            Viewing and managing your past orders here.
          </p>

          {/* Orders Table */}
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="text-app-dark-brown px-6 py-4 text-left text-lg font-bold">
                      No.
                    </th>
                    <th className="text-app-dark-brown px-6 py-4 text-left text-lg font-bold">
                      Order ID
                    </th>
                    <th className="text-app-dark-brown px-6 py-4 text-left text-lg font-bold">
                      Timestamp
                    </th>
                    <th className="text-app-dark-brown px-6 py-4 text-left text-lg font-bold">
                      Status
                    </th>
                    <th className="text-app-dark-brown px-6 py-4 text-left text-lg font-bold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      <td className="text-app-dark-brown px-6 py-4 text-base font-semibold">
                        {order.id}
                      </td>
                      <td className="text-app-dark-brown px-6 py-4 text-base font-medium">
                        {order.orderId}
                      </td>
                      <td className="text-app-dark-brown px-6 py-4 text-base">
                        {order.timestamp}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-base font-semibold ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="bg-app-yellow hover:bg-app-yellow/90 rounded-lg px-6 py-2 text-sm font-semibold text-white transition-colors">
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

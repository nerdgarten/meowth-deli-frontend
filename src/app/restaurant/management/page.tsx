"use client";

import RestaurantSidebar from "@/components/Navigation/RestaurantSidebar";

export default function RestaurantManagementPage() {
  return (
    <div className="bg-app-white flex min-h-screen pt-20">
      <RestaurantSidebar />

      {/* Main Content Area */}
      <main className="ml-[290px] flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-app-dark-brown mb-2 text-3xl font-bold">
            Dashboard
          </h1>
          <p className="text-app-brown mb-8">
            Welcome to your restaurant management dashboard
          </p>

          {/* Dashboard content will go here */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder cards */}
            <div className="border-app-tan/30 rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-app-dark-brown mb-2 text-lg font-semibold">
                Total Orders
              </h3>
              <p className="text-app-bronze text-3xl font-bold">0</p>
            </div>

            <div className="border-app-tan/30 rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-app-dark-brown mb-2 text-lg font-semibold">
                Pending Orders
              </h3>
              <p className="text-app-bronze text-3xl font-bold">0</p>
            </div>

            <div className="border-app-tan/30 rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-app-dark-brown mb-2 text-lg font-semibold">
                Total Reviews
              </h3>
              <p className="text-app-bronze text-3xl font-bold">0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { RestaurantList } from "@/components/Main/RestaurantList";

export default function RestaurantPage() {
  // TODO: Fetch Data from API
  return (
    <main className="p-16 h-300 w-full overflow-auto">
      <RestaurantList/>

    </main>
  );
}

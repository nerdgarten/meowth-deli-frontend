"use client";
import { useState, useEffect } from "react";
import { RestaurantList } from "@/components/Main/RestaurantList";
import { IDish } from "@/types/dish";
import { useRouter } from "next/navigation";
import { getDishRestuarantId, getRestaurantById} from "@/libs/restaurant";
export default function RestaurantPage({ params }: { params: { id: string } }) {
  // TODO: Fetch Data from API
  const [data, setData] = useState<IDish[]>([{
    id: 0,
    name: "",
    detail: "",
    price: 0,
    allergy: "",
    restaurant_id: 0,
    is_out_of_stock: false,
  }]);
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const onDishClick = (dish: IDish) => {
    router.push(`/${params.id}/${dish.id}`);
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result_1 = await getRestaurantById(params.id);
        const result_2 = await getDishRestuarantId(params.id);
        setName(result_1.name);
        setData(result_2);
      } catch (err) {
        console.error("Failed to fetch dishes:", err);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <main className="h-300 w-full overflow-auto p-16">
      <RestaurantList
        dishes={data}
        restaurant={name}
        onDishClick={onDishClick}
      />
    </main>
  );
}

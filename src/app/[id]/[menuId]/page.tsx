"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import { SelectMenu } from "@/components/Main/SelectMenu";
import { IDish } from "@/types/dish";
import { getDishById } from "@/libs/dish";
import { getDishRestuarantId } from "@/libs/restaurant";

export default function MenuPage({ params }: { params: { id: string, menuId: string} }) {

  const [dish, setDish] = useState<IDish>({
    id: 0,
    restaurant_id: 0,
    name: "",
    allergy: "",
    price: 0,
    detail: "",
    is_out_of_stock: false,
  });
  const [recommendations, setRecommendations] = useState<IDish[]>([]);

  
    useEffect(() => {
      const fetchData = async () => {
        const result = await getDishById(params.menuId);
        const result_2 = await getDishRestuarantId(params.id);
        setRecommendations(result_2);
        setDish(result);

      }
      fetchData();
    }, [params]);

  return (
    <main className="h-230 w-full overflow-auto p-16">
      <h1>
      </h1>
      <SelectMenu
        dish={dish}
        recommendations={recommendations}
      />
    </main>
  );
}

"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import { SelectMenu } from "@/components/Main/SelectMenu";
import { IDish } from "@/types/dish";
import { useRouter } from "next/navigation";

export default function MenuPage({ params }: { params: { id: string, menuId: string} }) {

  const [data, setData] = useState<{ id: string, menuId: string }>({id: "", menuId: "" });
  const [dish, setDish] = useState<IDish>({
    id: 0,
    restaurant_id: 0,
    name: "",
    allergy: "",
    price: 0,
    detail: "",
    is_out_of_stock: false,
  });

  const router = useRouter();
    const dummyDishes = [
      {
        id: 1,
        restaurant_id: 1,
        name: "Spicy Pad Thai",
        allergy: "peanuts, shellfish",
        price: 129.0,
        detail:
          "Classic Thai stir-fried rice noodles with shrimp, tofu, and crushed peanuts",
        is_out_of_stock: false,
      },
      {
        id: 2,
        restaurant_id: 1,
        name: "Green Curry",
        allergy: "dairy",
        price: 149.0,
        detail:
          "Traditional Thai green curry with coconut milk, chicken, and vegetables",
        is_out_of_stock: false,
      },
      {
        id: 3,
        restaurant_id: 2,
        name: "Sushi Set A",
        allergy: "raw fish, soy",
        price: 399.0,
        detail: "Assorted sushi including salmon, tuna, and yellowtail",
        is_out_of_stock: false,
      },
      {
        id: 4,
        restaurant_id: 2,
        name: "Ramen Tonkotsu",
        allergy: "eggs, wheat",
        price: 189.0,
        detail: "Pork bone broth ramen with chashu and soft-boiled egg",
        is_out_of_stock: false,
      },
      {
        id: 5,
        restaurant_id: 3,
        name: "Margherita Pizza",
        allergy: "gluten, dairy",
        price: 259.0,
        detail:
          "Classic Italian pizza with tomato sauce, mozzarella, and basil",
        is_out_of_stock: false,
      },
      {
        id: 6,
        restaurant_id: 3,
        name: "Carbonara",
        allergy: "eggs, dairy, gluten",
        price: 219.0,
        detail: "Spaghetti with creamy egg sauce, pancetta, and parmesan",
        is_out_of_stock: true,
      },
      {
        id: 7,
        restaurant_id: 1,
        name: "Mango Sticky Rice",
        allergy: "none",
        price: 99.0,
        detail: "Sweet sticky rice with fresh mango and coconut cream",
        is_out_of_stock: false,
      },
      {
        id: 8,
        restaurant_id: 2,
        name: "Tempura Set",
        allergy: "shellfish, wheat",
        price: 289.0,
        detail: "Assorted tempura with prawns and vegetables",
        is_out_of_stock: false,
      },
      {
        id: 9,
        restaurant_id: 3,
        name: "Tiramisu",
        allergy: "eggs, dairy, coffee",
        price: 159.0,
        detail:
          "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
        is_out_of_stock: false,
      },
      {
        id: 10,
        restaurant_id: 1,
        name: "Tom Yum Goong",
        allergy: "shellfish",
        price: 199.0,
        detail: "Spicy and sour soup with prawns and mushrooms",
        is_out_of_stock: false,
      },
    ] as IDish[];

    
    const Ddish = dummyDishes.find((d) => d.id.toString() === params.menuId) || null;
  
    useEffect(() => {
      // Simulate fetching data
      console.log("Params:", params);
      if(Ddish){
        setDish(Ddish);
      }
      setData({ id: params.id, menuId: params.menuId });
    }, [params, ]);

  return (
    <main className="h-230 w-full overflow-auto p-16">
      <h1>
      </h1>
      <SelectMenu
        dish={Ddish}
        recommendations={dummyDishes}
      />
    </main>
  );
}

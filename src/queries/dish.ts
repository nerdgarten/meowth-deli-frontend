import { apiClient } from "@/libs/axios";
import type { IDish } from "@/types/dish";

export async function getDishesByRestaurnatId(
    restaurantId: number
): Promise<IDish[]> {
    const response = await apiClient.get<IDish[]>(`/dish/restaurant/${restaurantId}`);

    return response.data;
}

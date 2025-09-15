import { z } from "zod";
import { apiClient } from "@/libs/axios";

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginSubmitMutation(data: z.infer<typeof LoginFormSchema>) {
  const response = await apiClient.post<typeof LoginFormSchema>("/auth/signin", {
    email: data.email,
    password: data.password,
    role: "customer",
  });

  return response.data;
}
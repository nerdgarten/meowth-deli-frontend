import { z } from "zod";
import { apiClient } from "@/libs/axios";
import type { Role } from "@/types/role";

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

export const CustomerRegisterFormSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Surname is required"),
    tel: z
    .string()
    .min(6, "Invalid phone number")
    .regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number"),
    address: z.string().min(1, "Address is required"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    agreeTOS: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Terms of Services",
    }),
    agreePDPA: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to PDPA" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface IRegisterResponse {
  id: number;
  email: string;
  role: Role;
}

export async function registerCustomerMutation(data: z.infer<typeof CustomerRegisterFormSchema>) {
  const response = await apiClient.post<IRegisterResponse>("/auth/signup/customer", {
    firstname: data.firstname,
    lastname: data.lastname,
    tel: data.tel,
    email: data.email,
    password: data.password,
    accepted_term_of_service: data.agreeTOS,
    accepted_pdpa: data.agreePDPA,
    address: data.address,
  });

  return response.data;
}
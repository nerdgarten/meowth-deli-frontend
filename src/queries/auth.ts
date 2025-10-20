import { z } from "zod";

import { apiClient } from "@/libs/axios";
import type { Role } from "@/types/role";

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginSubmitMutation(
  data: z.infer<typeof LoginFormSchema>
) {
  const response = await apiClient.post<typeof LoginFormSchema>(
    "/auth/signin",
    {
      email: data.email,
      password: data.password,
      role: "customer",
    }
  );

  return response.data;
}

export const CustomerRegisterFormSchema = z
  .object({
    firstname: z.string().min(1, "Firstname is required"),
    lastname: z.string().min(1, "Lastname is required"),
    tel: z
      .string()
      .min(6, "Invalid phone number")
      .regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number"),
    location: z.string().min(1, "Address is required"),
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

export const RestaurantRegisterFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    tel: z
      .string()
      .min(6, "Invalid phone number")
      .regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number"),
    location: z.string().min(1, "Address is required"),
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

export const DriverRegisterFormSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Lastname is required"),
    tel: z
      .string()
      .min(6, "Invalid phone number")
      .regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number"),
    location: z.string().min(1, "Address is required"),
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

export async function registerCustomerMutation(
  data: z.infer<typeof CustomerRegisterFormSchema>
) {
  const response = await apiClient.post<IRegisterResponse>(
    "/auth/signup/customer",
    {
      firstname: data.firstname,
      lastname: data.lastname,
      tel: data.tel,
      email: data.email,
      password: data.password,
      accepted_term_of_service: data.agreeTOS,
      accepted_pdpa: data.agreePDPA,
      location: data.location,
    }
  );

  return response.data;
}

export async function registerRestaurantMutation(
  data: z.infer<typeof RestaurantRegisterFormSchema>
) {
  const response = await apiClient.post<IRegisterResponse>(
    "/auth/signup/restaurant",
    {
      name: data.name,
      description: data.description,
      tel: data.tel,
      email: data.email,
      password: data.password,
      accepted_term_of_service: data.agreeTOS,
      accepted_pdpa: data.agreePDPA,
      location: data.location,
    }
  );

  return response.data;
}

export async function registerDriverMutation(
  data: z.infer<typeof DriverRegisterFormSchema>
) {
  const response = await apiClient.post<IRegisterResponse>(
    "/auth/signup/driver",
    {
      firstname: data.firstname,
      lastname: data.lastname,
      tel: data.tel,
      email: data.email,
      password: data.password,
      accepted_term_of_service: data.agreeTOS,
      accepted_pdpa: data.agreePDPA,
      location: data.location,
    }
  );

  return response.data;
}

export const ResetPasswordRequestSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
});

export type ResetPasswordRequestValues = z.infer<
  typeof ResetPasswordRequestSchema
>;

export async function resetPasswordRequestMutation(
  data: ResetPasswordRequestValues
): Promise<void> {
  await apiClient.post("/auth/reset/request", data);
}

export const ResetPasswordFormSchema = z
  .object({
    password: z.string().min(6, "Must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Both passwords must match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;

export interface ResetPasswordSubmitInput {
  token: string;
  password: string;
}

export async function resetPasswordSubmitMutation({
  token,
  password,
}: ResetPasswordSubmitInput): Promise<void> {
  await apiClient.patch(`/auth/reset/${token}`, {
    password,
  });
}

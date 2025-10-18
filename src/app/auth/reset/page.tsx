"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/button";
import { Input } from "@ui/custom/AuthInput";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { env } from "@/env";

const ResetPasswordFormSchema = z
  .object({
    password: z.string().min(6, "Must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Both passwords must match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  const isValidPasswordCombo = isPasswordValid && doPasswordsMatch;

  const catMessage = isResetSuccessful
    ? "Successful reset the password"
    : isValidPasswordCombo
      ? "Good Password"
      : "Try new password";

  if (!token || isTokenInvalid) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#CFC3AD] px-4 py-12">
        <div className="bg-app-white max-w-lg rounded-[2rem] p-10 text-center shadow-xl">
          <h1 className="text-app-dark-brown mb-4 text-3xl font-semibold">
            Reset link invalid
          </h1>
          <p className="text-app-brown">
            {token
              ? "The reset link is invalid or has expired. Please request a new one from the login dialog."
              : "The reset link is missing or has expired. Please request a new one from the login dialog."}
          </p>
          <Button
            className="bg-app-yellow text-app-dark-brown mt-8 rounded-full px-8 py-3 font-semibold"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </main>
    );
  }

  const onSubmit = async ({
    password,
  }: z.infer<typeof ResetPasswordFormSchema>) => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL}/auth/reset/${token}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const rawMessage =
          typeof errorBody?.message === "string"
            ? errorBody.message
            : Array.isArray(errorBody?.message)
              ? errorBody?.message.join(", ")
              : null;

        if (
          response.status === 400 &&
          rawMessage?.toLowerCase().includes("invalid or expired token")
        ) {
          setIsTokenInvalid(true);
          toast.error(
            "Reset link invalid or expired. Please request a new one."
          );
          return;
        }

        throw new Error(rawMessage ?? "Failed to reset password.");
      }

      toast.success("Successful reset the password");
      setIsResetSuccessful(true);
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reset password. Please try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#CFC3AD] px-4 py-12">
      <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="bg-app-white w-full rounded-[2.5rem] p-10 shadow-[0_25px_60px_rgba(64,56,49,0.15)] lg:w-3/5">
          <h1 className="text-app-dark-brown mb-8 text-center text-4xl font-semibold">
            Reset Password
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="w-full pr-12 text-lg"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="text-app-brown absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm font-semibold text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="w-full pr-12 text-lg"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="text-app-brown absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center"
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm font-semibold text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-app-yellow text-app-dark-brown mt-4 w-full rounded-full py-4 text-lg font-semibold transition disabled:opacity-70"
              >
                {form.formState.isSubmitting ? "Resetting..." : "Reset"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div
            className={`rounded-3xl bg-white px-6 py-4 text-lg font-semibold shadow-md ${
              isResetSuccessful || isValidPasswordCombo
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {catMessage}
          </div>
          <Image
            src="/images/meowth-eating.webp"
            alt="Happy Meowth"
            width={220}
            height={220}
            priority
            className="drop-shadow-xl"
          />
        </div>
      </div>
    </main>
  );
}

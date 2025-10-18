"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/button";
import { Input } from "@ui/custom/AuthInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/form";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { env } from "@/env";

const ResetPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
});

interface ResetPasswordDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onBackToLogin: () => void;
}

export const ResetPasswordDialog = ({
  isOpen,
  setIsOpen,
  onBackToLogin,
}: ResetPasswordDialogProps) => {
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof ResetPasswordSchema>) => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL}/auth/reset/request`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to request password reset.");
      }

      toast.success("Reset link sent! Please check your email.");
      setIsOpen(false);
      onBackToLogin();
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send reset link. Please try again."
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-app-white w-[24rem] rounded-[2rem] border-none p-8 shadow-xl sm:w-[28rem]">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-app-brown flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        <DialogHeader className="mt-4 space-y-3 text-left">
          <DialogTitle className="text-app-dark-brown text-3xl font-semibold">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-app-brown text-base">
            Enter your email
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <Input placeholder="Email" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-app-yellow text-app-white w-32 rounded-full py-4 text-lg font-semibold disabled:opacity-70"
              >
                {form.formState.isSubmitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

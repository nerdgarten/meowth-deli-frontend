"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom/AuthInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { PhoneInput } from "@/components/ui/custom/PhoneInput";
import { Textarea } from "@/components/ui/textarea";
import { ToSDialogButton } from "@/components/Register/ToSDialog";
import { PDPADialogButton } from "@/components/Register/PDPADialog";

export default function RestaurantRegisterPage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center">
      <div className="flex items-center justify-center gap-32 py-[2rem]">
        <RestaurantRegisterFormCard />
        <Image
          src="/images/meowth-cooking.webp"
          alt="meoth cooking"
          height={225}
          width={200}
          className="pt-2 pb-6 drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]"
        />
      </div>
    </main>
  );
}

const RestaurantRegisterFormCard = () => {
  return (
    <div className="bg-app-white w-5/8 max-w-100 rounded-lg p-8">
      <RestaurantRegisterForm />
    </div>
  );
};

const RestaurantRegisterFormSchema = z
  .object({
    name: z.string().min(1, "Restaurant name is required"),
    description: z.string().max(500, "Description is too long"),
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

const RestaurantRegisterForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const restaurantRegisterFrom = useForm<
    z.infer<typeof RestaurantRegisterFormSchema>
  >({
    resolver: zodResolver(RestaurantRegisterFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTOS: false,
      agreePDPA: false,
    },
  });
  const onSubmit = (data: z.infer<typeof RestaurantRegisterFormSchema>) => {
    console.log(data);
  };
  const goNext = async () => {
    const ok = await restaurantRegisterFrom.trigger([
      "email",
      "password",
      "confirmPassword",
    ]);
    if (ok) setStep(2);
  };
  const goBack = () => setStep(1);

  return (
    <Form {...restaurantRegisterFrom}>
      <form
        onSubmit={restaurantRegisterFrom.handleSubmit(onSubmit)}
        className="mt-4"
      >
        <h2 className="text-app-dark-brown mb-2 text-3xl font-semibold">
          Create your account
        </h2>
        <p className="text-app-dark-brown mb-8 text-sm">
          Register as a restaurant to start selling!
        </p>
        {step === 1 && (
          <>
            <FormField
              control={restaurantRegisterFrom.control}
              name="email"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="meowth@nerdsgarten.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={restaurantRegisterFrom.control}
              name="password"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={restaurantRegisterFrom.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-8 flex w-full flex-row-reverse gap-4">
              <Button
                type="button"
                onClick={goNext}
                className="bg-app-tan rounded-full py-5 text-sm font-semibold"
              >
                Continue
                <ArrowRight className="stroke-3" />
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <FormField
              control={restaurantRegisterFrom.control}
              name="name"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Meowth Cuisine" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={restaurantRegisterFrom.control}
              name="description"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Meowth Cuisine is a wonderful restaurant. Our Meowth meat is the best!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={restaurantRegisterFrom.control}
              name="tel"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      id="tel"
                      placeholder="Enter a phone number"
                      className="w-full overflow-hidden rounded-full border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={restaurantRegisterFrom.control}
              name="address"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Cat St, Bangkok, 10400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={restaurantRegisterFrom.control}
              name="agreeTOS"
              render={({ field }) => (
                <FormItem className="space-y-0 pb-1">
                  <div className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      I agree to{" "}
                      <ToSDialogButton>Terms of Service</ToSDialogButton>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={restaurantRegisterFrom.control}
              name="agreePDPA"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      I agree to <PDPADialogButton>PDPA</PDPADialogButton>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-8 flex w-full flex-row-reverse items-center gap-4">
              <Button
                type="submit"
                className="bg-app-yellow rounded-full py-5 text-lg font-semibold"
              >
                Create Account
              </Button>
              <Button
                type="button"
                onClick={goBack}
                className="bg-app-tan rounded-full py-5 text-lg font-semibold"
              >
                Back
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
};

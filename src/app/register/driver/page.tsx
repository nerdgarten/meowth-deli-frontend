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
import { PDPADialogButton } from "@/components/Register/PDPADialog";
import { ToSDialogButton } from "@/components/Register/ToSDialog";

export default function DriverRegisterPage() {
  return (
    <main className="bg-app-background flex h-full flex-col items-center">
      <div className="flex items-center justify-center gap-32 py-[2rem]">
        <DriverRegisterFormCard />
        <Image
          src="/images/meowth-eating.webp"
          alt="meoth eating"
          height={225}
          width={200}
          className="pt-2 pb-6 drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]"
        />
      </div>
    </main>
  );
}

const DriverRegisterFormCard = () => {
  return (
    <div className="bg-app-white w-5/8 max-w-100 rounded-lg p-8">
      <DriverRegisterForm />
    </div>
  );
};

const DriverRegisterFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    surname: z.string().min(1, "Surname is required"),
    phoneNumber: z
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

const DriverRegisterForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const driverRegisterFrom = useForm<z.infer<typeof DriverRegisterFormSchema>>({
    resolver: zodResolver(DriverRegisterFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      surname: "",
      phoneNumber: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTOS: false,
      agreePDPA: false,
    },
  });
  const onSubmit = (data: z.infer<typeof DriverRegisterFormSchema>) => {
    console.log(data);
  };
  const goNext = async () => {
    const ok = await driverRegisterFrom.trigger([
      "email",
      "password",
      "confirmPassword",
    ]);
    if (ok) setStep(2);
  };
  const goBack = () => setStep(1);

  return (
    <Form {...driverRegisterFrom}>
      <form
        onSubmit={driverRegisterFrom.handleSubmit(onSubmit)}
        className="mt-4"
      >
        <h2 className="text-app-dark-brown mb-2 text-3xl font-semibold">
          Create your account
        </h2>
        <p className="text-app-dark-brown mb-8 text-sm">
          Register as a driver to start delivering!
        </p>
        {step === 1 && (
          <>
            <FormField
              control={driverRegisterFrom.control}
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
              control={driverRegisterFrom.control}
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
              control={driverRegisterFrom.control}
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
            <div className="flex items-center justify-center gap-4 pb-4">
              <FormField
                control={driverRegisterFrom.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Meowth" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={driverRegisterFrom.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input placeholder="Nerdsgarten" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={driverRegisterFrom.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      id="phoneNumber"
                      placeholder="Enter a phone number"
                      className="w-full overflow-hidden rounded-full border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={driverRegisterFrom.control}
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
              control={driverRegisterFrom.control}
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
              control={driverRegisterFrom.control}
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

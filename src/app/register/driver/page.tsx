"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { PDPADialogButton } from "@/components/Register/PDPADialog";
import { ToSDialogButton } from "@/components/Register/ToSDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/custom/AuthInput";
import { PhoneInput } from "@/components/ui/custom/PhoneInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DriverRegisterFormSchema,
  registerDriverMutation,
} from "@/queries/auth";
import { toast } from "react-hot-toast";

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

const DriverRegisterForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const driverRegisterFrom = useForm<z.infer<typeof DriverRegisterFormSchema>>({
    resolver: zodResolver(DriverRegisterFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      tel: "",
      location: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTOS: false,
      agreePDPA: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerDriverMutation,
    onSuccess: () => {
      toast.success("Register successfully!");
      router.push("/");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Register failed! Please try again.");
      }
    },
  });

  const onSubmit = (data: z.infer<typeof DriverRegisterFormSchema>) =>
    registerMutation.mutate(data);
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
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firstname</FormLabel>
                    <FormControl>
                      <Input placeholder="Meowth" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={driverRegisterFrom.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lastname</FormLabel>
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
              control={driverRegisterFrom.control}
              name="location"
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

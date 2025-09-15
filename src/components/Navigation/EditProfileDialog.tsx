"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Input } from "@ui/custom/AuthInput";
import { PhoneInput } from "@ui/custom/PhoneInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";

import {
  EditProfileFormSchema,
  queryCustomerProfile,
  updateCustomerProfileMutation,
} from "@/queries/profile";
import type { ICustomerProfile } from "@/types/user";

interface EditProfileDialogProps {
  isEditProfileDialogOpen: boolean;
  setIsEditProfileDialogOpen: (open: boolean) => void;
}

export const EditProfileDialog = ({
  isEditProfileDialogOpen,
  setIsEditProfileDialogOpen,
}: EditProfileDialogProps) => {
  const editProfileForm = useForm<z.infer<typeof EditProfileFormSchema>>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      tel: "",
    },
  });
  const { reset } = editProfileForm;

  const { data: profileData } = useQuery<ICustomerProfile>({
    queryKey: ["profile"],
    queryFn: queryCustomerProfile,
    enabled: isEditProfileDialogOpen,
  });

  const updateMutation = useMutation({
    mutationFn: updateCustomerProfileMutation,
    onSuccess: () => {
      toast.success("Update customer successful!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message.includes("400")) {
          toast.error("Invalid input. Please check your data.");
        } else if (error.message.includes("401")) {
          toast.error("Unauthorized. Please log in again.");
        } else if (error.message.includes("404")) {
          toast.error("User not found. Please check your information.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    },
  });

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  const onSubmit = async (data: z.infer<typeof EditProfileFormSchema>) =>
    updateMutation.mutate(data);

  return (
    <Dialog
      open={isEditProfileDialogOpen}
      onOpenChange={setIsEditProfileDialogOpen}
    >
      <DialogContent className="bg-app-white p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown">
            Edit Your Profile
          </DialogTitle>
        </DialogHeader>
        <Form {...editProfileForm}>
          <form
            onSubmit={editProfileForm.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={editProfileForm.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Firstname"
                      className="w-[20vw]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editProfileForm.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lastname"
                      className="w-[20vw]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editProfileForm.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      id="tel"
                      placeholder="Phone Number"
                      className="w-full overflow-hidden rounded-full border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-10 flex w-full justify-center">
              <Button
                type="submit"
                className="bg-app-yellow rounded-full px-4 py-5 text-lg font-semibold"
              >
                Edit Profile
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

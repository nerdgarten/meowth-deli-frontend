"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Input } from "@ui/custom/AuthInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { apiClient } from "@/libs/axios";
import { queryCustomerProfile } from "@/queries/profile";
import type { ICustomerProfile } from "@/types/user";

interface EditProfileDialogProps {
  isEditProfileDialogOpen: boolean;
  setIsEditProfileDialogOpen: (open: boolean) => void;
}

const EditProfileFormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  tel: z.string().min(10, "Phone number must be at least 10 characters").max(10, "Phone number must be at most 10 characters"),
});

export const EditProfileDialog = ({isEditProfileDialogOpen, setIsEditProfileDialogOpen}: EditProfileDialogProps) => {
  const editProfileForm = useForm<z.infer<typeof EditProfileFormSchema>>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      tel: "",
    }
  });

  const { reset } = editProfileForm;

  const { data: profileData } = useQuery<ICustomerProfile>({
    queryKey: ["profile"],
    queryFn: queryCustomerProfile,
    enabled: isEditProfileDialogOpen,
  });

  useEffect(() => {
    if(profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  const onSubmit = async(data: ICustomerProfile) => {
    const response = await apiClient.patch("/customer/profile", {
      firstname: data.firstname,
      lastname: data.lastname,
      tel: data.tel,
    });

    // TODO: show toast notification
    if (response.status === 200) {
      setIsEditProfileDialogOpen(false);
    }
  }

  return (
    <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
      <DialogContent className="bg-app-white p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown">Edit Your Profile</DialogTitle>
        </DialogHeader>
        <Form {...editProfileForm}>
          <form onSubmit={editProfileForm.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField control={editProfileForm.control} name="firstname" render={({field}) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input placeholder="Firstname" className="w-[20vw]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={editProfileForm.control} name="lastname" render={({field}) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input placeholder="Lastname" className="w-[20vw]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={editProfileForm.control} name="tel" render={({field}) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" className="w-[20vw]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <div className="mt-10 flex w-full justify-center">
              <Button
                type="submit"
                className="bg-app-yellow px-4 rounded-full py-5 text-lg font-semibold"
              >
                Edit Profile
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
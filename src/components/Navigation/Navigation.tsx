"use client";

import { Menu, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { EditProfileDialog } from "@/components/Navigation/EditProfileDialog";
import { MenuDialog } from "@/components/Navigation/MenuDialog";
import { isAuthenticated } from "@/libs/authentication";

import BreadcrumbNav from "./BreadCrumbNav";
import { LoginDialog } from "./LoginDialog";

export const Navigation = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    useState<boolean>(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState<boolean>(false);

  const handleProfileClick = () => {
    if (isAuthenticated()) {
      setIsEditProfileDialogOpen(true);
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  const handleMenuClick = () => {
    if (isAuthenticated()) {
      setIsMenuDialogOpen(true);
    } else {
      toast.error("You have to be logged in to access the menu.");
    }
  };

  return (
    <>
      <nav className="bg-app-dark-brown fixed top-0 z-100 flex h-[4rem] w-screen">
        <div className="flex w-full items-center px-4">
          <BreadcrumbNav />
        </div>
        <div className="flex w-full items-center justify-end">
          <div className="mr-3 flex gap-x-6">
            <button onClick={handleProfileClick} className="cursor-pointer">
              <User className="h-[1.75rem] text-white" />
            </button>
            <button onClick={handleMenuClick} className="cursor-pointer">
              <Menu className="h-[1.75rem] text-white" />
            </button>
          </div>
        </div>
      </nav>
      <LoginDialog
        isLoginDialogOpen={isLoginDialogOpen}
        setIsLoginDialogOpen={setIsLoginDialogOpen}
      />
      <EditProfileDialog
        isEditProfileDialogOpen={isEditProfileDialogOpen}
        setIsEditProfileDialogOpen={setIsEditProfileDialogOpen}
      />
      <MenuDialog
        isMenuDialogOpen={isMenuDialogOpen}
        setIsMenuDialogOpen={setIsMenuDialogOpen}
      />
    </>
  );
};

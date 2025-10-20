"use client";

import { Menu, User } from "lucide-react";
import { use, useState } from "react";
import toast from "react-hot-toast";

import { EditProfileDialog } from "@/components/Navigation/EditProfileDialog";
import { MenuDialog } from "@/components/Navigation/MenuDialog";
import { authenticatedAs } from "@/libs/authentication";

import BreadcrumbNav from "./BreadCrumbNav";
import { LoginDialog } from "./LoginDialog";
import { useRouter } from "next/navigation";

export const Navigation = () => {
  const router = useRouter();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    useState<boolean>(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState<boolean>(false);

  const handleProfileClick = async () => {
    const authenticated = await authenticatedAs();
    if (authenticated) {
      router.push("/customer/profile");
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  const handleMenuClick = async () => {
    const authenticated = await authenticatedAs();
    if (authenticated) {
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

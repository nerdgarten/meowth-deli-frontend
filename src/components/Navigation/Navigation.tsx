"use client";

import { History,Menu, User } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import toast from "react-hot-toast";

import { EditProfileDialog } from "@/components/Navigation/EditProfileDialog";
import { MenuDialog } from "@/components/Navigation/MenuDialog";
import { ResetPasswordDialog } from "@/components/Navigation/ResetPasswordDialog";
import { authenticatedAs } from "@/libs/authentication";

import { useAuth } from "../context/AuthContext";
import BreadcrumbNav from "./BreadCrumbNav";
import { LoginDialog } from "./LoginDialog";

export const Navigation = () => {
  const router = useRouter();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    useState<boolean>(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState<boolean>(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState<boolean>(false);

  const handleHistoryClick = async () => {
    const authenticated = await authenticatedAs();
    if (authenticated) {
      router.push("/history");
    } else {
      toast.error("You have to be logged in to access the history.");
    }
  };

  const handleProfileClick = async () => {
    const authenticated = await authenticatedAs();
    if (authenticated) {
      router.push("/settings");
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

  const handleForgotPassword = () => {
    setIsLoginDialogOpen(false);
    setIsResetPasswordDialogOpen(true);
  };

  const handleBackToLogin = () => {
    setIsResetPasswordDialogOpen(false);
    setIsLoginDialogOpen(true);
  };

  return (
    <>
      <nav className="bg-app-dark-brown fixed top-0 z-100 flex h-[4rem] w-screen">
        <div className="flex w-full items-center px-4">
          <BreadcrumbNav />
        </div>
        <div className="flex w-full items-center justify-end">
          <div className="mr-5 flex gap-x-4">
            <button onClick={handleHistoryClick} className="cursor-pointer">
              <History className="h-[1.75rem] text-white" />
            </button>
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
        onForgotPassword={handleForgotPassword}
      />
      <ResetPasswordDialog
        isOpen={isResetPasswordDialogOpen}
        setIsOpen={setIsResetPasswordDialogOpen}
        onBackToLogin={handleBackToLogin}
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

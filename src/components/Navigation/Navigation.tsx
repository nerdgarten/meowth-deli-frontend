"use client";

import { EditProfileDialog } from "@/components/Navigation/EditProfileDialog";
import { useMutation } from "@tanstack/react-query";
import { History, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState<boolean>(false);

  const { logout } = useAuth();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged Out");
    },
    onError: () => {
      toast.error("Failed to logout. Please try again.");
    },
  });

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
      logoutMutation.mutate();
    } else {
      toast.error("You have to be logged in.");
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
          <div className="mr-5 flex gap-x-6">
            <button onClick={handleHistoryClick} className="cursor-pointer">
              <History className="h-[1.75rem] text-white" />
            </button>
            <button onClick={handleProfileClick} className="cursor-pointer">
              <User className="h-[1.75rem] text-white" />
            </button>
            <button onClick={handleMenuClick} className="cursor-pointer">
              <LogOut className="h-[1.75rem] text-white" />
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
    </>
  );
};

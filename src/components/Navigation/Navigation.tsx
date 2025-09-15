"use client";

import { Menu,User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EditProfileDialog } from "@/components/Navigation/EditProfileDialog";
import { isAuthenticated } from "@/libs/authentication";

import { LoginDialog } from "./LoginDialog";

export const Navigation = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState<boolean>(false);

  const handleProfileClick = () => {
    if(isAuthenticated()) {
      setIsEditProfileDialogOpen(true);
    }
    else {
      setIsLoginDialogOpen(true);
    }
  };

  return (
    <>
      <nav className="bg-app-dark-brown fixed top-0 z-100 flex h-[4rem] w-screen">
        <div className="flex w-full items-center justify-end">
          <div className="mr-3 flex gap-x-6">
            <button onClick={handleProfileClick} className="cursor-pointer">
              <User className="h-[1.75rem] text-white" />
            </button>
            <Link href="/settings">
              <Menu className="h-[1.75rem] text-white" />
            </Link>
          </div>
        </div>
      </nav>
      <LoginDialog
        isLoginDialogOpen={isLoginDialogOpen}
        setIsLoginDialogOpen={setIsLoginDialogOpen}
      />
      <EditProfileDialog isEditProfileDialogOpen={isEditProfileDialogOpen} setIsEditProfileDialogOpen={setIsEditProfileDialogOpen}/>
    </>
  );
};

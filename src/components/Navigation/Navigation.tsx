"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Menu } from "lucide-react";
import { LoginDialog } from "./LoginDialog";
import BreadcrumbNav from "./BreadCrumbNav";

export const Navigation = () => {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const handleProfileClick = () => {
    // TODO: Integrate with user profile logic
    // For now, just open the dialog
    setIsProfileOpen(true);
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
            <Link href="/settings">
              <Menu className="h-[1.75rem] text-white" />
            </Link>
          </div>
        </div>
      </nav>
      <LoginDialog
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />
    </>
  );
};

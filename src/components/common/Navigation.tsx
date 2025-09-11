import Link from "next/link";
import { User, Menu } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="bg-app-brown fixed top-0 flex w-screen py-4">
      <div className="flex w-full items-center justify-end">
        <div className="mr-3 flex gap-x-6">
          <Link href="/profile">
            <User className="h-[1.75rem] text-white" />
          </Link>
          <Link href="/settings">
            <Menu className="h-[1.75rem] text-white" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

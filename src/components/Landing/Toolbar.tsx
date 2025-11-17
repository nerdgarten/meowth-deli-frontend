"use client";

import { Search } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/libs/utils";

interface ToolbarProps extends ComponentProps<"input"> {
  className?: string;
  containerClassName?: string;
}

export const Toolbar = ({
  className,
  containerClassName,
  ...props
}: ToolbarProps) => (
  <div
    className={cn(
      "flex grow items-center rounded-full bg-white px-6 py-3 shadow-md mx-8 my-3",
      containerClassName
    )}
    cmdk-input-wrapper=""
  >
    <Search className="text-app-yellow mr-2 inline size-5 stroke-2" />
    <input
      className={cn(
        "placeholder:text-muted-foreground text-md text-app-brown bg-app-white w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
);

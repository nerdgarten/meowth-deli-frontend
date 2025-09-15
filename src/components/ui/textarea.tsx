import * as React from "react";

import { cn } from "@/libs/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "focus-visible:ring-ring border-input flex min-h-[60px] w-full rounded-2xl border bg-[#DCD6CC] px-3 py-2 text-base shadow-sm placeholder:text-[#A19175] focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

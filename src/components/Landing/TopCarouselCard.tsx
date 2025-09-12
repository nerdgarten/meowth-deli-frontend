import type { ReactNode } from "react";

export const TopCarouselCard = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="rounded-md bg-black/10 p-5 backdrop-blur-xl">
      {children}
    </div>
  );
};

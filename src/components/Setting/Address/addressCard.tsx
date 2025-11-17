import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";

type AddressCardProps = {
  address: string;
};

export function AddressCard({ address }: AddressCardProps) {
  return (
    <div className="flex gap-4 rounded-2xl border-b border-b-gray-200 bg-white px-6 py-4 shadow-sm last:border-0">
      <MapPin className="text-app-dark-brown h-6 w-6 shrink-0" />
      <div className={cn("text-app-dark-brown text-lg font-medium")}>
        {address}
      </div>
    </div>
  );
}

export type { AddressCardProps };

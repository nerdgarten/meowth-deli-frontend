import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { MapPin } from "lucide-react";
import type { ICreateLocation } from "@/types/location";

type AddressCardProps = {
  address: ICreateLocation;
  isDefault?: boolean;
  setDefault: (location: ICreateLocation) => Promise<void>;
};

export function AddressCard({
  address,
  isDefault = false,
  setDefault,
}: AddressCardProps) {
  return (
    <div className="flex gap-4 rounded-2xl border-b border-b-gray-200 bg-white px-6 py-4 shadow-sm last:border-0">
      <div className="flex w-full justify-between gap-4">
        <div className="flex gap-4">
          <MapPin className="text-app-dark-brown h-6 w-6 shrink-0" />
          <div className={cn("text-app-dark-brown text-lg font-medium")}>
            {address.address}
          </div>
        </div>
        <div className="flex items-center">
          {isDefault ? (
            <Button
              variant="outline"
              disabled
              className="text-app-dark-brown hover:bg-app-brown/10 rounded-xl px-4 py-2 text-sm font-semibold shadow-none"
            >
              Default ✓
            </Button>
          ) : (
            <Button
              onClick={async () => {
                await setDefault(address);
              }}
              variant="outline"
              className="bg-app-dark-brown hover:bg-app-brown/80 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:text-white"
            >
              Set as Default
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export type { AddressCardProps };

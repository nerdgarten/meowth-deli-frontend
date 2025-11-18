"use client";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DeliveryDetailsProps {
  /** The full delivery address */
  address: string;
  /** The full note for the driver */
  driverNote: string;
  /** A function to call when the "Edit Note" button is clicked */
  onEditNote: () => void;
}

export default function DeliveryDetailsCard({
  address,
  driverNote,
  onEditNote,
}: DeliveryDetailsProps) {
  return (
    <Card className="h-full w-full rounded-2xl bg-white shadow-lg">
      <CardContent className="flex h-full flex-col space-y-6 p-6">
        {/* --- Address Section --- */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">Address</h2>
          <p className="line-clamp-2 text-sm text-gray-600">{address}</p>
        </div>

        {/* --- Note to Driver Section --- */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800">Note to Driver</h2>
          <p className="line-clamp-2 text-sm text-gray-600">{driverNote}</p>
        </div>

        {/* --- Edit Button --- */}
        <div className="flex justify-center pt-2">
          {/* <Button
            onClick={onEditNote}
            // Styled to match the yellow button in your image
            className="rounded-full bg-yellow-400 px-6 text-base font-semibold text-neutral-800 shadow-sm hover:bg-yellow-500"
          >
            Edit Note
            <Pencil className="ml-2 h-5 w-5" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}

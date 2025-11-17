"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

import { MapLocationPicker } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ILocation } from "@/types/map";

/**
 * Example: Integration of MapLocationPicker in an order form
 * This demonstrates how to use the map component in a real use case
 */
export default function OrderFormExample() {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    deliveryLocation: null as ILocation | null,
    deliveryAddress: "",
    notes: "",
  });

  const handleLocationSelect = (location: ILocation, address: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryLocation: location,
      deliveryAddress: address,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.deliveryLocation) {
      alert("Please select a delivery location on the map");
      return;
    }

    console.log("Order submitted:", formData);
    alert("Order submitted! Check console for data.");
  };

  return (
    <main className="container mx-auto py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Order</h1>
          <p className="text-gray-600">
            Example of map integration in order form
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Location - Map Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Click on the map to select your delivery location
              </p>

              <MapLocationPicker
                onLocationSelect={handleLocationSelect}
                className="w-full"
              />

              {/* Display selected location */}
              {formData.deliveryLocation && (
                <div className="rounded-md bg-green-50 p-4">
                  <h4 className="mb-2 font-medium text-green-900">
                    Selected Delivery Location
                  </h4>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <strong>Address:</strong> {formData.deliveryAddress}
                    </p>
                    <p className="text-xs text-green-600">
                      Coordinates: {formData.deliveryLocation.lat.toFixed(4)},{" "}
                      {formData.deliveryLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full rounded-md border p-2"
                rows={4}
                placeholder="e.g., Leave at door, Call when arrived..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  customerName: "",
                  phoneNumber: "",
                  deliveryLocation: null,
                  deliveryAddress: "",
                  notes: "",
                });
              }}
            >
              Reset
            </Button>
            <Button type="submit">Place Order</Button>
          </div>
        </form>

        {/* Show form data for debugging */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Form Data (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto text-xs">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

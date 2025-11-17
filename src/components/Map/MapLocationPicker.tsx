"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getMapSVG, reverseGeocode } from "@/libs/map";
import type { ILocation, IMarker } from "@/types/map";

interface MapLocationPickerProps {
  onLocationSelect: (location: ILocation, address: string) => void;
  initialLocation?: ILocation;
  initialMarkers?: IMarker[];
  className?: string;
}

export function MapLocationPicker({
  onLocationSelect,
  initialLocation = { lat: 13.7563, lng: 100.5018 }, // Bangkok coordinates
  initialMarkers = [],
  className = "",
}: MapLocationPickerProps) {
  const [center] = useState<ILocation>(initialLocation);
  const [markers, setMarkers] = useState<IMarker[]>(initialMarkers);
  const [svgContent, setSvgContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [zoom, setZoom] = useState<number>(14);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Map dimensions - keep consistent with backend
  const MAP_WIDTH = 800;
  const MAP_HEIGHT = 600;

  // Load map
  const loadMap = async () => {
    setLoading(true);
    try {
      const response = await getMapSVG({
        center,
        zoom,
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        markers,
      });
      setSvgContent(response.svg);
    } catch (error) {
      console.error("Failed to load map:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load map on mount and when center/zoom/markers change
  useEffect(() => {
    void loadMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, zoom, markers]);

  // Handle click on map to drop pin
  const handleMapClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!svgContainerRef.current || isProcessing) return;

    setIsProcessing(true);

    const rect = svgContainerRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Convert click position to normalized coordinates (0 to 1)
    const normalizedX = clickX / rect.width;
    const normalizedY = clickY / rect.height;

    // Convert normalized coordinates to SVG coordinates
    const svgX = normalizedX * MAP_WIDTH;
    const svgY = normalizedY * MAP_HEIGHT;

    // Calculate the scale used by the backend
    // Backend: scale = Math.pow(2, float64(zoom-10)) * 100000
    const scale = Math.pow(2, zoom - 10) * 100000;

    // Calculate center of SVG
    const centerX = MAP_WIDTH / 2;
    const centerY = MAP_HEIGHT / 2;

    // Calculate offset from center in SVG pixels
    const dx = svgX - centerX;
    const dy = svgY - centerY;

    // Convert to lat/lng offset
    // Backend calculation:
    //   dx_svg = (marker.Lng - center.Lng) * scale
    //   dy_svg = (center.Lat - marker.Lat) * scale
    // Therefore:
    //   marker.Lng = center.Lng + (dx_svg / scale)
    //   marker.Lat = center.Lat - (dy_svg / scale)
    const newLocation: ILocation = {
      lat: center.lat - dy / scale,
      lng: center.lng + dx / scale,
    };

    // Get address for this location
    try {
      const response = await reverseGeocode({ location: newLocation });
      setSelectedAddress(response.address);

      // DO NOT update center - keep it fixed so map doesn't move
      // This way the pin stays where user clicked

      // Update markers
      const newMarker: IMarker = {
        location: newLocation,
        label: "Selected",
        color: "#ff4444",
      };
      setMarkers([newMarker]);

      // Call callback
      onLocationSelect(newLocation, response.address);
    } catch (error) {
      console.error("Failed to get address:", error);
      setSelectedAddress("Unknown location");

      // Still update marker
      const newMarker: IMarker = {
        location: newLocation,
        label: "Selected",
        color: "#ff4444",
      };
      setMarkers([newMarker]);

      onLocationSelect(newLocation, "Unknown location");
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear selection
  const handleClear = () => {
    setMarkers([]);
    setSelectedAddress("");
    // Do NOT reset center - keep the map where it is
  };

  // Zoom in/out - keep the same center
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={loading}
            >
              +
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={loading}
            >
              -
            </Button>
            <span className="text-sm text-gray-600">Zoom: {zoom}</span>
            {markers.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="ml-auto"
              >
                Clear Pin
              </Button>
            )}
          </div>

          {/* Map Container */}
          <div
            ref={svgContainerRef}
            className="relative cursor-crosshair overflow-hidden rounded-lg border bg-gray-50"
            onClick={handleMapClick}
            style={{
              width: "100%",
              aspectRatio: `${MAP_WIDTH}/${MAP_HEIGHT}`,
            }}
          >
            {loading && (
              <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-gray-500">Loading map...</div>
              </div>
            )}
            {isProcessing && (
              <div className="bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black">
                <div className="rounded-lg bg-white px-4 py-2 text-sm shadow-lg">
                  Getting address...
                </div>
              </div>
            )}
            {svgContent && (
              <div
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
              />
            )}
          </div>

          {/* Selected Location Info */}
          {selectedAddress && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Selected Location</p>
                  <Input
                    value={selectedAddress}
                    readOnly
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
              {markers[0] && (
                <div className="text-xs text-gray-500">
                  Coordinates: {markers[0].location.lat.toFixed(4)},{" "}
                  {markers[0].location.lng.toFixed(4)}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            Click anywhere on the map to drop a pin and select a location.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

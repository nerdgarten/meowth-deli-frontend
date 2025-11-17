"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { getMapSVG } from "@/libs/map";
import type { ILocation, IMarker } from "@/types/map";

interface MapDisplayProps {
  center: ILocation;
  markers?: IMarker[];
  zoom?: number;
  width?: number;
  height?: number;
  className?: string;
}

export function MapDisplay({
  center,
  markers = [],
  zoom = 14,
  width = 800,
  height = 600,
  className = "",
}: MapDisplayProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMap = async () => {
      setLoading(true);
      try {
        const response = await getMapSVG({
          center,
          zoom,
          width,
          height,
          markers,
        });
        setSvgContent(response.svg);
      } catch (error) {
        console.error("Failed to load map:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadMap();
  }, [center, zoom, width, height, markers]);

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            width: "100%",
            aspectRatio: `${width}/${height}`,
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">Loading map...</div>
            </div>
          )}
          {svgContent && (
            <div
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

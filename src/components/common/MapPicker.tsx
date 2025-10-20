/// <reference types="@types/google.maps" />
"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 13.7563, // Bangkok
  lng: 100.5018,
};

export default function MapPicker() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  }) as { isLoaded: boolean; loadError: Error | undefined };

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setMarker({ lat, lng });
      console.log("Selected:", lat, lng);
    }
  }, []);

  if (loadError instanceof Error)
    return <p>Error loading map: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="flex flex-col gap-2">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker ?? defaultCenter}
        zoom={12}
        onClick={onMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>

      {marker && (
        <div className="mt-2">
          <strong>Selected Location:</strong>
          <p>Latitude: {marker.lat.toFixed(6)}</p>
          <p>Longitude: {marker.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
}

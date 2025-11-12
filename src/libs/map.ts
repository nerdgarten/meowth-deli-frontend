import { apiClient } from "@/libs/axios";
import type {
  IGeocodeRequest,
  IGeocodeResponse,
  IMapSVGRequest,
  IMapSVGResponse,
  IReverseGeocodeRequest,
  IReverseGeocodeResponse,
} from "@/types/map";

export const getMapSVG = async (
  request: IMapSVGRequest
): Promise<IMapSVGResponse> => {
  try {
    const response = await apiClient.post<IMapSVGResponse>("/map/svg", request);
    return response.data;
  } catch (error) {
    console.error("Error fetching map SVG:", error);
    throw error;
  }
};

export const reverseGeocode = async (
  request: IReverseGeocodeRequest
): Promise<IReverseGeocodeResponse> => {
  try {
    const response = await apiClient.post<IReverseGeocodeResponse>(
      "/map/reverse-geocode",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    throw error;
  }
};

export const geocode = async (
  request: IGeocodeRequest
): Promise<IGeocodeResponse> => {
  try {
    const response = await apiClient.post<IGeocodeResponse>(
      "/map/geocode",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error geocoding:", error);
    throw error;
  }
};

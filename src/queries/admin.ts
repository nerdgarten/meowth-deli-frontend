import { apiClient } from "@/libs/axios";

export interface AdminUser {
  id: number;
  email: string;
  role: string;
}

export interface AdminUsersResponse {
  success: boolean;
  message?: string;
  data: AdminUser[];
  total: number;
  offset: number;
  limit: number;
}

export interface AdminReport {
  id: number;
  reason: string;
  detail?: string;
  associated_image: string[];
  created_at: string;
  customer: {
    user: {
      email: string;
    };
  };
  reported: {
    role: string;
    driver?: {
      name: string;
    };
    restaurant?: {
      name: string;
    };
  };
}

export interface AdminReportsResponse {
  success: boolean;
  message?: string;
  data: AdminReport[];
  total: number;
  offset: number;
  limit: number;
}

export interface AdminGenericResponse<T = any> {
  success: boolean;
  message?: string;
  data: T[] | T;
  total?: number;
  offset?: number;
  limit?: number;
}

export async function getAdminRestaurants(
  status?: string
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.get(`/admin/restaurants`, {
      params: { status },
    });
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("getAdminRestaurants error", error);
    throw error;
  }
}

export async function getAdminDrivers(
  status?: string
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.get(`/admin/drivers`, {
      params: { status },
    });
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("getAdminDrivers error", error);
    throw error;
  }
}

export async function getAdminRestaurantCertificates(
  limit = 10,
  offset = 0
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.get(`/admin/restaurants/certificate`, {
      params: { limit, offset },
    });
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("getAdminRestaurantCertificates error", error);
    return {
      success: false,
      message: "Failed to fetch restaurant certificates",
      data: [],
      total: 0,
      offset,
      limit,
    };
  }
}

export async function getAdminDriverCertificates(
  limit = 10,
  offset = 0
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.get(`/admin/drivers/certificate`, {
      params: { limit, offset },
    });
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("getAdminDriverCertificates error", error);
    return {
      success: false,
      message: "Failed to fetch driver certificates",
      data: [],
      total: 0,
      offset,
      limit,
    };
  }
}

export async function getDriverProfileById(id: number): Promise<any> {
  try {
    const response = await apiClient.get(`/driver/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error("getDriverProfileById error", error);
    throw error;
  }
}

export async function getRestaurantProfileById(id: number): Promise<any> {
  try {
    const response = await apiClient.get(`/restaurant/${id}`);
    return response.data;
  } catch (error) {
    console.error("getRestaurantProfileById error", error);
    throw error;
  }
}

export async function getAdminDriverCertificateStatus(
  id: number
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.get(`/admin/drivers/${id}/certificate`);
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("getAdminDriverCertificateStatus error", error);
    throw error;
  }
}

export async function getAdminDriverCertificateFile(
  id: number,
  fileId: string
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.get(
      `/admin/drivers/certificate/${id}/${fileId}`
    );
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("getAdminDriverCertificateFile error", error);
    throw error;
  }
}

export async function getAdminRestaurantCertificateStatus(
  id: number
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.get(
      `/admin/restaurants/${id}/certificate`
    );
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("getAdminRestaurantCertificateStatus error", error);
    throw error;
  }
}

export async function getAdminRestaurantCertificateFile(
  id: number,
  fileId: string
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.get(
      `/admin/restaurants/certificate/${id}/${fileId}`
    );
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("getAdminRestaurantCertificateFile error", error);
    throw error;
  }
}

export async function adminVerifyRestaurant(
  id: number,
  status: string
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.patch(`/admin/restaurants/${id}/verify`, {
      id,
      status,
    });
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("adminVerifyRestaurant error", error);
    throw error;
  }
}

export async function adminVerifyDriver(
  id: number,
  status: string
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.patch(`/admin/drivers/${id}/verify`, {
      id,
      status,
    });
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("adminVerifyDriver error", error);
    throw error;
  }
}

export async function adminDeleteUser(
  id: number
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.delete(`/admin/user/${id}`);
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("adminDeleteUser error", error);
    throw error;
  }
}

export async function getAdminUsers(
  role?: string,
  limit = 10,
  offset = 0
): Promise<AdminUsersResponse> {
  try {
    const response = await apiClient.get(`/admin/users`, {
      params: { role, limit, offset },
    });
    return response.data as AdminUsersResponse;
  } catch (error) {
    console.error("getAdminUsers error", error);
    return {
      success: false,
      message: "Failed to fetch users",
      data: [],
      total: 0,
      offset,
      limit,
    };
  }
}

export async function getAdminReports(
  limit = 10,
  offset = 0
): Promise<AdminReportsResponse> {
  try {
    const response = await apiClient.get(`/admin/reports`, {
      params: { limit, offset },
    });
    return response.data as AdminReportsResponse;
  } catch (error) {
    console.error("getAdminReports error", error);
    return {
      success: false,
      message: "Failed to fetch reports",
      data: [],
      total: 0,
      offset,
      limit,
    };
  }
}

export async function resolveAdminReport(
  id: number
): Promise<AdminGenericResponse> {
  try {
    const response = await apiClient.patch(`/admin/reports/${id}/resolve`);
    return response.data as AdminGenericResponse;
  } catch (error) {
    console.error("resolveAdminReport error", error);
    return {
      success: false,
      message: "Failed to resolve report",
    };
  }
}

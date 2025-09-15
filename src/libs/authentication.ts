import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export const isAuthenticated = (): boolean => {
  const token = Cookies.get("token");
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const isValid = decoded.exp * 1000 > Date.now();
    return isValid;
  } catch (error) {
    return false;
  }
};

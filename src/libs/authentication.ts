import Cookies from "js-cookie";

export const isAuthenticated = (): boolean => {
  const authenticated = Cookies.get("authenticated");
  return authenticated === "true";
};

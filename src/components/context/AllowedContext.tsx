"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import path from "path";
interface AllowedContextType {
  isAllowed: boolean;
}
export const AllowedContext = createContext<AllowedContextType>({
  isAllowed: true,
});

const isSubPath = (pathname: string, base: string) => {
  if (!base) return false;
  if (base === "/") return true;
  const addSlash = (s: string) => (s.endsWith("/") ? s : s + "/");
  return addSlash(pathname).startsWith(addSlash(base));
};

export const AllowedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAllowed, setAllowed] = useState(true);

  const pathname = usePathname();
  const { role, pathMap, allowedPaths } = useAuth();
  useEffect(() => {
    // allowedPaths can be string[] or Map<Role, string[]>
    let bases: string[] = [];
    if (Array.isArray(allowedPaths)) {
      bases = allowedPaths;
    } else if (
      allowedPaths &&
      typeof (allowedPaths as any)?.get === "function"
    ) {
      bases = (allowedPaths as Map<string, string[]>).get(role) ?? [];
    }

    // Fallback: include the role’s base path from pathMap
    const roleBase = pathMap?.get?.(role);
    if (roleBase) bases.push(roleBase);

    const allowed = bases.length
      ? bases.some((b) => isSubPath(pathname, b))
      : true;
    setAllowed(allowed);
  }, [pathname, role, allowedPaths, pathMap]);

  return (
    <AllowedContext.Provider value={{ isAllowed: isAllowed }}>
      {isAllowed ? children : <div>Redirecting...</div>}
    </AllowedContext.Provider>
  );
};
export const useAllowedContext = () => {
  return useContext(AllowedContext);
};

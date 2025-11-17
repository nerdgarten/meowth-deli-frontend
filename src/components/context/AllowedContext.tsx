"use client";
import { usePathname } from "next/navigation";
import path from "path";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { tr } from "zod/v4/locales";

import { useAuth } from "./AuthContext";

interface AllowedContextType {
  isAllowed: boolean;
  checkAllowed: (check_path: string) => boolean;
}
export const AllowedContext = createContext<AllowedContextType>({
  isAllowed: true,
  checkAllowed: (check_path: string) => true,
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
  const checkAllowed = (check_path: string) => {
    if (!role) {
      return false;
    }
    let bases: string[] = [];
    if (Array.isArray(allowedPaths)) {
      bases = allowedPaths;
    } else if (allowedPaths instanceof Map) {
      // safe Map type check — no `any` and no unnecessary assertion
      bases = allowedPaths.get(role) ?? [];
    }
    const roleBase = pathMap?.get?.(role);
    if (roleBase) bases.push(roleBase);

    const allowed = bases.length
      ? bases.some((b) => isSubPath(check_path, b))
      : true;
    return allowed;
  };

  const [isAllowed, setAllowed] = useState(true);
  const allowedPaths = new Map<string, string[]>([
    ["admin", ["/admin", "order"]],
    ["restaurant", ["/restaurant", "/settings", "/history", "order"]],
    ["customer", ["/", "/settings", "/history", "/order"]],
    ["driver", ["/driver", "/settings", "/history", "/order"]],
  ]);
  const notAllowedPaths = new Map<string, string[]>([
    ["customer", ["/restaurant", "/admin", "/driver"]],
    ["driver", ["/admin"]],
    ["restaurant", ["/admin"]],
  ]);

  const pathname = usePathname();
  const { role, pathMap, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (
    //   role === "" &&
    //   isLoading === false &&
    //   !isSubPath(pathname, "/register")
    // ) {
    //   router.replace("/");
    //   return;
    // }

    let bases: string[] = [];
    if (Array.isArray(allowedPaths)) {
      bases = allowedPaths;
    } else if (
      allowedPaths &&
      typeof (allowedPaths as any)?.get === "function"
    ) {
      bases = allowedPaths.get(role) ?? [];
    }
    const roleBase = pathMap?.get?.(role);
    if (roleBase) bases.push(roleBase);

    const allowed = bases.length
      ? bases.some((b) => isSubPath(pathname, b))
      : true;
    const allowedNot = notAllowedPaths
      .get(role)
      ?.some((b) => isSubPath(pathname, b));
    // setAllowed(true);
    setAllowed(allowed && allowedNot !== true);
  }, [pathname, role, allowedPaths, pathMap]);

  return (
    <AllowedContext.Provider value={{ checkAllowed, isAllowed: isAllowed }}>
      {isAllowed ? (
        children
      ) : (
        // component-scoped UI using Tailwind classes (no global.css required)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="mx-4 max-w-lg rounded-xl bg-white/5 p-8 text-center text-white shadow-lg">
            <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
            <p className="text-sm text-neutral-200">
              You do not have permission to access this page.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  router.replace(pathMap.get(role) ?? "/");
                }}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Go To Main Page
              </button>
            </div>
          </div>
        </div>
      )}
    </AllowedContext.Provider>
  );
};
export const useAllowed = () => {
  return useContext(AllowedContext);
};

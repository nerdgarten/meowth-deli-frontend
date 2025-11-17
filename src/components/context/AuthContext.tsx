"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { set, type z } from "zod";

import { authenticatedAs } from "@/libs/authentication";
import { loginSubmitMutation } from "@/queries/auth";
import { type LoginFormSchema } from "@/queries/auth";
import type { User } from "@/types/review";
interface AuthContextType {
  isAuthenticated: boolean;
  user: User;
  role: string;
  login: (data: z.infer<typeof LoginFormSchema>) => Promise<void>;
  logout: () => Promise<void>;
  isLoading?: boolean;
  pathMap: Map<string, string>;
}
import { usePathname } from "next/navigation";
import path from "path";
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
import { logoutFunctionMutation } from "@/queries/logout";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = useRef<string>("");
  const [user, setUser] = useState<User | null>(null);
  const pathMap = new Map<string, string>([
    ["admin", "/admin/dashboard"],
    ["restaurant", "/restaurant/orders"],
    ["customer", "/"],
    ["driver", "/driver/orders"],
  ]);
  const login = async (data: z.infer<typeof LoginFormSchema>) => {
    await loginSubmitMutation(data);
    setIsAuthenticated(true);
    const d = await authenticatedAs();
    console.log("Authenticated as:", d);
    role.current = d ?? "";
    if (d) {
      setIsAuthenticated(true);
    }
    if (!d) return;
    router.replace(pathMap.get(d) ?? "/");
  };
  const logout = async () => {
    await logoutFunctionMutation();
    setIsAuthenticated(false);
    console.log("Logged out");
    role.current = "";
    setUser(null);
    router.replace("/");
  };
  // Authentication logic would go here
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const d = await authenticatedAs();
      if (d) {
        setIsAuthenticated(true);
        role.current = d;
      }
      setIsLoading(false);
    };
    checkAuth().catch(() => {
      console.error("Error during authentication check");
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: {} as User,
        role: role.current,
        login,
        logout,
        pathMap,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

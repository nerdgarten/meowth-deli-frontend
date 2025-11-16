"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
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
  pathMap: Map<string, string>;
}
import { usePathname } from "next/navigation";
import path from "path";
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const pathMap = new Map<string, string>([
    ["admin", "/admin"],
    ["restaurant", "/restaurant_2"],
    ["customer", "/"],
    ["driver", "/restaurant_2"],
  ]);
  const login = async (data: z.infer<typeof LoginFormSchema>) => {
    await loginSubmitMutation(data);
    setIsAuthenticated(true);
    const d = await authenticatedAs();
    setRole(d || "");
    if (d) {
      setIsAuthenticated(true);
    }
    if (!d) return;
    router.replace(pathMap.get(d) || "/");
  };
  const logout = async () => {
    // Logout logic would go here
    setIsAuthenticated(false);
    setRole("");
    setUser(null);
  };
  // Authentication logic would go here

  useEffect(() => {
    const checkAuth = async () => {
      const d = await authenticatedAs();
      if (d) {
        setIsAuthenticated(true);
        setRole(d);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: {} as User,
        role,
        login,
        logout,
        pathMap,
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

"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/review";
import { set, z } from "zod";
import { loginSubmitMutation } from "@/queries/auth";
import { LoginFormSchema } from "@/queries/auth";
import { authenticatedAs } from "@/libs/authentication";
import { useRouter } from "next/navigation";
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
    setRole(d ?? "");
    if (d) {
      setIsAuthenticated(true);
    }
    if (!d) return;
    router.replace(pathMap.get(d) || "/");
  };
  const logout = async () => {
    await logoutFunctionMutation();
    setIsAuthenticated(false);
    setRole("");
    setUser(null);
    router.replace("/");
  };
  // Authentication logic would go here
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      const d = await authenticatedAs();
      if (d) {
        setIsAuthenticated(true);
        setRole(d);
      }
      setIsLoading(false);
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

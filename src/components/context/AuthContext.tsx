"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/review";
import { z } from "zod";
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
  const login = async (data: z.infer<typeof LoginFormSchema>) => {
    await loginSubmitMutation(data);
    setIsAuthenticated(true);
    const d = await authenticatedAs();
    setRole(d || "");
    if (d) {
      setIsAuthenticated(true);
    }
  };
  const logout = async () => {
    // Logout logic would go here
    setIsAuthenticated(false);
    setRole("");
    setUser(null);
  };
  // Authentication logic would go here
  const pathMap = new Map<string, string>([
    ["admin", "/admin"],
    ["restaurant", "/restaurant"],
    ["customer", "/customer"],
    ["driver", "/driver"],
  ]);
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
  useEffect(() => {
    console.log("Role changed:", role);
    const path = pathMap.get(role);
    if (path) {
      console.log("Mapped path:", path);
    }
    if (path?.startsWith(path) === false) {
      console.log("Current pathname:", pathname);
    }
    if (path && pathname.startsWith(path) === false) {
      console.log("Redirecting to:", path);
      router.push(path);
    }
  }, [pathname, role]);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: {} as User,
        role,
        login,
        logout,
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

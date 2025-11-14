import "@/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { QueryProvider } from "@/components/common/QueryProvider";
import { CartProvider } from "@/components/context/CartProvider";
import { Navigation } from "@/components/Navigation/Navigation";
import { AuthProvider } from "@/components/context/AuthContext";

export const metadata: Metadata = {
  title: "Meowth Delivery",
  description: "Meowth Delivery - Food Delivery Service",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-app-background min-h-screen w-full font-sans">
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <Navigation />
              {children}
              <Toaster
                position="top-center"
                reverseOrder={true}
                toastOptions={{
                  style: {
                    backgroundColor: "#685B4B",
                    color: "#FEECC4",
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

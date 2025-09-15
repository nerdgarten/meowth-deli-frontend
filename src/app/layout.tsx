import "@/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/components/common/QueryProvider";
import { Navigation } from "@/components/Navigation/Navigation";

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
          <Navigation />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

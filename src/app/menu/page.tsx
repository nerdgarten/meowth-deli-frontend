"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to "/" immediately
    router.replace("/");
  }, [router]);

  return null; // Or a loading state if you want
}

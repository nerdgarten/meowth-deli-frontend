"use client";

import { usePathname } from "next/navigation";
import { House } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <House />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathParts.map((part, idx) => {
          const href = "/" + pathParts.slice(0, idx + 1).join("/");
          const isLast = idx === pathParts.length - 1;
          const isPrev = idx <= pathParts.length - 2;

          return (
            <div key={idx} className="flex items-center space-x-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-app-white font-semibold">
                    {capitalize(part)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className={isPrev ? "text-[#B9AE9C]" : undefined}
                    asChild
                  >
                    <Link href={href}>{capitalize(part)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Role } from "@/types/role";

type Feature = { text: string };

export default function RoleCard({
  role,
  titleRole,
  subtitle,
  href,
  features,
  badgeColor,
  iconSrc,
}: {
  role: Role;
  titleRole: string;
  subtitle: string;
  href: string;
  features: Feature[];
  badgeColor: string;
  iconSrc: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-app-dark-brown relative block w-full max-w-[360px] rounded-[28px] p-7 shadow-lg ring-1 ring-black/5 transition-colors transition-transform duration-500 ease-out will-change-transform hover:z-20 hover:-translate-y-2 hover:scale-[1.05] hover:rotate-2 hover:bg-[#665043] hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] focus:ring-2 focus:ring-amber-300 focus:outline-none"
    >
      <div className="space-y-1">
        <h3 className="text-center text-3xl font-bold text-white">
          Be Our <span className={badgeColor}>{titleRole}</span>
        </h3>
        <p className="text-center text-lg text-white/80">“{subtitle}”</p>

        <div className="mx-auto my-2 flex h-[28vh] items-center justify-center">
          <Image
            src={iconSrc}
            alt={`${titleRole} mascot`}
            height={180}
            width={160}
            className="pt-2 pb-6 drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]"
          />
        </div>

        <ul className="mt-2 space-y-4 text-sm">
          {features.map((f, i) => {
            const textWithColor = f.text.replace(
              /<b>/g,
              `<b class="${badgeColor} font-semibold">`
            );

            return (
              <li key={i} className="flex gap-3 text-white/85">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 ${badgeColor}`} />
                <span dangerouslySetInnerHTML={{ __html: textWithColor }} />
              </li>
            );
          })}
        </ul>
      </div>
    </Link>
  );
}

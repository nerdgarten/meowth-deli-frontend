'use client';

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

type Role = 'restaurant' | 'customer' | 'driver';

type Feature = { text: string};

export default function RoleCard({
    role,
    titleRole,
    subtitle,
    href,
    features,
    badgeColor,
    iconSrc,
}: {
    role:Role;
    titleRole: string;
    subtitle: string;
    href: string;
    features: Feature[];
    badgeColor: string;
    iconSrc: string;
}) {
    return(
        <Link
        href={href}
        className="
            relative group block rounded-[28px] bg-app-dark-brown p-7 ring-1 ring-black/5
            shadow-lg transition-transform transition-colors duration-500 ease-out
            will-change-transform
            hover:-translate-y-2 hover:rotate-2 hover:scale-[1.05]
            hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
            hover:bg-[#665043]
            focus:outline-none focus:ring-2 focus:ring-amber-300
            max-w-[360px] w-full
            hover:z-20
        "
        >
        <div className="space-y-1 ">
            <h3 className="text-3xl font-bold text-white text-center">
            Be Our <span className={badgeColor}>{titleRole}</span>
            </h3>
            <p className="text-center text-lg text-white/80">“{subtitle}”</p>

            <div className="mx-auto my-2 flex items-center justify-center h-[28vh]">
            <Image
                src={iconSrc}
                alt={`${titleRole} mascot`}
                height={180}
                width={160}
                className="drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)] pt-2 pb-6"
            />
            </div>

            <ul className="mt-2 space-y-4 text-sm">
            {features.map((f, i) => (
                <li key={i} className="flex gap-3 text-white/85">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 ${badgeColor}`} />
                <span dangerouslySetInnerHTML={{ __html: f.text }} />
                </li>
            ))}
            </ul>

        </div>
        </Link>
    );
}
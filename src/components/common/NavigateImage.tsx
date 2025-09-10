import Image from "next/image";
import Link from "next/link";

interface NavigateImageProps {
  href: string;
  src: string;
  alt?: string;
  className?: string;
}

export const NavigateImage = ({
  href,
  src,
  alt,
  className,
}: NavigateImageProps) => {
  return (
    <Link href={href}>
      <Image
        src={src}
        alt={alt ?? "icon"}
        width={0}
        height={0}
        className={className}
      />
    </Link>
  );
};

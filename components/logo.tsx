"use client";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal  items-center text-sm text-black py-1 shrink-0 relative z-20"
    >
      <Image
        src={`/HD_True_Logo.svg`}
        alt="hero"
        height={400}
        width={400}
        className="mx-auto transition duration-200"
        draggable={false}
      />
    </Link>
  );
};

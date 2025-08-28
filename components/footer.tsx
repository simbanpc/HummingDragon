import Link from "next/link";
import React from "react";
import { Logo } from "./logo";
import {
  IconBrandDiscord,
  IconBrandLinkedin,
  IconBrandMastodon,
  IconBrandTwitter,
} from "@tabler/icons-react";

export function Footer() {
  const documentation = [
    { title: "+1 480-237-4958", href: "#" },
  ];

  const resources = [
    { title: "tjohnson@hummingdragon.com", href: "#" },
  ];

  const company = [
    { title: "3101 N. Central Ave Ste 183 #6244 Phoenix, Arizona 85012", href: "#" },
    //{ title: "Contact", href: "#" },
    //{ title: "Customers", href: "#" },
    //{ title: "Brand", href: "#" },
  ];

  const legal = [
    { title: "Acceptable Use", href: "#" },
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
  ];

  const socials = [
    { title: "Twitter", href: "#", icon: IconBrandTwitter },
    { title: "Discord", href: "#", icon: IconBrandDiscord },
    { title: "LinkedIn", href: "#", icon: IconBrandLinkedin },
    { title: "Mastodon", href: "#", icon: IconBrandMastodon },
  ];

  return (
    <div className="relative border-t border-white/[0.1] px-8 bg-[#31312B] w-full overflow-hidden mx-auto max-w-7xl">
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px flex h-8 items-end overflow-hidden">
        <div className="flex -mb-px h-[2px] w-56">
          <div className="w-full flex-none [background-image:linear-gradient(90deg,rgba(255,255,255,0)_0%,#FFFFFF_32.29%,rgba(255,255,255,0.3)_67.19%,rgba(255,255,255,0)_100%)] blur-xs" />
        </div>
      </div>

      <div className="max-w-7xl my-10 mx-auto text-sm text-neutral-400 flex flex-col justify-between md:px-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-10 md:mb-0">
            <Logo />
            {/*<div className="flex gap-3 mt-6">
              {socials.map((social, idx) => (
                <SocialIcon key={`social-${idx}`} href={social.href}>
                  <social.icon strokeWidth={1.5} width={15} height={15} />
                </SocialIcon>
              ))}
            </div>
            */}
          </div>
          

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-10 md:ml-10">
            <div className="flex flex-col space-y-4">
              <p className="text-white font-semibold">Office Phone</p>
              <ul className="space-y-3">
                {documentation.map((item, idx) => (
                  <li key={`doc-${idx}`}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
            

            <div className="flex flex-col space-y-4">
              <p className="text-white font-semibold">Email</p>
              <ul className="space-y-3">
                {resources.map((item, idx) => (
                  <li key={`resource-${idx}`}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
            

            <div className="flex flex-col space-y-4">
              <p className="text-white font-semibold">Address</p>
              <ul className="space-y-3">
                {company.map((item, idx) => (
                  <li key={`company-${idx}`}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            {/*<div className="flex flex-col space-y-4">
              <p className="text-white font-semibold">Legal</p>
              <ul className="space-y-3">
                {legal.map((item, idx) => (
                  <li key={`legal-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            */}
          </div>
        </div>
        <div className="mt-10 md:mt-1 md:text-end">&copy; 2025 Humming Dragon LLC. All rights reserved.</div>
      </div>
    </div>
  );
}

interface SocialIconProps {
  href: string;
  children: React.ReactNode;
}

export function SocialIcon({ href, children }: SocialIconProps) {
  return (
    <Link
      href={href}
      className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center hover:bg-neutral-700/20 transition-all border border-neutral-700/50 shadow-[2px_-2px_15px_rgba(0,0,0,0.2)] hover:shadow-[4px_-4px_20px_rgba(0,0,0,0.3)] relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-full"
    >
      <div className="w-5 h-5 text-neutral-400 hover:text-white transition-colors flex justify-center items-center">
        {children}
      </div>
    </Link>
  );
}

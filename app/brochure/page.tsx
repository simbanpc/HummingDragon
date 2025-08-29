import BrochurePage from "@/components/brochurePage";
import { Metadata } from "next";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Humming Dragon - Brochure",
  description:
  "The Social App Store. Where Apps live and people connect.",
  openGraph: {
    url: "https://hummingdragon.com"
  },
};

export default async function ContactPage() {
  const ua = (await headers()).get('user-agent') ?? '';
  const isMobile =
    /Mobi|Android|iP(?:ad|hone|od)|IEMobile|BlackBerry/i.test(ua);

  if (isMobile) {
    redirect('/brochure.pdf'); // respects basePath automatically
  }
  return (
    <div className="relative overflow-hidden bg-[#378981]">
      <div className="w-full max-w-[900px] mx-auto">
        <BrochurePage/>
      </div>
    </div>
  );
}

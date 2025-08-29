import BrochurePage from "@/components/brochurePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Humming Dragon - Brochure",
  description:
  "The Social App Store. Where Apps live and people connect.",
  openGraph: {
    url: "https://hummingdragon.com"
  },
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-[#378981]">
      <div className="w-full max-w-[900px] mx-auto">
        <BrochurePage/>
      </div>
    </div>
  );
}

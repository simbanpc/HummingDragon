import PdfViewer from "@/components/pdfViewer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Humming Dragon - Brochure",
  description:
  "The Social App Store. Where Apps live and people connect.",
  openGraph: {
    url: "https://hummingdragon.com", 
    images: [""],
  },
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-[#378981]">
      <PdfViewer fileUrl="/Humming_Dragon_Brochure_Website.pdf" />
    </div>
  );
}

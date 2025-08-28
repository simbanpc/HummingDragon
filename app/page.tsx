import CTA from "@/components/cta";
import { FrequentlyAskedQuestions } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { SpotlightLogoCloud } from "@/components/logos-cloud";
import { Pricing } from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      {/*<SpotlightLogoCloud />
      <Features />
      <Testimonials />
      <Pricing />
      <FrequentlyAskedQuestions />
      <CTA />
      */}
    </div>
  );
}

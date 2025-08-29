import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Humming Dragon",
  description:
    "Hum in Market. Clarity that captivates. Strategy that endures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" as="document" href="/Humming_Dragon_Brochure_Website.pdf" />
      </head>
      <body className={cn("antialiased bg-[#31312B]", inter.className)}>
        {/*<Navbar />*/}
        {children}
        <Footer />
      </body>
    </html>
  );
}

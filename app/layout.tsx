import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Humming Dragon",
  description:
    "Hum in Market. Brand clarity that captivates. Strategy that endures.",
  openGraph: {
    title: "Humming Dragon",
    description: "Hum in Market. Brand clarity that captivates. Strategy that endures.",
    siteName: "Humming Dragon",
    url: "https://hummingdragon.com"
  },
  twitter:{
    title: "Humming Dragon",
    description: "Hum in Market. Brand clarity that captivates. Strategy that endures.",
    site: "https://hummingdragon.com",
    card: "summary"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased bg-[#31312B]", inter.className)}>
        {/*<Navbar />*/}
        {children}
        <Footer />
      </body>
    </html>
  );
}

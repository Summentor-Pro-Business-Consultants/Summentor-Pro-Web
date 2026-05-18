import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import PublicLayout from "@/components/layout/PublicLayout";
import TrackPageView from "@/components/TrackPageView";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Summentor Pro | Strategic Business Advisory",
  description:
    "Summentor Pro is a B2B consulting, events, and MSME advisory firm based in Bangalore. We elevate businesses by crafting personalized strategies in consulting, marketing, and partnership.",
  keywords:
    "B2B consulting, MSME advisory, business events, government relations, brand building, Bangalore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <TrackPageView />
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}

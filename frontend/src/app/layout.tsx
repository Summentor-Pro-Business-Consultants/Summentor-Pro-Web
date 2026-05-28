import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PublicLayout from "@/components/layout/PublicLayout";
import TrackPageView from "@/components/TrackPageView";

// Body font — Poppins, only the thicker weights per the brand spec.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

// Display font — Goia (real brand font, loaded from /public/fonts/Goia).
// Brand spec: headings/subheadings use Goia Bold; never thin weights.
// Only Bold and SemiBold .otf files are shipped, so:
//   • 600       → SemiBold (lighter subheading role)
//   • 700–900   → Bold (one file covers the heavy range so existing
//                 fontWeight: 800/900 inline styles don't trigger faux-bold)
const goia = localFont({
  variable: "--font-display-serif",
  display: "swap",
  src: [
    { path: "../../public/fonts/Goia/Goia-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Goia/Goia-Bold.otf", weight: "700 900", style: "normal" },
  ],
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
      className={`${poppins.variable} ${goia.variable}`}
    >
      <body>
        <TrackPageView />
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}

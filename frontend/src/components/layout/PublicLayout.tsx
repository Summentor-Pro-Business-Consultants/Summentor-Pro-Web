"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import CookieNotice from "./CookieNotice";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    // reducedMotion="user" makes every framer-motion reveal/animation across
    // the site honour the visitor's OS "reduce motion" setting automatically.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CookieNotice />
    </MotionConfig>
  );
}

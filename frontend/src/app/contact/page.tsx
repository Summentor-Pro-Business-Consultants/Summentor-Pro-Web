import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact | Summentor Pro",
  description:
    "Get in touch with Summentor Pro to book a consultation, attend an event, or learn more about our B2B advisory services.",
};

export default function ContactPage() {
  return (
    <>
      {/* Drop the global body grid on this route so it doesn't show through
          the slanted wedge around the dark hero. Restored on navigation away. */}
      <style>{`body { background-image: none !important; }`}</style>
      <ContactSection />
    </>
  );
}

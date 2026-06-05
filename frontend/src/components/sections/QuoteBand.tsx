"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

export default function QuoteBand() {
  return (
    <section
      style={{
        background: "var(--sp-navy-1000)",
        // Grid lines on top, alternating dark gradient (grad-a: light-left →
        // dark-right) as the bottom layer.
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), var(--sp-dark-grad-a)",
        backgroundSize: "44px 44px, 44px 44px, cover",
        paddingTop: "clamp(64px, 9vw, 100px)",
        paddingBottom: "clamp(64px, 9vw, 100px)",
        position: "relative",
        overflow: "hidden",
        // Straight horizontal — no slant. Per the divider-mix spec, this
        // section reads as a clean horizontal band between the slanted Hero
        // above and the slanted dark sections elsewhere.
      }}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: quote text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Green accent bar */}
            <div
              style={{
                width: 4,
                height: 52,
                background: "var(--sp-green-500)",
                borderRadius: 2,
                marginBottom: 28,
              }}
            />

            <h2
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(32px, 5vw, 64px)",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.01em",
                lineHeight: 1.05,
                color: "#fff",
                margin: 0,
              }}
            >
              BREAKING
              <br />
              BOUNDARIES,
              <br />
              <span style={{ color: "var(--sp-green-400)" }}>BUILDING</span>
              <br />
              DREAMS.
            </h2>

            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 17,
                fontStyle: "italic",
                color: "#6B7280",
                marginTop: 24,
                lineHeight: 1.6,
              }}
            >
              At Summentor Pro, we believe growth happens when the right people, ideas, and opportunities come together.
            </p>
          </motion.div>

          {/* Right: photo — all four edges feathered to transparent with a
              mask so the section's own background shows through and the photo
              blends in instead of reading as a hard-edged card. Using a mask
              (not a colour overlay) means it stays blended no matter what the
              background tone is. */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              height: 440,
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, #000 13%, #000 96%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, #000 13%, #000 96%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
            }}
          >
            <Image
              src="/images/engagements/meeting-cm-delhi.jpeg"
              alt="Strategic meeting"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

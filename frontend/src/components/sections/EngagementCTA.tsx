"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// The five focus areas from the content file ("We focus on:"). Laid out three
// over two, so the order here is the visual order and index 1 — the middle of
// the top row — carries the green highlight.
const focusItems = [
  { icon: "/icons/diagram.svg", title: "Curated networking opportunities" },
  { icon: "/icons/cooperation.svg", title: "Strategic business engagement" },
  { icon: "/icons/handshake.svg", title: "Industry & government collaboration" },
  { icon: "/icons/team-leader.svg", title: "High-intent business interactions" },
  { icon: "/icons/increase.svg", title: "Long-term ecosystem development" },
];

const HIGHLIGHT = 1;
const GAP = 8;
// Bottom row spans exactly two of the top row's three columns (plus one gap),
// so every card is the same width and the pair centres under the trio.
const BOTTOM_W = `calc((100% - ${GAP * 2}px) / 3 * 2 + ${GAP}px)`;

export default function EngagementCTA() {
  const topRow = focusItems.slice(0, 3);
  const bottomRow = focusItems.slice(3);

  return (
    <section
      style={{
        background: "#fff",
        paddingTop: "clamp(56px, 8vw, 80px)",
        paddingBottom: "clamp(56px, 8vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft atmospheric accent — fades in once on scroll */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: -120,
          right: -140,
          width: 520,
          height: 520,
          background:
            "radial-gradient(circle, rgba(5,161,113,0.10) 0%, rgba(5,161,113,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Soft green curved gradients glowing in from both edges */}
      <EdgeGreenGradient side="left" position="middle" />
      <EdgeGreenGradient side="right" position="bottom" />

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Top text block — one self-contained reveal. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 64, textAlign: "center", position: "relative" }}
        >
          <SectionHeading>WHY SUMMENTOR PRO?</SectionHeading>

          {/* Brand wavy accent — directly beneath the main heading. */}
          <WavyLine />

          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(22px, 2.48vw, 31px)",
              fontWeight: 500,
              color: "#000",
              margin: "18px auto 28px",
              maxWidth: 880,
            }}
          >
            Why Businesses Partner with Us
          </p>

          {/* Exact line breaks per the design — hard-coded with <br/>. */}
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(20px, 2.22vw, 28px)",
              lineHeight: 1.35,
              color: "#000",
              margin: "0 auto",
              maxWidth: 1120,
            }}
          >
            At Summentor Pro, we believe growth happens when the
            <br />
            right people, ideas, and opportunities come together.
            <br />
            Our approach combines consulting, strategic engagement,
            <br />
            business networking, and ecosystem-building to create
            <br />
            platforms that generate real conversations and long-term value.
          </p>
        </motion.div>

        {/* WE FOCUS ON — subheading + wavy + static three-over-two grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          style={{ textAlign: "center" }}
        >
          <SectionHeading>WE FOCUS ON:</SectionHeading>
          <WavyLine />

          <div
            style={{
              maxWidth: 1070,
              margin: "0 auto",
              marginTop: "clamp(28px, 4vw, 44px)",
            }}
          >
            {/* Top row — three cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: GAP }}>
              {topRow.map((item, i) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <FocusCard item={item} highlight={i === HIGHLIGHT} />
                </motion.div>
              ))}
            </div>

            {/* Bottom row — two cards, centred under the trio */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: GAP,
                width: BOTTOM_W,
                margin: `${GAP}px auto 0`,
              }}
            >
              {bottomRow.map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <FocusCard item={item} highlight={false} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── Single focus card ──────────────────────────────────────────────────────
// Dark tile with a white icon over a white label; the highlighted card (and any
// card on hover) fills with the brand green instead.
function FocusCard({ item, highlight }: { item: (typeof focusItems)[number]; highlight: boolean }) {
  const [hover, setHover] = useState(false);
  const green = highlight || hover;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        aspectRatio: "1.87 / 1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "clamp(12px, 1.5vw, 20px)",
        padding: "clamp(14px, 1.8vw, 24px) clamp(12px, 1.6vw, 22px)",
        borderRadius: 0,
        background: green ? "var(--sp-green)" : "var(--sp-surface-dark)",
        transition: "background 0.3s ease",
      }}
    >
      {/* The SVG is used as a CSS mask so its silhouette takes the icon colour. */}
      <span
        aria-hidden="true"
        style={{
          width: "clamp(38px, 3.6vw, 54px)",
          height: "clamp(38px, 3.6vw, 54px)",
          flexShrink: 0,
          backgroundColor: "#fff",
          WebkitMaskImage: `url(${item.icon})`,
          maskImage: `url(${item.icon})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
      <span
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(16px, 1.75vw, 26px)",
          fontWeight: 500,
          lineHeight: 1.2,
          color: "#fff",
        }}
      >
        {item.title}
      </span>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const services = [
  {
    num: "1.",
    title: "STRATEGIC\nCONSULTING",
    desc: "Business growth advisory, partnerships, expansion strategy, and stakeholder engagement",
  },
  {
    num: "2.",
    title: "GOVERNMENT\n& INDUSTRIAL\nFACILITATION",
    desc: "Supporting businesses through strategic engagement, industrial opportunities, policy alignment, and institutional collaborations",
  },
  {
    num: "3.",
    title: "INDUSTRY\nPLATFORMS &\nBUSINESS ECOSYSTEMS",
    desc: "Curated summits, networking forums, industry dialogues, and strategic business platforms",
  },
  {
    num: "4.",
    title: "BRAND &\nMARKET GROWTH",
    desc: "Helping businesses improve visibility, market positioning, outreach, and ecosystem presence",
  },
  {
    num: "5.",
    title: "CONNECTNOW\nBUSINESS NETWORKING\nPLATFORM",
    desc: "ConnectNow is our dedicated business networking initiative designed to help businesses generate qualified connections and pursue meaningful opportunities through intelligent matching",
  },
];

export default function ServicesGrid() {
  const [hovered, setHovered] = useState<number | null>(null);
  // The last card (ConnectNow) straddles the slant into the dark "Featured
  // Industry Platforms" section below: its negative bottom margin pulls that
  // section up so the slant cuts through the card's middle (matches design).
  const OVERLAP = 150;

  return (
    <section
      style={{
        // Above the dark section so the straddling last card stays on top.
        position: "relative",
        zIndex: 2,
        background: "#fff",
        paddingTop: "clamp(56px, 8vw, 80px)",
        // No bottom gap — the last card's negative margin defines where the
        // dark section's slant crosses it.
        paddingBottom: 0,
      }}
    >
      {/* Green curved gradients on the side edges — kept inside the section
          width (no overflow:hidden, which would clip the straddling card). */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "30%",
          height: "100%",
          background:
            "radial-gradient(ellipse at top left, rgba(5,161,113,0.16) 0%, rgba(5,161,113,0.05) 45%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "30%",
          height: "100%",
          background:
            "radial-gradient(ellipse at bottom right, rgba(5,161,113,0.16) 0%, rgba(5,161,113,0.05) 45%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container wide style={{ position: "relative", zIndex: 1 }}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48 }}
        >
          <SectionHeading>WHAT WE DO</SectionHeading>
          <WavyLine />
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(26px, 3.1vw, 38px)",
              color: "#000",
              margin: "16px 0 0 0",
              textAlign: "center",
            }}
          >
            Solutions Designed Around Growth &amp; Collaboration
          </p>
        </motion.div>

        {/* Service cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1280, margin: "0 auto" }}>
          {services.map((svc, i) => {
            const dark = hovered === i;
            return (
              <motion.div
                key={svc.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: dark ? "#252525" : "#F4F5F7",
                  border: `1.5px solid ${dark ? "rgba(255,255,255,0.07)" : "transparent"}`,
                  borderRadius: 28,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "stretch",
                  cursor: "default",
                  transition: "background 0.28s ease, border-color 0.28s ease",
                  // Last card straddles into the dark band below.
                  ...(i === services.length - 1
                    ? { marginBottom: -OVERLAP, position: "relative" as const, zIndex: 2 }
                    : {}),
                }}
              >
                {/* Left column: large gray number + green title side by side */}
                <div
                  style={{
                    width: "46%",
                    flexShrink: 0,
                    padding: "30px 26px 30px 52px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "clamp(20px, 3vw, 52px)",
                    overflow: "hidden",
                  }}
                >
                  {/* Large gray number — fixed-width box so every title starts
                      at the same x regardless of the digit's width. */}
                  <span
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(88px, 10.5vw, 152px)",
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      flexShrink: 0,
                      display: "inline-block",
                      width: "clamp(104px, 12vw, 150px)",
                      textAlign: "left",
                      userSelect: "none",
                      color: dark ? "rgba(255,255,255,0.18)" : "#8a8f96",
                      transition: "color 0.28s ease",
                    }}
                  >
                    {svc.num}
                  </span>

                  {/* Green title — to the right of number */}
                  <h3
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(24px, 3.2vw, 41px)",
                      fontWeight: 800,
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                      color: "#329555",
                      margin: 0,
                      lineHeight: 1.18,
                      whiteSpace: "pre-line",
                      transition: "color 0.28s ease",
                    }}
                  >
                    {svc.title}
                  </h3>
                </div>

                {/* Vertical divider — pitch black on light, short + centred */}
                <div
                  style={{
                    width: 2,
                    flexShrink: 0,
                    alignSelf: "center",
                    height: "clamp(70px, 10vw, 130px)",
                    background: dark ? "rgba(255,255,255,0.22)" : "#000",
                    transition: "background 0.28s ease",
                  }}
                />

                {/* Right column: description */}
                <div
                  style={{
                    flex: 1,
                    padding: "30px 48px 30px 42px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(18px, 2.15vw, 28px)",
                      lineHeight: 1.45,
                      fontWeight: 400,
                      color: dark ? "#E5E7EB" : "#000",
                      margin: 0,
                      transition: "color 0.28s ease",
                    }}
                  >
                    {svc.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

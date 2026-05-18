"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

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
    title: "CONNECTNOW –\nBUSINESS NETWORKING\nPLATFORM",
    desc: "ConnectNow is our dedicated business networking initiative designed to help businesses generate qualified connections and pursue meaningful opportunities through intelligent matching",
  },
];

export default function ServicesGrid() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ background: "#fff", paddingTop: 80, paddingBottom: 80 }}>
      <Container>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48 }}
        >
          <h2
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(22px, 3vw, 34px)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#111827",
              margin: 0,
            }}
          >
            WHAT WE DO
          </h2>
          <p style={{ fontFamily: "var(--sp-font-sans)", fontSize: 16, color: "#6B7280", margin: "8px 0 0 0" }}>
            Solutions Designed Around Growth &amp; Collaboration
          </p>
        </motion.div>

        {/* Service cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                  background: dark ? "#0f1f12" : "#F4F5F7",
                  border: `1.5px solid ${dark ? "rgba(255,255,255,0.07)" : "transparent"}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "stretch",
                  cursor: "default",
                  transition: "background 0.28s ease, border-color 0.28s ease",
                }}
              >
                {/* Left column: large gray number + green title side by side */}
                <div
                  style={{
                    width: "46%",
                    flexShrink: 0,
                    padding: "28px 20px 28px 28px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    overflow: "hidden",
                  }}
                >
                  {/* Large gray number */}
                  <span
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(80px, 10vw, 140px)",
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      flexShrink: 0,
                      userSelect: "none",
                      color: dark ? "rgba(255,255,255,0.15)" : "#C4C8CE",
                      transition: "color 0.28s ease",
                    }}
                  >
                    {svc.num}
                  </span>

                  {/* Green title — to the right of number */}
                  <h3
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(20px, 2.6vw, 34px)",
                      fontWeight: 800,
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                      color: dark ? "var(--sp-green-400)" : "var(--sp-green-600)",
                      margin: 0,
                      lineHeight: 1.3,
                      whiteSpace: "pre-line",
                      transition: "color 0.28s ease",
                    }}
                  >
                    {svc.title}
                  </h3>
                </div>

                {/* Vertical divider */}
                <div
                  style={{
                    width: 1,
                    flexShrink: 0,
                    alignSelf: "stretch",
                    margin: "24px 0",
                    background: dark ? "rgba(255,255,255,0.12)" : "#D1D5DB",
                    transition: "background 0.28s ease",
                  }}
                />

                {/* Right column: description */}
                <div
                  style={{
                    flex: 1,
                    padding: "28px 32px 28px 28px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(14px, 1.4vw, 18px)",
                      lineHeight: 1.65,
                      color: dark ? "#9CA3AF" : "#374151",
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

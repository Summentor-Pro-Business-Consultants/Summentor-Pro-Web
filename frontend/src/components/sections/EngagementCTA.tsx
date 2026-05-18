"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const focusCards = [
  {
    title: "Strategic Networking & Engagement",
    desc: "Connecting you with the right people, decision-makers, and opportunities across industries to build meaningful and lasting relationships.",
  },
  {
    title: "Industry & Ecosystem Collaboration",
    desc: "Facilitating meaningful dialogues and partnerships across MSMEs, enterprises, and institutions for shared growth and value creation.",
  },
  {
    title: "Curated Networking Opportunities",
    desc: "Bringing together business leaders through structured networking platforms and curated introductions that open doors to new markets.",
  },
];

export default function EngagementCTA() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ background: "#F9FAFB", paddingTop: 80, paddingBottom: 80 }}>
      <Container>
        {/* Top text block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 720, marginBottom: 56 }}
        >
          <h2
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(22px, 3vw, 34px)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--sp-navy-900)",
              margin: "0 0 8px 0",
            }}
          >
            WHY SUMMENTOR PRO?
          </h2>
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 18,
              fontWeight: 600,
              color: "#374151",
              margin: "0 0 16px 0",
            }}
          >
            Why Businesses Partner with Us
          </p>
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 15,
              lineHeight: 1.75,
              color: "#6B7280",
              margin: 0,
            }}
          >
            At Summentor Pro, we believe growth happens when the right people, ideas, and
            opportunities come together. Our approach combines consulting, strategic engagement,
            business networking, and ecosystem-building to create platforms that generate real
            connections and long-term value.
          </p>
        </motion.div>

        {/* Focus cards label */}
        <p
          style={{
            fontFamily: "var(--sp-font-sans)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            marginBottom: 20,
          }}
        >
          WE FOCUS ON:
        </p>

        {/* Cards grid — hover triggers dark state */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {focusCards.map((card, i) => {
            const dark = hovered === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: dark ? "var(--sp-navy-900)" : "#fff",
                  border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #E5E7EB",
                  borderTop: dark ? "3px solid var(--sp-green-500)" : "3px solid transparent",
                  borderRadius: 8,
                  padding: "28px 24px",
                  boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.18)" : "0 2px 12px rgba(0,0,0,0.06)",
                  cursor: "default",
                  transition: "all 0.25s ease",
                }}
              >
                {/* Number indicator */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 4,
                    background: dark ? "var(--sp-green-600)" : "var(--sp-green-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    transition: "background 0.25s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: dark ? "#fff" : "var(--sp-green-700)",
                      transition: "color 0.25s ease",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: dark ? "#fff" : "var(--sp-navy-900)",
                    margin: "0 0 10px 0",
                    lineHeight: 1.3,
                    transition: "color 0.25s ease",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: dark ? "#9CA3AF" : "#6B7280",
                    margin: 0,
                    transition: "color 0.25s ease",
                  }}
                >
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

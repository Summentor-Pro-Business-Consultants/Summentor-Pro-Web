"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
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

const EASE = [0.22, 1, 0.36, 1] as const;
// Shared CSS transitions for the hover-to-dark card pattern. Same easing
// curve as framer-motion variants so the visual rhythm stays consistent.
const HOVER_CSS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CARD_TRANSITION = `background 0.45s ${HOVER_CSS_EASE}, border-color 0.45s ${HOVER_CSS_EASE}, box-shadow 0.45s ${HOVER_CSS_EASE}`;
const TEXT_TRANSITION = `color 0.45s ${HOVER_CSS_EASE}`;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const cardsWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EASE } },
};

export default function EngagementCTA() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "#F9FAFB",
        paddingTop: 80,
        paddingBottom: 80,
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
            "radial-gradient(circle, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          style={{ position: "relative" }}
        >
          {/* Top text block */}
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <motion.h2
              variants={fadeUp}
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
            </motion.h2>

            {/* Accent underline grows in */}
            <motion.div
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
              }}
              style={{
                height: 3,
                width: 64,
                background: "var(--sp-green-500)",
                borderRadius: 2,
                transformOrigin: "left center",
                margin: "0 0 16px 0",
              }}
            />

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 20,
                fontWeight: 600,
                color: "#374151",
                margin: "0 0 16px 0",
              }}
            >
              Why Businesses Partner with Us
            </motion.p>
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 17,
                lineHeight: 1.75,
                color: "#6B7280",
                margin: 0,
              }}
            >
              At Summentor Pro, we believe growth happens when the right people, ideas, and
              opportunities come together. Our approach combines consulting, strategic engagement,
              business networking, and ecosystem-building to create platforms that generate real
              connections and long-term value.
            </motion.p>
          </div>

          {/* Focus cards label */}
          <motion.p
            variants={fadeUp}
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
          </motion.p>

          {/* Cards grid — hover triggers dark state + springy lift */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            variants={cardsWrap}
          >
            {focusCards.map((card, i) => {
              const dark = hovered === i;
              return (
                <motion.div
                  key={i}
                  variants={cardItem}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={{
                    y: -8,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  style={{
                    background: dark ? "var(--sp-navy-900)" : "#fff",
                    border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #E5E7EB",
                    borderTop: dark ? "3px solid var(--sp-green-500)" : "3px solid transparent",
                    borderRadius: 8,
                    padding: "28px 24px",
                    boxShadow: dark
                      ? "0 18px 40px rgba(0,0,0,0.20)"
                      : "0 2px 12px rgba(0,0,0,0.06)",
                    cursor: "default",
                    transition: CARD_TRANSITION,
                  }}
                >
                  {/* Number indicator */}
                  <motion.div
                    animate={{ scale: dark ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 4,
                      background: dark ? "var(--sp-green-600)" : "var(--sp-green-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      transformOrigin: "left center",
                      transition: `background 0.45s ${HOVER_CSS_EASE}`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 14,
                        fontWeight: 700,
                        color: dark ? "#fff" : "var(--sp-green-700)",
                        transition: TEXT_TRANSITION,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.div>

                  <h3
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 17,
                      fontWeight: 700,
                      color: dark ? "#fff" : "var(--sp-navy-900)",
                      margin: "0 0 10px 0",
                      lineHeight: 1.3,
                      transition: TEXT_TRANSITION,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: dark ? "#9CA3AF" : "#6B7280",
                      margin: 0,
                      transition: TEXT_TRANSITION,
                    }}
                  >
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

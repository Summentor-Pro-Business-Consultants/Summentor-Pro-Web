"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

export default function QuoteBand() {
  return (
    <section
      style={{
        backgroundColor: "#060e08",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        paddingTop: 100,
        paddingBottom: 100,
        overflow: "hidden",
      }}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: quote text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
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
                fontSize: 15,
                fontStyle: "italic",
                color: "#6B7280",
                marginTop: 24,
                lineHeight: 1.6,
              }}
            >
              At Summentor Pro, we believe growth happens when the right people, ideas, and opportunities come together.
            </p>
          </motion.div>

          {/* Right: photo */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ position: "relative", borderRadius: 8, overflow: "hidden", height: 420 }}
          >
            <img
              src="/images/engagements/meeting-cm-delhi.jpeg"
              alt="Strategic meeting"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
            {/* Gradient blend on left edge */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, #060e08 0%, transparent 30%)",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

export default function AboutSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "#fff",
        // Subtle grid background pattern — visible but not distracting.
        backgroundImage:
          "linear-gradient(rgba(10,26,13,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,26,13,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        paddingTop: "clamp(56px, 7vw, 72px)",
        paddingBottom: "clamp(56px, 7vw, 72px)",
        overflow: "hidden",
      }}
    >
      {/* Green gradient on right side */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "45%",
          height: "100%",
          background:
            "radial-gradient(ellipse at top right, rgba(34,197,94,0.13) 0%, rgba(34,197,94,0.05) 45%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <Container style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          {/* Dark rounded badge */}
          <div
            style={{
              display: "inline-block",
              background: "var(--sp-navy-900)",
              padding: "20px 56px",
              borderRadius: 22,
            }}
          >
            <span
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(18px, 2vw, 22px)",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              About Summentor Pro
            </span>
          </div>

          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(18px, 2.1vw, 22px)",
              lineHeight: 1.7,
              color: "#374151",
              marginTop: 32,
            }}
          >
            Summentor Pro works with MSMEs, enterprises, industry leaders, and institutions to
            enable strategic growth through consulting, business platforms, market expansion
            initiatives, and ecosystem-driven collaborations.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

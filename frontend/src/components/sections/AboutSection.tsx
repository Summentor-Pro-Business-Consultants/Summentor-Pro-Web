"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

function WavyLine() {
  return (
    <svg
      viewBox="0 0 200 12"
      width="160"
      height="12"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "14px auto 0" }}
    >
      <path
        d="M0,6 Q25,0 50,6 T100,6 T150,6 T200,6"
        stroke="var(--sp-green-500)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "#fff",
        paddingTop: 72,
        paddingBottom: 72,
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
          {/* Bordered heading pill */}
          <div
            style={{
              display: "inline-block",
              background: "var(--sp-navy-900)",
              padding: "7px 22px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              About Summentor Pro
            </span>
          </div>

          <WavyLine />

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

          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 18,
              lineHeight: 1.7,
              color: "#6B7280",
              marginTop: 20,
            }}
          >
            We work across industries to facilitate meaningful business interactions, strategic
            partnerships, and high-impact platforms that bring together policymakers, MSMEs,
            enterprises, innovators, and decision-makers. From strategic consulting and market
            expansion to industry platforms and ecosystem-driven networking initiatives, our focus
            remains on enabling long-term growth, collaboration, and value creation.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

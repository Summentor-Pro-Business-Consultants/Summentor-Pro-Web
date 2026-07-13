"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutSection() {
  return (
    <section
      style={{
        position: "relative",
        // Slide up behind the Hero's slanted bottom (Hero has the higher
        // z-index) so this section's grid fills the Hero's cut-out wedge and
        // scrolls with the page instead of revealing a blank background.
        zIndex: 0,
        marginTop: "calc(-1 * var(--sp-slant))",
        background: "#fff",
        // Subtle grid background pattern — visible but not distracting.
        backgroundImage:
          "linear-gradient(transparent, rgba(10,10,10,0.05) 1.5px, transparent 3px), linear-gradient(90deg, transparent, rgba(10,10,10,0.05) 1.5px, transparent 3px)",
        backgroundSize: "52px 52px",
        // Slant added back into the top padding so the heading keeps its
        // position despite the negative top margin pulling the section up.
        paddingTop: "calc(clamp(56px, 7vw, 72px) + var(--sp-slant))",
        paddingBottom: "clamp(56px, 7vw, 72px)",
        overflow: "hidden",
      }}
    >
      {/* Green curved gradient on right side */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "45%",
          height: "100%",
          background:
            "radial-gradient(ellipse at top right, rgba(5,161,113,0.15) 0%, rgba(5,161,113,0.06) 45%, transparent 75%)",
          pointerEvents: "none",
        }}
      />
      {/* Green curved gradient on left side */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "45%",
          height: "100%",
          background:
            "radial-gradient(ellipse at bottom left, rgba(5,161,113,0.15) 0%, rgba(5,161,113,0.06) 45%, transparent 75%)",
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
          style={{ maxWidth: 1080, margin: "0 auto" }}
        >
          {/* Heading sits inside a black rounded badge (no wavy line) */}
          <div
            style={{
              display: "inline-block",
              background: "var(--sp-navy-900)",
              borderRadius: "clamp(12px, 1.6vw, 22px)",
              padding: "clamp(6px, 0.9vw, 12px) clamp(18px, 2.6vw, 34px)",
            }}
          >
            <SectionHeading dark>About Summentor Pro</SectionHeading>
          </div>

          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(17px, 2.3vw, 26px)",
              lineHeight: 1.35,
              color: "#000",
              marginTop: 40,
              // Breathing room so the copy doesn't crowd the section's slanted
              // bottom edge.
              marginBottom: "clamp(40px, 6vw, 88px)",
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

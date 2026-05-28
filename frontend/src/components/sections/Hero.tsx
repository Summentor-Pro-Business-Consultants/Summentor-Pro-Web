"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Typewriter from "@/components/ui/Typewriter";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--sp-dark-bg)",
        // Right-bottom slant → bottom-LEFT raised, dark extends further on the
        // RIGHT. Matches the home-page PDF where the dark hero's bottom edge
        // slopes down toward the right.
        clipPath:
          "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - var(--sp-slant)))",
      }}
    >

      {/* Background conference photo — replaced by video later */}
      <Image
        src="/images/engagements/msme-consulting-2.jpeg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "center top",
          opacity: 0.38,
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(6,14,8,0.75) 0%, rgba(6,14,8,0.5) 60%, rgba(6,14,8,0.65) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to bottom, transparent, rgba(6,14,8,0.85))",
        }}
      />

      <Container style={{ position: "relative", zIndex: 1, paddingTop: "clamp(56px, 8vw, 80px)", paddingBottom: "clamp(56px, 8vw, 80px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center" }}
        >
          <h1
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(36px, 6.5vw, 82px)",
              fontWeight: 800,
              lineHeight: 1.04,
              color: "#ffffff",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              margin: "0 auto",
              maxWidth: 900,
            }}
          >
            BUILDING STRATEGIC
            <br />
            PLATFORMS FOR
            <br />
            <span
              style={{
                display: "inline-block",
                background: "var(--sp-green-700)",
                color: "#fff",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(32px, 5.5vw, 70px)",
                padding: "4px 20px 4px 16px",
                marginTop: -10,
                lineHeight: 1.15,
                letterSpacing: "-0.005em",
                // Slight counter-clockwise tilt to match the design — right
                // edge lifts above the left so the block reads as dynamic
                // rather than static.
                transform: "rotate(-3deg)",
                transformOrigin: "center",
              }}
            >
              <Typewriter text="Business Growth" startDelay={600} />
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 justify-center"
            style={{ marginTop: 52 }}
          >
            {/* Explore Solutions — green outlined pill, transparent fill */}
            <Link href="/services" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "#fff",
                  background: "transparent",
                  border: "2px solid var(--sp-green-500)",
                  borderRadius: 999,
                  padding: "14px 36px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--sp-green-500)";
                  el.style.color = "var(--sp-navy-900)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "transparent";
                  el.style.color = "#fff";
                }}
              >
                Explore Solutions
              </button>
            </Link>

            {/* Partner With Us — solid white pill, dark text */}
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "var(--sp-navy-900)",
                  background: "#fff",
                  border: "2px solid #fff",
                  borderRadius: 999,
                  padding: "14px 36px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--sp-green-500)";
                  el.style.borderColor = "var(--sp-green-500)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "#fff";
                  el.style.borderColor = "#fff";
                }}
              >
                Partner With Us
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

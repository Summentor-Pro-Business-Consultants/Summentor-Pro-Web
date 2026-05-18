"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const pub = (name: string) => "/" + encodeURIComponent(name);

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#060e08",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          zIndex: 0,
        }}
      />

      {/* Background conference photo — replaced by video later */}
      <img
        src={pub("MSME Consulting & Government-Industry Engagement 2.jpeg")}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
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

      {/* Radial green glow — bottom-left atmospheric depth */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "50%",
        height: "60%",
        background: "radial-gradient(ellipse at bottom left, rgba(34,197,94,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Decorative diagonal accent — top-right corner */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 320,
        height: 320,
        background: "linear-gradient(135deg, transparent 60%, rgba(34,197,94,0.08) 100%)",
        pointerEvents: "none",
      }} />

      <Container style={{ position: "relative", zIndex: 1, paddingTop: 80, paddingBottom: 80 }}>
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              margin: 0,
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
                marginTop: 6,
                lineHeight: 1.15,
                letterSpacing: "-0.005em",
              }}
            >
              Business Growth
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-wrap gap-4"
            style={{ marginTop: 52 }}
          >
            <Link href="/services" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#fff",
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.65)",
                  borderRadius: 4,
                  padding: "13px 32px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.1)";
                  el.style.borderColor = "#fff";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "transparent";
                  el.style.borderColor = "rgba(255,255,255,0.65)";
                }}
              >
                Explore Solutions
              </button>
            </Link>

            <Link href="/contact" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#fff",
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.65)",
                  borderRadius: 4,
                  padding: "13px 32px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.1)";
                  el.style.borderColor = "#fff";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "transparent";
                  el.style.borderColor = "rgba(255,255,255,0.65)";
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

"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/ui/Container";

interface AnimatedStatProps {
  target: number;
  style?: React.CSSProperties;
}

function AnimatedStat({ target, style }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800; // ms
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out: decelerate toward the end
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    }

    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <div ref={ref} style={style}>
      {count}+
    </div>
  );
}


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

const CARD_BG = "#111c12";
const CARD_BORDER = "1px solid rgba(255,255,255,0.06)";
const CARD_RADIUS = 10;

export default function StatsBar() {
  return (
    <section
      style={{
        backgroundColor: "#0a1209",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <Container>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: 56 }}
        >
          <h2
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(26px, 4vw, 52px)",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            DRIVING MEANINGFUL
            <br />
            BUSINESS ENGAGEMENTS
          </h2>
          <WavyLine />
        </motion.div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ── Row 1, Left: Photo + 3000+ stat ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0 }}
            style={{
              display: "flex",
              alignItems: "stretch",
              background: CARD_BG,
              border: CARD_BORDER,
              borderRadius: CARD_RADIUS,
              overflow: "hidden",
              minHeight: 200,
            }}
          >
            <img
              src="/images/engagements/msme-consulting-2.jpeg"
              alt="Business stakeholders at a summit"
              style={{ width: 180, flexShrink: 0, objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ flex: 1, padding: "28px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <AnimatedStat
                target={3000}
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(48px, 6vw, 72px)",
                  fontWeight: 800,
                  color: "var(--sp-green-500)",
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              />
              <p style={{ fontFamily: "var(--sp-font-sans)", fontSize: "clamp(15px, 1.6vw, 20px)", lineHeight: 1.45, color: "#CBD5E1", margin: 0 }}>
                Business Stakeholders Engaged
              </p>
            </div>
          </motion.div>

          {/* ── Row 1, Right: Photo + participation text ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{
              display: "flex",
              alignItems: "stretch",
              background: CARD_BG,
              border: CARD_BORDER,
              borderRadius: CARD_RADIUS,
              overflow: "hidden",
              minHeight: 200,
            }}
          >
            <img
              src="/images/engagements/meeting-union-minister-msme.jpeg"
              alt="Meeting with Union Minister of MSME"
              style={{ width: 180, flexShrink: 0, objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ flex: 1, padding: "28px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "var(--sp-font-sans)", fontSize: "clamp(15px, 1.6vw, 20px)", lineHeight: 1.5, color: "#CBD5E1", margin: 0 }}>
                Government &amp; Industry Participation Across Strategic Platforms &amp; Initiatives
              </p>
            </div>
          </motion.div>

          {/* ── Row 2, Left: 100+ stat only (no photo) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            style={{
              display: "flex",
              alignItems: "center",
              background: CARD_BG,
              border: CARD_BORDER,
              borderRadius: CARD_RADIUS,
              overflow: "hidden",
              minHeight: 200,
              padding: "28px 36px",
            }}
          >
            <div>
              <AnimatedStat
                target={100}
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(56px, 7vw, 86px)",
                  fontWeight: 800,
                  color: "var(--sp-green-500)",
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              />
              <p style={{ fontFamily: "var(--sp-font-sans)", fontSize: "clamp(15px, 1.6vw, 20px)", lineHeight: 1.45, color: "#CBD5E1", margin: 0 }}>
                Strategic Collaborations Facilitated
              </p>
            </div>
          </motion.div>

          {/* ── Row 2, Right: Two photo+text pairs side by side ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{
              display: "flex",
              alignItems: "stretch",
              background: CARD_BG,
              border: CARD_BORDER,
              borderRadius: CARD_RADIUS,
              overflow: "hidden",
              minHeight: 200,
            }}
          >
            {/* Sub-pair 1 */}
            <div style={{ flex: 1, display: "flex", alignItems: "stretch", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <img
                src="/images/engagements/textile-women-empowerment-odisha.jpeg"
                alt="Multi-sector industry engagement"
                style={{ width: 110, flexShrink: 0, objectFit: "cover", objectPosition: "center" }}
              />
              <div style={{ flex: 1, padding: "20px 18px", display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--sp-font-sans)", fontSize: "clamp(13px, 1.3vw, 16px)", lineHeight: 1.5, color: "#CBD5E1", margin: 0 }}>
                  Multi-Sector Industry Platforms Executed
                </p>
              </div>
            </div>

            {/* Sub-pair 2 */}
            <div style={{ flex: 1, display: "flex", alignItems: "stretch" }}>
              <img
                src="/images/engagements/msme-consulting-1.jpeg"
                alt="Ecosystem participation"
                style={{ width: 110, flexShrink: 0, objectFit: "cover", objectPosition: "center" }}
              />
              <div style={{ flex: 1, padding: "20px 18px", display: "flex", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--sp-font-sans)", fontSize: "clamp(13px, 1.3vw, 16px)", lineHeight: 1.5, color: "#CBD5E1", margin: 0 }}>
                  Ecosystem Participation Across MSMEs, Enterprises &amp; Institutions
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}

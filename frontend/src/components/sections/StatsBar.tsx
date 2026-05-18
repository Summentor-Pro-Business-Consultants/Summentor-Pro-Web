"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
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
    const duration = 1800;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
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

const statNumber: React.CSSProperties = {
  fontFamily: "var(--sp-font-sans)",
  fontWeight: 800,
  color: "var(--sp-green-500)",
  lineHeight: 1,
};
const bodyText: React.CSSProperties = {
  fontFamily: "var(--sp-font-sans)",
  lineHeight: 1.5,
  color: "#CBD5E1",
  margin: 0,
};

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const cell: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Photo column that fills the card height (Next.js optimized image). */
function Photo({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ position: "relative", flexShrink: 0, alignSelf: "stretch" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 40vw, 200px"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}

const cardBase: React.CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  background: CARD_BG,
  border: CARD_BORDER,
  borderRadius: CARD_RADIUS,
  overflow: "hidden",
  minHeight: 210,
};

const hoverLift = {
  y: -6,
  transition: { type: "spring" as const, stiffness: 300, damping: 22 },
};

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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric green glow for depth (SKILL.md) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: 800,
          height: 500,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <Container>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
          style={{ marginBottom: 56, position: "relative" }}
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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Row 1, Left — Photo + 3000+ */}
          <motion.div variants={cell} whileHover={hoverLift} style={cardBase}>
            <Photo
              src="/images/engagements/msme-consulting-2.jpeg"
              alt="Business stakeholders at a summit"
              className="w-[34%] md:w-[190px]"
            />
            <div
              style={{
                flex: 1,
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <AnimatedStat
                target={3000}
                style={{
                  ...statNumber,
                  fontSize: "clamp(44px, 6vw, 72px)",
                  marginBottom: 10,
                }}
              />
              <p style={{ ...bodyText, fontSize: "clamp(15px, 1.6vw, 20px)" }}>
                Business Stakeholders Engaged
              </p>
            </div>
          </motion.div>

          {/* Row 1, Right — Photo + participation text */}
          <motion.div variants={cell} whileHover={hoverLift} style={cardBase}>
            <Photo
              src="/images/engagements/meeting-union-minister-msme.jpeg"
              alt="Meeting with Union Minister of MSME"
              className="w-[34%] md:w-[190px]"
            />
            <div
              style={{
                flex: 1,
                padding: "28px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p style={{ ...bodyText, fontSize: "clamp(16px, 1.7vw, 22px)" }}>
                Government &amp; Industry Participation Across Strategic
                Platforms &amp; Initiatives
              </p>
            </div>
          </motion.div>

          {/* Row 2, Left — 100+ stat · Photo · Multi-Sector text (3 parts) */}
          <motion.div
            variants={cell}
            whileHover={hoverLift}
            style={cardBase}
            className="flex-col sm:flex-row"
          >
            <div
              style={{
                flex: 1,
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <AnimatedStat
                target={100}
                style={{
                  ...statNumber,
                  fontSize: "clamp(48px, 6.5vw, 80px)",
                  marginBottom: 10,
                }}
              />
              <p style={{ ...bodyText, fontSize: "clamp(14px, 1.5vw, 18px)" }}>
                Strategic Collaborations Facilitated
              </p>
            </div>
            <Photo
              src="/images/engagements/meeting-deputy-cm-odisha.jpeg"
              alt="Strategic collaboration ceremony"
              className="w-full h-[160px] sm:h-auto sm:w-[150px]"
            />
            <div
              style={{
                flex: 1,
                padding: "28px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p style={{ ...bodyText, fontSize: "clamp(14px, 1.5vw, 18px)" }}>
                Multi-Sector Industry Platforms Executed
              </p>
            </div>
          </motion.div>

          {/* Row 2, Right — Photo + ecosystem text */}
          <motion.div variants={cell} whileHover={hoverLift} style={cardBase}>
            <Photo
              src="/images/engagements/msme-consulting-1.jpeg"
              alt="Ecosystem participation across institutions"
              className="w-[34%] md:w-[190px]"
            />
            <div
              style={{
                flex: 1,
                padding: "28px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p style={{ ...bodyText, fontSize: "clamp(16px, 1.7vw, 22px)" }}>
                Ecosystem Participation Across MSMEs, Enterprises &amp;
                Institutions
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

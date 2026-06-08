"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Count-up number ────────────────────────────────────────────────────────
function AnimatedStat({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
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
    <span
      ref={ref}
      style={{
        fontFamily: "var(--sp-font-sans)",
        fontWeight: 800,
        color: "var(--sp-green-500)",
        lineHeight: 1,
        fontSize: "clamp(42px, 5vw, 72px)",
        letterSpacing: "-0.02em",
        display: "block",
        marginBottom: 6,
      }}
    >
      {count.toLocaleString()}+
    </span>
  );
}

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// ─── Building blocks ────────────────────────────────────────────────────────
/** Landscape rectangle photo — sharp corners, faint static ring. */
function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        width: "clamp(180px, 18vw, 250px)",
        aspectRatio: "3 / 2",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        quality={100}
        sizes="(max-width: 768px) 70vw, 250px"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--sp-font-sans)",
  fontWeight: 400,
  color: "#F2F4F7",
  fontSize: "clamp(18px, 1.85vw, 25px)",
  lineHeight: 1.35,
  margin: 0,
  maxWidth: 250,
};

/** A grouped image+content unit (image left, content right). */
function Pair({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={item}
      className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left"
      style={{ gap: "clamp(14px, 1.4vw, 22px)" }}
    >
      <Photo src={src} alt={alt} />
      <div>{children}</div>
    </motion.div>
  );
}

/** A standalone statistic block (number above label). */
function StatBlock({
  target,
  label,
  className = "",
}: {
  target: number;
  label: string;
  className?: string;
}) {
  return (
    <motion.div variants={item} className={`text-center sm:text-left ${className}`}>
      <AnimatedStat target={target} />
      <p style={labelStyle}>{label}</p>
    </motion.div>
  );
}

const rowContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

export default function StatsBar() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--sp-navy-1000)",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), var(--sp-dark-grad-b)",
        backgroundSize: "44px 44px, 44px 44px, cover",
        paddingTop: "clamp(64px, 9vw, 96px)",
        paddingBottom: "clamp(72px, 10vw, 110px)",
        clipPath:
          "polygon(0 var(--sp-slant), 100% 0, 100% 100%, 0 calc(100% - var(--sp-slant)))",
      }}
    >
      <style>{`
        /* Gap between blocks in a stats row. Set here (not via a Tailwind
           arbitrary class) so the clamp() value is reliably applied. */
        .sp-statrow { gap: 3rem; }
        @media (min-width: 1024px) {
          .sp-statrow { gap: clamp(16px, 1.8vw, 36px); }
          /* Tighten ONLY the gap after the standalone stat block (100+) so it
             sits closer to its neighbouring image, without touching the other
             gaps in the row. */
          .sp-stat-tight { margin-right: clamp(-24px, -1.2vw, -8px); }
        }
      `}</style>

      <Container wide>
        {/* Heading + decorative stroke (nudged slightly right of centre) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
          style={{ marginBottom: "clamp(48px, 7vw, 84px)" }}
        >
          <SectionHeading dark>
            DRIVING MEANINGFUL
            <br />
            BUSINESS ENGAGEMENTS
          </SectionHeading>
          <div style={{ transform: "translateX(6%)" }}>
            <WavyLine />
          </div>
        </motion.div>

        {/* Row 1 — two image-text pairs packed together, centred (no dead gap) */}
        <motion.div
          variants={rowContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="sp-statrow flex flex-col items-center lg:flex-row lg:flex-nowrap lg:justify-center lg:items-center"
          style={{ marginBottom: "clamp(56px, 8vw, 110px)" }}
        >
          <Pair
            src="/images/engagements/msme-consulting-2.jpeg"
            alt="Business stakeholders at a summit"
          >
            <AnimatedStat target={3000} />
            <p style={labelStyle}>Business Stakeholders Engaged</p>
          </Pair>

          <Pair
            src="/images/engagements/meeting-union-minister-msme.jpeg"
            alt="Meeting with Union Minister of MSME"
          >
            <p style={labelStyle}>
              Government &amp; Industry Participation Across Strategic Platforms
              &amp; Initiatives
            </p>
          </Pair>
        </motion.div>

        {/* Row 2 — three blocks packed together, centred (no dead gap) */}
        <motion.div
          variants={rowContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="sp-statrow flex flex-col items-center lg:flex-row lg:flex-nowrap lg:justify-center lg:items-center"
        >
          <StatBlock
            target={100}
            label="Strategic Collaborations Facilitated"
            className="sp-stat-tight"
          />

          <Pair
            src="/images/engagements/meeting-deputy-cm-odisha.jpeg"
            alt="Strategic collaboration ceremony"
          >
            <p style={labelStyle}>Multi-Sector Industry Platforms Executed</p>
          </Pair>

          <Pair
            src="/images/engagements/msme-consulting-1.jpeg"
            alt="Ecosystem participation across institutions"
          >
            <p style={labelStyle}>
              Ecosystem Participation Across MSMEs, Enterprises &amp;
              Institutions
            </p>
          </Pair>
        </motion.div>
      </Container>
    </section>
  );
}

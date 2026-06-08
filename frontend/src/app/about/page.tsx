"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import Typewriter from "@/components/ui/Typewriter";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;
// Shared CSS transitions for the hover-to-dark card pattern. Same easing
// curve as framer-motion so hover-on/off feels consistent everywhere.
const HOVER_CSS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CARD_TRANSITION = `background 0.45s ${HOVER_CSS_EASE}, border-color 0.45s ${HOVER_CSS_EASE}, box-shadow 0.45s ${HOVER_CSS_EASE}`;
const TEXT_TRANSITION = `color 0.45s ${HOVER_CSS_EASE}`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const focusEnablers = [
  { title: "Meaningful business interactions", desc: "Curated environments that move past transactional networking into genuine dialogue." },
  { title: "Strategic partnerships", desc: "Long-term collaborations between businesses, institutions, and ecosystem stakeholders." },
  { title: "Industry dialogue", desc: "Structured conversations across MSMEs, enterprises, and policymakers." },
  { title: "Government-industry engagement", desc: "Facilitated B2G pathways that turn policy access into real opportunity." },
  { title: "High-value networking", desc: "Qualified introductions designed around intent, not volume." },
];

const initiatives = [
  {
    title: "Textile & Women Empowerment Initiative – Odisha",
    desc: "Supported the establishment of a textile unit in Balasore, Odisha focused on creating employment opportunities for women through skilling, stitching, and livelihood development initiatives.",
    focus: ["Women empowerment", "Rural employment", "Skill development", "MSME support"],
    photo: "/images/engagements/textile-women-empowerment-odisha.jpeg",
  },
  {
    title: "MSME Consulting & Government-Industry Engagement",
    desc: "We support MSMEs and businesses in building meaningful B2G connections by facilitating government-industry engagement, identifying relevant project opportunities and enabling strategic conversations with institutional stakeholders.",
    focus: [
      "MSME growth consulting",
      "B2G connection facilitation",
      "Government relations",
      "Institutional stakeholder engagement",
      "Project opportunity mapping",
      "Business expansion strategy",
    ],
    photo: "/images/engagements/msme-consulting-1.jpeg",
  },
  {
    title: "Architectural, Eco-Tourism & Infrastructure – Northeast India",
    desc: "Facilitated business expansion and project engagement opportunities for a Chennai-based architect in Northeast India, supporting discussions across architectural services, eco-tourism development and infrastructure-related initiatives.",
    focus: [
      "Business expansion",
      "Architectural project facilitation",
      "Eco-tourism development",
      "Infrastructure engagement",
      "Strategic networking",
      "Regional development",
    ],
    photo: "/images/engagements/meeting-deputy-cm-odisha.jpeg",
  },
  {
    title: "Biomethanation & Waste-to-Energy – Assam",
    desc: "Facilitated a biomethanation project in Guwahati, Assam for a Bengaluru-based client focused on sustainable waste management and renewable energy generation.",
    focus: ["Sustainability", "Renewable energy", "Industrial facilitation", "Waste management"],
    photo: "/images/engagements/csr-farmers-odisha-3.jpeg",
  },
  {
    title: "CSR Initiative for Farmers – Odisha",
    desc: "Supported a CSR-led agricultural initiative in Balasore, Odisha focused on improving rural livelihoods and strengthening agricultural productivity through new crop varieties and farmer training.",
    focus: [
      "CSR engagement",
      "Agricultural development",
      "Farmer training & skilling",
      "Rural ecosystem development",
      "Community impact",
      "Seed production awareness",
    ],
    photo: "/images/engagements/csr-farmers-odisha-1.jpeg",
  },
];

const leadershipPhotos = [
  "/images/engagements/meeting-mos-msme.jpeg",
  "/images/engagements/meeting-defence-minister.jpeg",
  "/images/engagements/meeting-cm-delhi.jpeg",
];

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Story />
      <PullQuote />
      <WhatMakesUsDifferent />
      <Leadership />
      <Initiatives />
    </>
  );
}

// ─── 1. Hero ────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--sp-dark-grad-a)",
        paddingTop: "clamp(56px, 8vw, 80px)",
        paddingBottom: "clamp(72px, 11vw, 120px)",
        clipPath:
          "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - var(--sp-slant)))",
      }}
    >
      <Image
        src="/images/engagements/msme-consulting-2.jpeg"
        alt=""
        aria-hidden="true"
        fill
        quality={92}
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.28 }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0.78) 60%, #080808 100%)",
        }}
      />
      <Container wide>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          style={{ position: "relative", textAlign: "center", margin: "0 auto" }}
        >
          <motion.div variants={fadeUp}>
            <span
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#fff",
                textTransform: "uppercase",
                borderBottom: "2px solid #fff",
                paddingBottom: 4,
              }}
            >
              ABOUT US
            </span>
          </motion.div>
          <motion.div variants={fadeUp} style={{ marginTop: 28 }}>
            <PageHeading className="whitespace-normal md:whitespace-nowrap">
              <span style={{ display: "block" }}>BUILDING BUSINESS ECOSYSTEMS</span>
              <span
                style={{
                  background: "var(--sp-green-500)",
                  color: "var(--sp-navy-900)",
                  padding: "0 14px",
                  display: "inline-block",
                  marginTop: -10,
                  transform: "rotate(-3deg)",
                  transformOrigin: "center",
                }}
              >
                <Typewriter text="THAT DRIVE REAL GROWTH." startDelay={550} />
              </span>
            </PageHeading>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── 2. Story body ──────────────────────────────────────────────────────────
function Story() {
  const paragraphs = [
    "At Summentor Pro, we specialize in strategic consulting, business innovation, government engagement, and ecosystem development. Founded by Nitika Shahi and Suhaib Ahmed, we have spent over a decade building one of India's emerging platforms focused on meaningful business growth, strategic collaboration, and ecosystem-driven engagement.",
    "Summentor Pro is a strategic business consulting and ecosystem engagement firm committed to enabling impactful collaborations between MSMEs, enterprises, industry leaders, institutions, and ecosystem stakeholders.",
  ];

  return (
    <section
      style={{
        background: "#fff",
        backgroundImage:
          "linear-gradient(rgba(10,10,10,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            position: "relative",
            textAlign: "center",
          }}
        >
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(22px, 2.2vw, 30px)",
                fontWeight: 500,
                lineHeight: 1.6,
                color: "#0a0a0a",
                margin: "0 0 28px",
                textAlign: "center",
              }}
            >
              {p}
            </motion.p>
          ))}

          <motion.div
            variants={fadeUp}
            style={{ marginTop: 32, textAlign: "center" }}
          >
            <Link
              href="/services"
              style={{
                display: "inline-block",
                padding: "16px 38px",
                borderRadius: 999,
                border: "1.5px solid var(--sp-green-600)",
                background: "transparent",
                color: "var(--sp-navy-900)",
                textDecoration: "none",
                fontFamily: "var(--sp-font-sans)",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.04em",
                transition: CARD_TRANSITION,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--sp-green-600)";
                el.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "var(--sp-navy-900)";
              }}
            >
              Know More
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── 3. Pull-quote band ─────────────────────────────────────────────────────
function PullQuote() {
  return (
    <section
      style={{
        background: "var(--sp-navy-1000)",
        // Grid lines on top, alternating dark gradient (grad-b) underneath.
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), var(--sp-dark-grad-b)",
        backgroundSize: "44px 44px, 44px 44px, cover",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
        clipPath:
          "polygon(0 var(--sp-slant), 100% 0, 100% 100%, 0 calc(100% - var(--sp-slant)))",
      }}
    >
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: "var(--sp-font-sans)",
            fontSize: "clamp(34px, 5vw, 64px)",
            fontWeight: 900,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 1.15,
            textAlign: "center",
            margin: 0,
            position: "relative",
          }}
        >
          WHERE STRATEGY MEETS
          <br />
          <span style={{ color: "var(--sp-green-400)" }}>IMPACT, AND INNOVATION</span>
          <br />
          <span style={{ color: "var(--sp-green-400)" }}>DRIVES GROWTH.</span>
        </motion.h2>
      </Container>
    </section>
  );
}

// ─── 4. What Makes Us Different ─────────────────────────────────────────────
function WhatMakesUsDifferent() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const perPage = 3;
  const maxIndex = Math.max(0, focusEnablers.length - perPage);
  const visible = focusEnablers.slice(index, index + perPage);

  // Auto-advance every 5s; pause while a card is hovered. Loops back to the
  // start once it reaches the last page so the carousel never stalls.
  useEffect(() => {
    if (hovered !== null) return;
    const t = setTimeout(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 5000);
    return () => clearTimeout(t);
  }, [index, hovered, maxIndex]);

  return (
    <section
      style={{
        background: "#fff",
        backgroundImage:
          "linear-gradient(rgba(10,10,10,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="left" />
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          style={{ textAlign: "center", marginBottom: 40, position: "relative" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading>
              WHAT MAKES US <span style={{ color: "var(--sp-green-600)" }}>DIFFERENT</span>
            </SectionHeading>
          </motion.div>
          <WavyLine />
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 16,
              color: "#4B5563",
              maxWidth: 720,
              margin: "20px auto 0",
              lineHeight: 1.65,
            }}
          >
            Unlike conventional event or consulting companies, our approach is built around
            creating long-term business ecosystems.
          </motion.p>
        </motion.div>

        <p
          style={{
            fontFamily: "var(--sp-font-sans)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            textAlign: "center",
            margin: "0 0 28px",
          }}
        >
          WE FOCUS ON ENABLING:
        </p>

        <div className="flex items-stretch gap-4" style={{ position: "relative" }}>
          <ArrowButton
            direction="left"
            disabled={false}
            onClick={() => setIndex((i) => (i <= 0 ? maxIndex : i - 1))}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {visible.map((card, i) => {
              const dark = hovered === i;
              return (
                <motion.div
                  key={card.title + index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={{
                    y: -8,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  style={{
                    background: dark ? "var(--sp-navy-900)" : "#fff",
                    border: dark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid #E5E7EB",
                    borderTop: dark
                      ? "3px solid var(--sp-green-500)"
                      : "3px solid transparent",
                    borderRadius: 8,
                    padding: "28px 24px",
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    cursor: "default",
                    boxShadow: dark
                      ? "0 18px 40px rgba(0,0,0,0.20)"
                      : "0 2px 12px rgba(0,0,0,0.06)",
                    transition: CARD_TRANSITION,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 17,
                      fontWeight: 700,
                      color: dark ? "#fff" : "var(--sp-navy-900)",
                      margin: "0 0 10px",
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
                      lineHeight: 1.6,
                      color: dark ? "#9CA3AF" : "#4B5563",
                      margin: 0,
                      transition: TEXT_TRANSITION,
                    }}
                  >
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <ArrowButton
            direction="right"
            disabled={false}
            onClick={() => setIndex((i) => (i >= maxIndex ? 0 : i + 1))}
          />
        </div>

        <Dots count={maxIndex + 1} active={index} onSelect={setIndex} />

        <p
          style={{
            fontFamily: "var(--sp-font-sans)",
            fontSize: 16,
            color: "#4B5563",
            textAlign: "center",
            margin: "32px auto 0",
            maxWidth: 720,
            lineHeight: 1.7,
          }}
        >
          Our goal is not just to organize platforms, but to create environments where businesses
          can explore real growth opportunities.
        </p>
      </Container>
    </section>
  );
}

// ─── 5. Leadership ──────────────────────────────────────────────────────────
function Leadership() {
  return (
    <section
      style={{
        background: "var(--sp-dark-grad-a)",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
        clipPath:
          "polygon(0 var(--sp-slant), 100% 0, 100% 100%, 0 calc(100% - var(--sp-slant)))",
      }}
    >
      <Container>
        {/* Top row: title + description side by side, vertically centered */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          style={{ position: "relative", marginBottom: 48 }}
        >
          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 900,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "#fff",
                margin: 0,
                lineHeight: 1.05,
              }}
            >
              LEADERSHIP
            </h2>
          </motion.div>

          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              background: "transparent",
              borderLeft: "3px solid var(--sp-green-500)",
              paddingLeft: "clamp(20px, 3vw, 28px)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 16,
                lineHeight: 1.75,
                color: "#EBEEF2",
                margin: "0 0 14px",
              }}
            >
              Our leadership team brings together experience across business consulting, strategic
              engagement, ecosystem development, and industry platforms.
            </p>
            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 16,
                lineHeight: 1.75,
                color: "#EBEEF2",
                margin: 0,
              }}
            >
              With a strong focus on collaboration and growth, we continue to work towards
              building impactful opportunities for businesses and stakeholders across sectors.
            </p>
          </motion.div>
        </div>

        {/* Bottom row: horizontal photo strip */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ position: "relative" }}
        >
          {leadershipPhotos.map((src) => (
            <motion.div
              key={src}
              variants={fadeUp}
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                quality={92}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 380px"
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// ─── 6. Initiatives (Beyond Platforms & Consulting) ─────────────────────────
function Initiatives() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = initiatives[index]!;
  const last = initiatives.length - 1;

  // Auto-advance every 6s (slightly slower than the 3-card carousel because
  // each slide has more to read); pause while the card is hovered.
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setIndex((i) => (i >= last ? 0 : i + 1));
    }, 6000);
    return () => clearTimeout(t);
  }, [index, paused, last]);

  return (
    <section
      style={{
        background: "#fff",
        backgroundImage:
          "linear-gradient(rgba(10,10,10,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        padding: "clamp(56px, 8vw, 80px) 0 clamp(64px, 10vw, 100px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container>
        <div style={{ textAlign: "center", marginBottom: 16, position: "relative" }}>
          <SectionHeading>
            BEYOND <span style={{ color: "var(--sp-green-600)" }}>PLATFORMS & CONSULTING</span>
          </SectionHeading>
          <WavyLine />
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 15,
              color: "#4B5563",
              margin: "18px 0 40px",
            }}
          >
            Impact Initiatives & Strategic Engagements
          </p>
        </div>

        <div className="flex items-stretch gap-4" style={{ position: "relative" }}>
          <ArrowButton
            direction="left"
            disabled={false}
            onClick={() => setIndex((i) => (i <= 0 ? last : i - 1))}
          />
          <div style={{ flex: 1, position: "relative", minHeight: 360 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: EASE }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                style={{
                  background: "var(--sp-navy-900)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
                className="grid grid-cols-1 md:grid-cols-2"
              >
                <div style={{ padding: "clamp(22px, 5vw, 36px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "var(--sp-green-400)",
                      margin: "0 0 16px",
                      lineHeight: 1.25,
                    }}
                  >
                    {active.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: "#EBEEF2",
                      margin: "0 0 22px",
                    }}
                  >
                    {active.desc}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 0 10px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Focus Areas
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                    {active.focus.map((f) => (
                      <li
                        key={f}
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: 15,
                          color: "#9CA3AF",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <img
                          src="/icons/check.svg"
                          alt=""
                          aria-hidden="true"
                          style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2 }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-h-55 md:min-h-90" style={{ position: "relative" }}>
                  <Image
                    src={active.photo}
                    alt={active.title}
                    fill
                    quality={92}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <ArrowButton
            direction="right"
            disabled={false}
            onClick={() => setIndex((i) => (i >= last ? 0 : i + 1))}
          />
        </div>

        <Dots count={initiatives.length} active={index} onSelect={setIndex} />
      </Container>
    </section>
  );
}

// ─── Shared controls ────────────────────────────────────────────────────────
function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous" : "Next"}
      // Hidden on mobile — carousels stay usable via auto-rotate + dots.
      className="hidden sm:flex"
      style={{
        flexShrink: 0,
        alignSelf: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid #D1D5DB",
        background: "#fff",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s, background 0.2s",
      }}
    >
      <Icon size={18} color="#1F2937" />
    </button>
  );
}

function Dots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2" style={{ marginTop: 28 }}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          style={{
            width: i === active ? 22 : 8,
            height: 8,
            borderRadius: 4,
            background: i === active ? "var(--sp-green-500)" : "#D1D5DB",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "width 0.25s, background 0.25s",
          }}
        />
      ))}
    </div>
  );
}


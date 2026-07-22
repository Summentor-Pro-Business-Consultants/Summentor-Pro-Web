"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;

// Same landing video as the home hero (compressed 720p loop in /public/videos).
const HERO_VIDEO = "/videos/spro-website.mp4";
const HERO_POSTER = "/images/engagements/msme-consulting-2.jpeg";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// Rendered as a static five-across row; the middle entry carries the green
// highlight, so the order here is also the visual order.
const focusEnablers = [
  {
    icon: "/icons/cooperation.svg",
    title: "Government-industry engagement",
    desc: "Facilitated B2G pathways that turn policy access into real opportunity.",
  },
  {
    icon: "/icons/diagram.svg",
    title: "High-value networking opportunities",
    desc: "Qualified introductions designed around intent, not volume.",
  },
  {
    icon: "/icons/team-leader.svg",
    title: "Meaningful business interactions",
    desc: "Curated environments that move past transactional networking into genuine dialogue.",
  },
  {
    icon: "/icons/handshake.svg",
    title: "Strategic partnerships",
    desc: "Long-term collaborations between businesses, institutions, and ecosystem stakeholders.",
  },
  {
    icon: "/icons/increase.svg",
    title: "Industry dialogue",
    desc: "Structured conversations across MSMEs, enterprises, and policymakers.",
  },
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

// One group per photo slot; each slot crossfades through its own images.
const leadershipGroups = [
  [
    "/images/engagements/meeting-mos-msme.jpeg",
    "/images/engagements/meeting-union-minister-msme.jpeg",
    "/images/engagements/msme-consulting-1.jpeg",
  ],
  [
    "/images/engagements/meeting-defence-minister.jpeg",
    "/images/engagements/meeting-deputy-cm-odisha.jpeg",
    "/images/engagements/msme-consulting-2.jpeg",
  ],
  [
    "/images/engagements/meeting-cm-delhi.jpeg",
    "/images/engagements/textile-women-empowerment-odisha.jpeg",
    "/images/engagements/csr-farmers-odisha-1.jpeg",
  ],
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
  // Autoplaying muted background video (same as the home hero) with a still
  // poster fallback for reduced-motion visitors.
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showStill = mounted && reduceMotion;

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || showStill) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p) p.catch(() => {});
  }, [showStill]);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--sp-dark-grad-a)",
        paddingTop: "clamp(56px, 8vw, 80px)",
        paddingBottom: "clamp(72px, 11vw, 120px)",
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
      }}
    >
      {showStill ? (
        <Image
          src={HERO_POSTER}
          alt=""
          aria-hidden="true"
          fill
          quality={100}
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.5 }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.55,
          }}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}
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
            <SectionHeading
              dark
              style={{
                display: "inline-block",
                fontSize: "clamp(21px, 3.08vw, 37px)",
                fontWeight: 600,
                borderBottom: "3px solid #fff",
                paddingBottom: 10,
              }}
            >
              ABOUT US
            </SectionHeading>
          </motion.div>
          <motion.div variants={fadeUp} style={{ marginTop: 28 }}>
            <PageHeading
              className="whitespace-normal md:whitespace-nowrap"
              style={{ fontSize: "clamp(26px, 4.45vw, 55px)" }}
            >
              <span style={{ display: "block", fontWeight: 600 }}>
                BUILDING BUSINESS ECOSYSTEMS
              </span>
              <span
                style={{
                  background: "var(--sp-green)",
                  color: "#000",
                  display: "inline-block",
                  // Equal top/bottom padding that the clip-path keeps ONLY on
                  // the right. The cut equals the padding, so on the LEFT the
                  // green hugs the text exactly (no visible vertical padding).
                  padding: "13px 8px",
                  marginTop: -6,
                  // Trapezium with vertical, parallel left & right edges. Left
                  // side = text height; moving right the block grows taller
                  // BOTH upward and downward (top edge rises, bottom edge
                  // drops) symmetrically. Text itself is NOT slanted.
                  clipPath: "polygon(0 13px, 100% 0, 100% 100%, 0 calc(100% - 13px))",
                }}
              >
                THAT DRIVE REAL GROWTH.
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
  // Show a short preview by default; the rest is revealed via "Know More".
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_COUNT = 3;
  const paraStyle: CSSProperties = {
    fontFamily: "var(--sp-font-sans)",
    fontSize: "clamp(20px, 2.06vw, 28px)",
    fontWeight: 400,
    lineHeight: 1.35,
    color: "#000",
    margin: "0 0 28px",
    textAlign: "center",
  };
  const paragraphs = [
    "At Summentor Pro, we specialize in strategic consulting, business innovation, government engagement, and ecosystem development.",
    "Founded by Nitika Shahi and Suhaib Ahmed, we have spent over a decade building one of India's emerging platforms focused on meaningful business growth, strategic collaboration, and ecosystem-driven engagement.",
    "Summentor Pro is a strategic business consulting and ecosystem engagement firm committed to enabling impactful collaborations between MSMEs, enterprises, industry leaders, institutions, and ecosystem stakeholders.",
    "Our integrated approach combines strategic consulting, government relations, business platforms, industry networking and MSME & Startup engagement, creating opportunities that encourage real conversations, partnerships, and measurable outcomes.",
    "Over the years, we identified a significant gap in the business ecosystem. Many industry platforms had become increasingly transactional, overly sales-driven, and often lacked long-term value and meaningful engagement.",
    "Summentor Pro was established to change that.",
    "Today, we focus on building platforms and strategic initiatives that encourage genuine business connections, industry collaboration, policy-level engagement, and scalable growth opportunities across sectors.",
    "Through consulting, strategic networking, ecosystem-driven initiatives, and industry-government engagement, we work towards enabling long-term business growth and creating meaningful impact.",
    "At Summentor Pro, we believe meaningful progress happens when the right strategy, ecosystem, and opportunities come together.",
  ];

  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container wide>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            position: "relative",
            textAlign: "center",
          }}
        >
          {paragraphs.slice(0, PREVIEW_COUNT).map((p, i) => (
            <motion.p key={i} variants={fadeUp} style={paraStyle}>
              {p}
            </motion.p>
          ))}

          {/* Revealed paragraphs animate on their own (the parent's whileInView
              stagger has already fired once, so newly-mounted children can't
              rely on inheriting its "show" state). */}
          {expanded &&
            paragraphs.slice(PREVIEW_COUNT).map((p, i) => (
              <motion.p
                key={PREVIEW_COUNT + i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                style={paraStyle}
              >
                {p}
              </motion.p>
            ))}

          <motion.div variants={fadeUp} style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              style={{
                display: "inline-block",
                padding: "18px 74px",
                borderRadius: 999,
                border: "2px solid var(--sp-green)",
                background: "transparent",
                color: "#000",
                cursor: "pointer",
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(19px, 1.88vw, 26px)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--sp-green)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#000";
              }}
            >
              {expanded ? "Show Less" : "Know More"}
            </button>
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
        // Solid dark gradient — no grid overlay.
        backgroundImage: "var(--sp-dark-grad-b)",
        backgroundSize: "cover",
        // Taller band with the heading centred vertically.
        minHeight: "clamp(380px, 42vw, 540px)",
        display: "flex",
        alignItems: "center",
        padding: "clamp(60px, 8vw, 96px) 0",
        position: "relative",
        overflow: "hidden",
        clipPath: "polygon(0 0, 100% var(--sp-slant), 100% 100%, 0 calc(100% - var(--sp-slant)))",
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
            fontSize: "clamp(31px, 4.54vw, 61px)",
            fontWeight: 700,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 1.1,
            textAlign: "center",
            margin: 0,
            position: "relative",
          }}
        >
          WHERE STRATEGY MEETS
          <br />
          <span
            style={{
              color: "var(--sp-green-bright)",
              fontWeight: 900,
              WebkitTextStroke: "1.4px currentColor",
            }}
          >
            IMPACT, AND INNOVATION
          </span>
          <br />
          <span
            style={{
              color: "var(--sp-green-bright)",
              fontWeight: 900,
              WebkitTextStroke: "1.4px currentColor",
            }}
          >
            DRIVES GROWTH.
          </span>
        </motion.h2>
      </Container>
    </section>
  );
}

// ─── 4. What Makes Us Different ─────────────────────────────────────────────
function WhatMakesUsDifferent() {
  // The middle card carries the green highlight.
  const highlight = Math.floor(focusEnablers.length / 2);

  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="left" />
      <Container wide>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          style={{ textAlign: "center", marginBottom: 40, position: "relative" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading>
              WHAT MAKES US{" "}
              <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>
                DIFFERENT
              </span>
            </SectionHeading>
          </motion.div>
          <WavyLine />
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(17px, 2.05vw, 27px)",
              color: "#000",
              maxWidth: 1280,
              margin: "22px auto 0",
              lineHeight: 1.35,
            }}
          >
            Unlike conventional event or consulting companies, our approach is built around creating
            long-term business ecosystems.
          </motion.p>
        </motion.div>

        {/* WE FOCUS ON ENABLING — subheading */}
        <SectionHeading
          style={{
            fontSize: "clamp(24px, 2.83vw, 37px)",
            marginBottom: "clamp(28px, 4vw, 44px)",
          }}
        >
          WE FOCUS ON ENABLING:
        </SectionHeading>

        {/* Static row — all five enablers side by side, middle one highlighted */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            alignItems: "stretch",
            // Slightly narrower than the container so the tiles shrink a touch
            // (the aspect ratio pulls their height down with the width) while
            // the icon and label sizes stay put.
            maxWidth: 1320,
            margin: "0 auto",
          }}
        >
          {focusEnablers.map((it, i) => (
            <motion.div key={it.title} variants={fadeUp}>
              <EnablerCard item={it} highlight={i === highlight} />
            </motion.div>
          ))}
        </motion.div>
      </Container>

      {/* Closing line — its own wide container so it can span wider than the
          row without enlarging the cards. */}
      <Container wide>
        <p
          style={{
            fontFamily: "var(--sp-font-sans)",
            fontSize: "clamp(20px, 2.14vw, 28px)",
            color: "#000",
            textAlign: "center",
            margin: "36px auto 0",
            maxWidth: 1400,
            lineHeight: 1.35,
            position: "relative",
          }}
        >
          Our goal is not just to organize platforms, but to create environments where businesses
          can explore real growth opportunities.
        </p>
      </Container>
    </section>
  );
}

// Single enabler card — the centre card is dark with green text; the two
// side cards are white with a green outline and black text (matches design).
function EnablerCard({
  item,
  highlight,
}: {
  item: (typeof focusEnablers)[number];
  highlight: boolean;
}) {
  const [hover, setHover] = useState(false);
  // Dark by default, green for the highlighted card — and green on hover so the
  // whole row stays interactive. Icon and label are white on both fills.
  const green = highlight || hover;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%",
        aspectRatio: "1.12 / 1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "clamp(14px, 1.8vw, 26px)",
        padding: "clamp(16px, 2vw, 26px) clamp(10px, 1.2vw, 18px)",
        borderRadius: 0,
        background: green ? "var(--sp-green)" : "var(--sp-surface-dark)",
        transition: "background 0.3s ease",
      }}
    >
      {/* The SVG is used as a CSS mask so its silhouette takes the icon colour. */}
      <span
        aria-hidden="true"
        style={{
          width: "clamp(40px, 4.2vw, 62px)",
          height: "clamp(40px, 4.2vw, 62px)",
          flexShrink: 0,
          backgroundColor: "#fff",
          WebkitMaskImage: `url(${item.icon})`,
          maskImage: `url(${item.icon})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
      <span
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(15px, 1.62vw, 23px)",
          fontWeight: 500,
          lineHeight: 1.2,
          color: "#fff",
        }}
      >
        {item.title}
      </span>
    </div>
  );
}

// ─── 5. Leadership ──────────────────────────────────────────────────────────
function Leadership() {
  // The photo strip is rendered OUTSIDE the clipped dark section and pulled up
  // so the section's slanted bottom edge crosses through the photos — they
  // straddle the dark → light boundary (matches the design).
  const OVERLAP = 150;

  return (
    <>
      <section
        style={{
          background: "var(--sp-dark-grad-a)",
          // Extra bottom space hosts the upper half of the straddling photos.
          padding: "clamp(56px, 8vw, 80px) 0 clamp(160px, 18vw, 230px)",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          // Top slant unchanged; bottom slant now runs right-up → left-down.
          clipPath: "polygon(0 var(--sp-slant), 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
        }}
      >
        <Container wide>
          {/* Top row: title + description side by side, vertically centered */}
          <div
            className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-10 items-center"
            style={{ position: "relative" }}
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
                  fontSize: "clamp(34px, 4.71vw, 57px)",
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: "#fff",
                  margin: 0,
                  lineHeight: 1.0,
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
                borderLeft: "3px solid var(--sp-green)",
                paddingLeft: "clamp(20px, 3vw, 28px)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(17px, 1.79vw, 24px)",
                  lineHeight: 1.3,
                  color: "#fff",
                  margin: "0 0 14px",
                }}
              >
                Our leadership team brings together experience across business consulting, strategic
                engagement, ecosystem development, and industry platforms.
              </p>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(17px, 1.79vw, 24px)",
                  lineHeight: 1.3,
                  color: "#fff",
                  margin: 0,
                }}
              >
                With a strong focus on collaboration and growth, we continue to work towards
                building impactful opportunities for businesses and stakeholders across sectors.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Photo strip — rendered outside the clip and pulled up so the dark
          section's slanted bottom edge cuts through the middle of the photos. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        style={{ position: "relative", zIndex: 2, marginTop: -OVERLAP }}
      >
        <Container wide>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {leadershipGroups.map((photos, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  position: "relative",
                  aspectRatio: "4 / 3",
                  borderRadius: 0,
                  overflow: "hidden",
                  boxShadow: "0 24px 48px -18px rgba(0,0,0,0.55)",
                }}
              >
                {/* Slightly different intervals so the three slots don't all
                    crossfade at the same instant. */}
                <LeadershipPhoto photos={photos} interval={2600 + i * 500} />
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.div>
    </>
  );
}

// A single Leadership photo slot that auto-crossfades through its group of
// images. Fills its (relatively positioned) parent.
function LeadershipPhoto({ photos, interval }: { photos: string[]; interval: number }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || photos.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, interval);
    return () => clearInterval(id);
  }, [reduceMotion, photos.length, interval]);

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Image
          src={photos[index]!}
          alt=""
          fill
          quality={100}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 460px"
          style={{ objectFit: "cover" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

// ─── 6. Initiatives (Beyond Platforms & Consulting) ─────────────────────────
function Initiatives() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const n = initiatives.length;

  // Measure the carousel viewport so the active card sits at the left edge
  // while the next card peeks in (blurred) on the right.
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1100);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setVw(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Three concatenated copies with `pos` in the middle copy → always a card to
  // peek on the right. Silently snap back a copy-length (transition off) when it
  // drifts into a clone, for a seamless infinite loop.
  const [pos, setPos] = useState(n);
  const [animate, setAnimate] = useState(true);

  const prev = () => {
    setAnimate(true);
    setPos((p) => p - 1);
  };
  const next = () => {
    setAnimate(true);
    setPos((p) => p + 1);
  };
  const goTo = (i: number) => {
    setAnimate(true);
    setPos(n + (((i % n) + n) % n));
  };

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(() => {
      setAnimate(true);
      setPos((p) => p + 1);
    }, 3800);
    return () => clearInterval(t);
  }, [paused, reduceMotion]);

  useEffect(() => {
    if (pos >= n && pos < 2 * n) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPos((p) => (p >= 2 * n ? p - n : p + n));
    }, 580);
    return () => clearTimeout(t);
  }, [pos, n]);

  useEffect(() => {
    if (animate) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [animate]);

  const GAP = 24;
  const cardW = Math.min(vw * 0.75, 1080);
  const translate = -pos * (cardW + GAP);
  const cards = [...initiatives, ...initiatives, ...initiatives];

  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(56px, 8vw, 80px) 0 clamp(64px, 10vw, 100px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container wide>
        <div style={{ textAlign: "center", marginBottom: 16, position: "relative" }}>
          <SectionHeading>
            BEYOND{" "}
            <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>
              PLATFORMS &amp; CONSULTING
            </span>
          </SectionHeading>
          <WavyLine />
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(20px, 2.31vw, 29px)",
              color: "#000",
              margin: "18px 0 40px",
            }}
          >
            Impact Initiatives &amp; Strategic Engagements
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <div ref={viewportRef} style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                gap: GAP,
                alignItems: "stretch",
                transform: `translateX(${translate}px)`,
                transition: animate ? "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
              }}
            >
              {cards.map((it, i) => {
                const isActive = i === pos;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    aria-hidden={!isActive}
                    style={{
                      flexShrink: 0,
                      width: cardW,
                      background: "var(--sp-navy-900)",
                      borderRadius: 0,
                      padding: "clamp(12px, 1.8vw, 22px) clamp(26px, 3.6vw, 44px)",
                      // The non-active cards (e.g. the next one peeking in on
                      // the right) render blurred and dimmed.
                      filter: isActive ? "none" : "blur(5px)",
                      opacity: isActive ? 1 : 0.5,
                      transition: animate ? "filter 0.45s ease, opacity 0.45s ease" : "none",
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch"
                  >
                    {/* Left: title + description */}
                    <div
                      style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(25px, 2.91vw, 37px)",
                          fontWeight: 700,
                          color: "var(--sp-green-bright)",
                          margin: "0 0 12px",
                          lineHeight: 1.15,
                        }}
                      >
                        {it.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(14px, 1.5vw, 19px)",
                          lineHeight: 1.3,
                          color: "#fff",
                          margin: 0,
                        }}
                      >
                        {it.desc}
                      </p>
                    </div>

                    {/* Right: Focus Areas, separated by a vertical divider */}
                    <div
                      style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        // Equal top/bottom margins trim the divider a little
                        // (same amount on every card) while keeping it centred.
                        marginTop: "clamp(8px, 1.6vw, 20px)",
                        marginBottom: "clamp(8px, 1.6vw, 20px)",
                        borderLeft: "3px solid rgba(255,255,255,0.85)",
                        paddingLeft: "clamp(20px, 3vw, 44px)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(17px, 1.79vw, 23px)",
                          fontWeight: 500,
                          color: "#fff",
                          margin: "0 0 14px",
                          letterSpacing: "0.01em",
                        }}
                      >
                        Focus Areas
                      </p>
                      <ul
                        style={{
                          margin: 0,
                          padding: 0,
                          listStyle: "none",
                          display: "grid",
                          gap: 7,
                        }}
                      >
                        {it.focus.map((f) => (
                          <li
                            key={f}
                            style={{
                              fontFamily: "var(--sp-font-sans)",
                              fontSize: "clamp(14px, 1.5vw, 19px)",
                              fontWeight: 400,
                              lineHeight: 1.2,
                              color: "#fff",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 12,
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "var(--sp-green)",
                                flexShrink: 0,
                                marginTop: "0.6em",
                              }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Arrows straddle the active card's left & right edges. */}
          <GreenArrow direction="left" x={0} onClick={prev} />
          <GreenArrow direction="right" x={cardW} onClick={next} />
        </div>

        <Dots count={n} active={((pos % n) + n) % n} onSelect={goTo} />
      </Container>
    </section>
  );
}

// Solid green circular arrow — absolutely positioned so it half-overlaps a
// card edge (the `x` is the horizontal centre point). Uses the full arrow
// glyph (→) to match the design.
function GreenArrow({
  direction,
  onClick,
  x,
  size = "clamp(62px, 6.6vw, 82px)",
  iconSize = 32,
}: {
  direction: "left" | "right";
  onClick: () => void;
  x: number | string;
  size?: string;
  iconSize?: number;
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="hidden sm:flex"
      style={{
        position: "absolute",
        left: x,
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 3,
        width: size,
        height: size,
        borderRadius: "50%",
        border: "none",
        background: "var(--sp-green)",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 10px 24px -8px rgba(5,161,113,0.55)",
        transition: "background 0.2s ease",
      }}
    >
      <Icon size={iconSize} color="#000" strokeWidth={2.4} />
    </button>
  );
}

// ─── Shared controls ────────────────────────────────────────────────────────
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
            width: i === active ? 30 : 24,
            height: 4,
            borderRadius: 2,
            background: i === active ? "var(--sp-green)" : "#334155",
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

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  { title: "High-value networking opportunities", desc: "Qualified introductions designed around intent, not volume." },
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
      {/* Drop the global body grid on this route so it doesn't show through
          the slanted wedges around the dark sections. Restored automatically
          when navigating away (this style unmounts with the page). */}
      <style>{`body { background-image: none !important; }`}</style>
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
          "polygon(0 0, 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
      }}
    >
      <Image
        src="/images/engagements/msme-consulting-2.jpeg"
        alt=""
        aria-hidden="true"
        fill
        quality={100}
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
            <SectionHeading
              dark
              style={{
                display: "inline-block",
                fontSize: "clamp(25px, 3.6vw, 44px)",
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
              style={{ fontSize: "clamp(30px, 5.2vw, 64px)" }}
            >
              <span style={{ display: "block", fontWeight: 600 }}>
                BUILDING BUSINESS ECOSYSTEMS
              </span>
              <span
                style={{
                  background: "#058961",
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
                  clipPath:
                    "polygon(0 13px, 100% 0, 100% 100%, 0 calc(100% - 13px))",
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
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(23px, 2.4vw, 33px)",
                fontWeight: 400,
                lineHeight: 1.45,
                color: "#000",
                margin: "0 0 28px",
                textAlign: "center",
              }}
            >
              {p}
            </motion.p>
          ))}
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
        clipPath:
          "polygon(0 0, 100% var(--sp-slant), 100% 100%, 0 calc(100% - var(--sp-slant)))",
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
            fontSize: "clamp(40px, 6vw, 80px)",
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
          <span style={{ color: "#17d99d" }}>IMPACT, AND INNOVATION</span>
          <br />
          <span style={{ color: "#17d99d" }}>DRIVES GROWTH.</span>
        </motion.h2>
      </Container>
    </section>
  );
}

// ─── 4. What Makes Us Different ─────────────────────────────────────────────
function WhatMakesUsDifferent() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(1);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const n = focusEnablers.length;
  const prev = () => {
    setDir(-1);
    setActive((a) => (a - 1 + n) % n);
  };
  const next = () => {
    setDir(1);
    setActive((a) => (a + 1) % n);
  };
  const goTo = (i: number) => {
    setDir(i >= active ? 1 : -1);
    setActive(((i % n) + n) % n);
  };

  // Auto-advance every 5s; paused on hover, disabled under reduced-motion.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const t = setInterval(() => {
      setDir(1);
      setActive((a) => (a + 1) % n);
    }, 5000);
    return () => clearInterval(t);
  }, [reduceMotion, paused, n]);

  // Three cards on screen: previous, active (centre), next.
  const trio = [(active - 1 + n) % n, active, (active + 1) % n];

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
              WHAT MAKES US{" "}
              <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>DIFFERENT</span>
            </SectionHeading>
          </motion.div>
          <WavyLine />
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 2.9vw, 38px)",
              color: "#000",
              maxWidth: 1280,
              margin: "22px auto 0",
              lineHeight: 1.45,
            }}
          >
            Unlike conventional event or consulting companies, our approach is built around
            creating long-term business ecosystems.
          </motion.p>
        </motion.div>

        {/* WE FOCUS ON ENABLING — subheading */}
        <SectionHeading
          style={{
            fontSize: "clamp(28px, 3.3vw, 44px)",
            marginBottom: "clamp(28px, 4vw, 44px)",
          }}
        >
          WE FOCUS ON ENABLING:
        </SectionHeading>

        {/* Carousel: prev arrow · three cards · next arrow */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1.6vw, 22px)" }}
        >
          <ArrowButton direction="left" disabled={false} onClick={prev} />

          <div style={{ flex: 1, overflow: "hidden" }}>
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={active}
                custom={dir}
                initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "clamp(14px, 2vw, 28px)",
                  alignItems: "center",
                }}
              >
                {trio.map((idx, pos) => (
                  <EnablerCard
                    key={idx}
                    label={focusEnablers[idx].title}
                    center={pos === 1}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <ArrowButton direction="right" disabled={false} onClick={next} />
        </div>

        <Dots count={n} active={active} onSelect={goTo} />
      </Container>

      {/* Closing line — its own wide container so it can span wider than the
          carousel without enlarging the cards. */}
      <Container wide>
        <p
          style={{
            fontFamily: "var(--sp-font-sans)",
            fontSize: "clamp(23px, 2.5vw, 33px)",
            color: "#000",
            textAlign: "center",
            margin: "36px auto 0",
            maxWidth: 1400,
            lineHeight: 1.45,
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
function EnablerCard({ label, center }: { label: string; center: boolean }) {
  return (
    <div
      style={{
        aspectRatio: "1.5 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px 22px",
        borderRadius: 0,
        background: center ? "#252525" : "#fff",
        border: center
          ? "2px solid var(--sp-green-600)"
          : "2px solid var(--sp-green-500)",
        transform: center ? "scale(1.05)" : "scale(1)",
        boxShadow: center
          ? "0 24px 48px -22px rgba(0,0,0,0.45)"
          : "0 6px 18px -10px rgba(0,0,0,0.12)",
        transition: "background 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      <span
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(24px, 2.7vw, 35px)",
          fontWeight: 500,
          lineHeight: 1.3,
          color: center ? "var(--sp-green-400)" : "#000",
          transition: "color 0.4s ease",
        }}
      >
        {label}
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
        clipPath:
          "polygon(0 var(--sp-slant), 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
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
                fontSize: "clamp(40px, 5.5vw, 66px)",
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
                fontSize: "clamp(20px, 2.1vw, 28px)",
                lineHeight: 1.4,
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
                fontSize: "clamp(20px, 2.1vw, 28px)",
                lineHeight: 1.4,
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
            {leadershipPhotos.map((src) => (
              <motion.div
                key={src}
                variants={fadeUp}
                style={{
                  position: "relative",
                  aspectRatio: "4 / 3",
                  borderRadius: 0,
                  overflow: "hidden",
                  boxShadow: "0 24px 48px -18px rgba(0,0,0,0.55)",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  quality={100}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 460px"
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.div>
    </>
  );
}

// ─── 6. Initiatives (Beyond Platforms & Consulting) ─────────────────────────
function Initiatives() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = initiatives.length - 1;

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

  const GAP = 24;
  const cardW = Math.min(vw * 0.75, 1080);
  const translate = -index * (cardW + GAP);

  // Auto-advance every 6s; pause while the card is hovered, and off entirely
  // for reduced-motion visitors (manual arrows/dots remain).
  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setTimeout(() => {
      setIndex((i) => (i >= last ? 0 : i + 1));
    }, 6000);
    return () => clearTimeout(t);
  }, [index, paused, last, reduceMotion]);

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
            <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>PLATFORMS &amp; CONSULTING</span>
          </SectionHeading>
          <WavyLine />
          <p
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 2.7vw, 34px)",
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
                transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {initiatives.map((it, i) => {
                const isActive = i === index;
                return (
                  <div
                    key={it.title}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    aria-hidden={!isActive}
                    style={{
                      flexShrink: 0,
                      width: cardW,
                      background: "var(--sp-navy-900)",
                      borderRadius: 0,
                      padding: "clamp(20px, 2.8vw, 32px) clamp(28px, 4vw, 48px)",
                      // The non-active cards (e.g. the next one peeking in on
                      // the right) render blurred and dimmed.
                      filter: isActive ? "none" : "blur(5px)",
                      opacity: isActive ? 1 : 0.5,
                      transition: "filter 0.45s ease, opacity 0.45s ease",
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch"
                  >
                    {/* Left: title + description */}
                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <h3
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(26px, 3vw, 38px)",
                          fontWeight: 700,
                          color: "var(--sp-green-400)",
                          margin: "0 0 18px",
                          lineHeight: 1.22,
                        }}
                      >
                        {it.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(16px, 1.75vw, 21px)",
                          lineHeight: 1.4,
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
                        marginTop: "clamp(12px, 2.5vw, 32px)",
                        marginBottom: "clamp(12px, 2.5vw, 32px)",
                        borderLeft: "3px solid rgba(255,255,255,0.85)",
                        paddingLeft: "clamp(20px, 3vw, 44px)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(20px, 2.1vw, 27px)",
                          fontWeight: 500,
                          color: "#fff",
                          margin: "0 0 14px",
                          letterSpacing: "0.01em",
                        }}
                      >
                        Focus Areas
                      </p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 7 }}>
                        {it.focus.map((f) => (
                          <li
                            key={f}
                            style={{
                              fontFamily: "var(--sp-font-sans)",
                              fontSize: "clamp(16px, 1.75vw, 21px)",
                              fontWeight: 400,
                              lineHeight: 1.3,
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
                                background: "var(--sp-green-400)",
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
          <GreenArrow direction="left" x={0} onClick={() => setIndex((i) => (i <= 0 ? last : i - 1))} />
          <GreenArrow direction="right" x={cardW} onClick={() => setIndex((i) => (i >= last ? 0 : i + 1))} />
        </div>

        <Dots count={initiatives.length} active={index} onSelect={setIndex} />
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
}: {
  direction: "left" | "right";
  onClick: () => void;
  x: number | string;
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
        width: "clamp(54px, 5.6vw, 68px)",
        height: "clamp(54px, 5.6vw, 68px)",
        borderRadius: "50%",
        border: "none",
        background: "var(--sp-green-500)",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 10px 24px -8px rgba(5,161,113,0.55)",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--sp-green-600)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--sp-green-500)")}
    >
      <Icon size={26} color="#000" strokeWidth={2.25} />
    </button>
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
        border: "1px solid #000",
        background: "#fff",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s, background 0.2s",
      }}
    >
      <Icon size={26} color="#000" strokeWidth={2.5} />
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
            width: i === active ? 30 : 24,
            height: 4,
            borderRadius: 2,
            background: i === active ? "var(--sp-green-500)" : "#334155",
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


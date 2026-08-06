"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import HeroVideoBackground from "@/components/ui/HeroVideoBackground";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

// ─── Shared design system (matches About + Solutions) ───────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const HOVER_CSS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CARD_TRANSITION = `background 0.45s ${HOVER_CSS_EASE}, border-color 0.45s ${HOVER_CSS_EASE}, box-shadow 0.45s ${HOVER_CSS_EASE}`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─── Data ───────────────────────────────────────────────────────────────────
const designedTo = [
  {
    icon: "/icons/cooperation.svg",
    title: "Enable strategic networking",
    desc: "Curated business introductions across MSMEs, enterprises, and policymakers.",
  },
  {
    icon: "/icons/puzzle.svg",
    title: "Encourage industry dialogue",
    desc: "Structured conversations that turn into long-term partnerships.",
  },
  {
    icon: "/icons/diagram.svg",
    title: "Facilitate business visibility",
    desc: "Help businesses position themselves in the right rooms with the right audiences.",
  },
  {
    icon: "/icons/increase.svg",
    title: "Support MSME & startup growth",
    desc: "Platforms tailored to founders building from the ground up.",
  },
  {
    icon: "/icons/team-leader.svg",
    title: "Create meaningful engagement",
    desc: "Genuine exchange between businesses, institutions, and ecosystem stakeholders.",
  },
];

const featuredPlatforms = [
  {
    title: "MSME & Startup Innovation Summit",
    desc: "A flagship platform focused on innovation, entrepreneurship, collaboration, and MSME growth.",
    bringsTogether: [
      "Founders & entrepreneurs",
      "Industry leaders",
      "MSMEs & startups",
      "Policymakers & ecosystem enablers",
      "Solution providers & business stakeholders",
    ],
  },
  {
    title: "Women Empowerment & Leadership Initiatives",
    desc: "Platforms focused on encouraging leadership, inclusion, entrepreneurship, and growth opportunities for women professionals and business leaders.",
    bringsTogether: [
      "Networking opportunities",
      "Leadership conversations",
      "Ecosystem support",
      "Collaborative growth platforms",
    ],
  },
  {
    title: "Global Smart Build Summit",
    desc: "A leading industry platform for innovation, collaboration, and business engagement within the real estate and construction ecosystem.",
    bringsTogether: [
      "Developers & architects",
      "PMC consultants & interior designers",
      "Infrastructure stakeholders",
      "Solution providers",
      "Innovation-led collaboration",
    ],
  },
  {
    title: "Rural & Urban Development Excellence Awards",
    desc: "A recognition platform celebrating organizations and individuals contributing to innovation, sustainability, and impactful development across rural and urban ecosystems.",
    bringsTogether: [
      "Sustainable development",
      "Community impact",
      "Innovation-led growth",
      "Infrastructure & social development",
      "Leadership & excellence",
    ],
  },
];

const highlightPhotos = [
  "/images/groups/highlights/gov-industry-participation.jpeg",
  "/images/groups/highlights/meeting-cm-delhi.jpeg",
  "/images/groups/highlights/msme-4.jpg",
  "/images/groups/highlights/msme-consulting-2.jpeg",
  "/images/groups/highlights/multu-sector-industry-platforms.jpeg",
];

// ─── Page ───────────────────────────────────────────────────────────────────
export default function PlatformsPage() {
  return (
    <>
      <Hero />
      <WhyOurPlatformsMatter />
      <FeaturedPlatforms />
      <PartnerCTA />
      <PlatformHighlights />
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
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
      }}
    >
      <HeroVideoBackground
        src="/videos/platforms.mp4"
        poster="/images/video-posters/platforms.jpg"
        opacity={0.8}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.55) 58%, rgba(8,8,8,0.9) 88%, #080808 100%)",
        }}
      />

      <Container wide>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          style={{ position: "relative", textAlign: "center", maxWidth: 1280, margin: "0 auto" }}
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
              PLATFORMS
            </SectionHeading>
          </motion.div>

          <motion.div variants={fadeUp} style={{ margin: "28px 0 22px" }}>
            <PageHeading style={{ fontSize: "clamp(26px, 4.45vw, 55px)" }}>
              <span style={{ display: "block", fontWeight: 600 }}>BUSINESS PLATFORMS DESIGNED</span>
              <span
                style={{
                  background: "var(--sp-green)",
                  color: "#000",
                  display: "inline-block",
                  padding: "13px 8px",
                  marginTop: -6,
                  // Trapezium: vertical, parallel side edges; taller on the
                  // right (same as the About / Solutions headings).
                  clipPath: "polygon(0 13px, 100% 0, 100% 100%, 0 calc(100% - 13px))",
                }}
              >
                AROUND COLLABORATION, GROWTH &amp;
              </span>
              <span style={{ display: "block", fontWeight: 600, marginTop: 8 }}>
                INDUSTRY ENGAGEMENT
              </span>
            </PageHeading>
          </motion.div>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(19px, 2.06vw, 27px)",
              lineHeight: 1.35,
              color: "#fff",
              maxWidth: 1040,
              margin: "0 auto",
            }}
          >
            Our platforms bring together founders, MSMEs, enterprises, policymakers, investors, and
            ecosystem stakeholders to encourage meaningful conversations, strategic partnerships,
            and long-term business opportunities.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── 2. Why Our Platforms Matter ────────────────────────────────────────────
// Static composition: four white cards in the corners with one tall dark
// green-accent card standing in the centre. `designedTo[0]` is the centre.
function WhyOurPlatformsMatter() {
  const centre = designedTo[0]!;
  const left = [designedTo[1]!, designedTo[2]!];
  const right = [designedTo[3]!, designedTo[4]!];

  // Exactly one card carries the dark treatment at a time: whichever is hovered,
  // falling back to the centre card. Hover state lives here rather than in the
  // card because a card can't know that a sibling is hovered.
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = hovered ?? 0;

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
              WHY OUR{" "}
              <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>
                PLATFORMS MATTER
              </span>
            </SectionHeading>
          </motion.div>
          <WavyLine />
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(16px, 1.71vw, 20px)",
              color: "#000",
              maxWidth: 860,
              margin: "22px auto 0",
              lineHeight: 1.35,
            }}
          >
            At Summentor Pro, we believe impactful business ecosystems are built through the right
            conversations, collaborations, and opportunities.
          </motion.p>
        </motion.div>

        {/* Subheading — sentence case (override the heading's uppercase) */}
        <SectionHeading
          style={{
            fontSize: "clamp(20px, 2.48vw, 33px)",
            textTransform: "none",
            marginBottom: "clamp(28px, 4vw, 44px)",
          }}
        >
          Our platforms are designed to:
        </SectionHeading>

        {/* Two white cards | tall dark centre card | two white cards. On mobile
            the columns collapse and the five cards simply stack. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            gap: "clamp(14px, 1.6vw, 20px)",
            maxWidth: 1160,
            margin: "0 auto",
            alignItems: "stretch",
          }}
        >
          {/* Left column */}
          <div className="md:col-start-1 md:row-start-1">
            <PlatformCard
              item={left[0]!}
              active={activeIndex === 1}
              onHover={setHovered}
              index={1}
            />
          </div>
          <div className="md:col-start-1 md:row-start-2">
            <PlatformCard
              item={left[1]!}
              active={activeIndex === 2}
              onHover={setHovered}
              index={2}
            />
          </div>

          {/* Centre — tall, spans both rows; dark by default */}
          <div className="md:col-start-2 md:row-start-1 md:row-span-2">
            <PlatformCard
              item={centre}
              center
              active={activeIndex === 0}
              onHover={setHovered}
              index={0}
            />
          </div>

          {/* Right column */}
          <div className="md:col-start-3 md:row-start-1">
            <PlatformCard
              item={right[0]!}
              active={activeIndex === 3}
              onHover={setHovered}
              index={3}
            />
          </div>
          <div className="md:col-start-3 md:row-start-2">
            <PlatformCard
              item={right[1]!}
              active={activeIndex === 4}
              onHover={setHovered}
              index={4}
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// Single "designed to" card.
//
// Two independent concerns, deliberately kept apart:
//   `center` — LAYOUT only. The middle card is tall (spans both rows) and stacks
//              its icon above the title; the others are short and horizontal.
//              Fixed per position, so hovering never reflows the grid.
//   `active` — the DARK treatment (dark fill, green border, green icon + title).
//              Follows the hovered card, defaulting to the centre one.
function PlatformCard({
  item,
  center,
  active,
  index,
  onHover,
}: {
  item: (typeof designedTo)[number];
  center?: boolean;
  active: boolean;
  index: number;
  onHover: (i: number | null) => void;
}) {
  const icon = (
    <span
      aria-hidden="true"
      style={{
        width: center ? "clamp(56px, 5vw, 78px)" : "clamp(42px, 3.6vw, 52px)",
        height: center ? "clamp(56px, 5vw, 78px)" : "clamp(42px, 3.6vw, 52px)",
        flexShrink: 0,
        backgroundColor: active ? "var(--sp-green)" : "#1a1a1a",
        WebkitMaskImage: `url(${item.icon})`,
        maskImage: `url(${item.icon})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        transition: "background-color 0.3s ease",
      }}
    />
  );

  const title = (
    <h3
      style={{
        fontFamily: "var(--sp-font-sans)",
        fontSize: center ? "clamp(22px, 2.3vw, 30px)" : "clamp(17px, 1.8vw, 23px)",
        fontWeight: 500,
        lineHeight: 1.2,
        textAlign: center ? "center" : "left",
        color: active ? "var(--sp-green-bright)" : "#000",
        margin: 0,
        transition: "color 0.3s ease",
      }}
    >
      {item.title}
    </h3>
  );

  return (
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: center ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: center ? "clamp(16px, 2vw, 26px)" : "clamp(14px, 1.8vw, 22px)",
        padding: center
          ? "clamp(28px, 3.4vw, 46px) clamp(20px, 2.4vw, 32px)"
          : "clamp(22px, 2.4vw, 32px) clamp(22px, 2.4vw, 30px)",
        borderRadius: 0,
        // Border width is constant so the card never shifts as it darkens —
        // only the colour changes.
        background: active ? "var(--sp-surface-dark)" : "#fff",
        border: active ? "2px solid var(--sp-green)" : "2px solid #E5E7EB",
        boxShadow: active
          ? "0 24px 48px -22px rgba(0,0,0,0.45)"
          : "0 6px 18px -10px rgba(0,0,0,0.10)",
        cursor: "default",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {icon}
      {title}
    </div>
  );
}

// ─── 3. Featured Platforms ──────────────────────────────────────────────────
function FeaturedPlatforms() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const n = featuredPlatforms.length;

  // Measure the viewport so the active card sits at the left edge while the
  // next card peeks in (blurred) on the right.
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
  const cardW = Math.min(vw * 0.66, 960);
  const translate = -pos * (cardW + GAP);
  const cards = [...featuredPlatforms, ...featuredPlatforms, ...featuredPlatforms];

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
      <Container style={{ maxWidth: 1340 }}>
        <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
          <SectionHeading>
            FEATURED{" "}
            <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>PLATFORMS</span>
          </SectionHeading>
          <WavyLine />
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
              {cards.map((p, i) => {
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
                      overflow: "hidden",
                      // The next card peeking in on the right renders blurred.
                      filter: isActive ? "none" : "blur(5px)",
                      opacity: isActive ? 1 : 0.5,
                      transition: animate ? "filter 0.45s ease, opacity 0.45s ease" : "none",
                    }}
                  >
                    {/* Content */}
                    <div style={{ padding: "clamp(16px, 2.2vw, 28px) clamp(30px, 4vw, 50px)" }}>
                      <h3
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(20px, 2.33vw, 30px)",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.01em",
                          color: "#fff",
                          margin: "0 0 8px",
                          lineHeight: 1.13,
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(14px, 1.5vw, 19px)",
                          lineHeight: 1.35,
                          color: "#fff",
                          margin: "0 0 14px",
                        }}
                      >
                        {p.desc}
                      </p>
                      <div
                        style={{
                          height: 2,
                          background: "rgba(255,255,255,0.85)",
                          margin: "0 0 12px",
                        }}
                      />
                      <p
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(14px, 1.5vw, 19px)",
                          fontWeight: 700,
                          color: "#fff",
                          margin: "0 0 8px",
                        }}
                      >
                        The platform brings together:
                      </p>
                      <ul
                        style={{
                          margin: "0 0 16px",
                          padding: 0,
                          listStyle: "none",
                          display: "grid",
                          gap: 5,
                        }}
                      >
                        {p.bringsTogether.map((item) => (
                          <li
                            key={item}
                            style={{
                              fontFamily: "var(--sp-font-sans)",
                              fontSize: "clamp(14px, 1.5vw, 19px)",
                              color: "#fff",
                              lineHeight: 1.3,
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/contact"
                        style={{
                          display: "inline-block",
                          padding: "8px 44px",
                          borderRadius: 999,
                          border: "2px solid var(--sp-green)",
                          color: "#fff",
                          textDecoration: "none",
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: 18.6,
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          transition:
                            "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "var(--sp-green)";
                          (e.currentTarget as HTMLElement).style.color = "#000";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "#fff";
                        }}
                      >
                        Know More
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Green arrows straddle the active card's left & right edges. */}
          <GreenArrow direction="left" x={0} onClick={prev} />
          <GreenArrow direction="right" x={cardW} onClick={next} />
        </div>

        <Dots count={n} active={((pos % n) + n) % n} onSelect={goTo} />
      </Container>
    </section>
  );
}

// ─── 4. Partner CTA ─────────────────────────────────────────────────────────
function PartnerCTA() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(40px, 6vw, 60px) 0 clamp(64px, 10vw, 100px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container wide>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          style={{ textAlign: "center", position: "relative" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading>
              <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>
                PARTNER WITH
              </span>{" "}
              OUR PLATFORMS
            </SectionHeading>
          </motion.div>
          <WavyLine />

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(17px, 1.85vw, 24px)",
              color: "#000",
              maxWidth: 1340,
              margin: "22px auto 40px",
              lineHeight: 1.4,
            }}
          >
            Whether you are looking to strengthen your market presence, engage with industry
            stakeholders, build visibility, or explore strategic partnerships, our platforms are
            designed to create meaningful opportunities and long-term value.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <PartnerPill href="/contact" filled>
              Become a Partner
            </PartnerPill>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function PartnerPill({
  href,
  filled,
  children,
}: {
  href: string;
  filled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        padding: "15px 38px",
        borderRadius: 999,
        border: filled ? "2px solid var(--sp-green)" : "1.5px solid #1f2937",
        background: filled ? "var(--sp-green)" : "transparent",
        color: filled ? "#fff" : "#000",
        textDecoration: "none",
        fontFamily: "var(--sp-font-sans)",
        fontSize: 24,
        fontWeight: 600,
        transition: CARD_TRANSITION,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--sp-green)";
        el.style.color = "#fff";
        el.style.borderColor = "var(--sp-green)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = filled ? "var(--sp-green)" : "transparent";
        el.style.color = filled ? "#fff" : "#000";
        el.style.borderColor = filled ? "var(--sp-green)" : "#1f2937";
      }}
    >
      {children}
    </Link>
  );
}

// ─── 6. Platform Highlights (B&W photo carousel) ────────────────────────────
function PlatformHighlights() {
  const reduceMotion = useReducedMotion();
  const n = highlightPhotos.length;

  // Measure the viewport so the active photo sits at the left while the next
  // photo peeks (in B&W) on the right.
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

  // Three concatenated copies with `pos` in the middle copy → always a photo to
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
    if (reduceMotion) return;
    const t = setInterval(() => {
      setAnimate(true);
      setPos((p) => p + 1);
    }, 3600);
    return () => clearInterval(t);
  }, [reduceMotion]);

  useEffect(() => {
    if (pos >= n && pos < 2 * n) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPos((p) => (p >= 2 * n ? p - n : p + n));
    }, 340);
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

  const GAP = 20;
  // Card width sized off the strip's actual width so 2 full + 1 half peek fit
  // inside the 1320px container regardless of viewport.
  const cardW = Math.min(vw * 0.42, 560);
  const translate = -pos * (cardW + GAP);
  const photos = [...highlightPhotos, ...highlightPhotos, ...highlightPhotos];

  // The photo row is rendered OUTSIDE the dark section and pulled up so the
  // section's slanted bottom cuts through the middle of the (full) photos.
  // How far the photo row is pulled up into the dark band above it. Larger =
  // more of each photo sits inside the black, straddling its slanted edge.
  const OVERLAP = 195;

  return (
    <>
      <section
        style={{
          background: "var(--sp-dark-grad-b)",
          // Bottom space hosts the upper half of the straddling photos.
          // Bottom padding sets both the height of the dark band and the gap
          // under the heading: the photo row is pulled back up by OVERLAP, so
          // the visible gap is (padding - OVERLAP).
          padding: "clamp(56px, 8vw, 80px) 0 clamp(250px, 22vw, 330px)",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          // Top slant + bottom slant (right-up → left-down).
          clipPath: "polygon(0 var(--sp-slant), 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
        }}
      >
        <Container>
          <div style={{ textAlign: "center", position: "relative" }}>
            <SectionHeading dark>
              PLATFORM{" "}
              <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>
                HIGHLIGHTS
              </span>
            </SectionHeading>
            <WavyLine />
          </div>
        </Container>
      </section>

      {/* Photo carousel straddling the section's bottom slant. Active photo is
          full + colour; the next one peeks on the right in black & white. The
          bottom padding gives the bar indicators clear white space below. */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: -OVERLAP,
          paddingBottom: "clamp(56px, 8vw, 100px)",
        }}
      >
        <Container style={{ maxWidth: 1320 }}>
          <div ref={viewportRef} style={{ position: "relative" }}>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  gap: GAP,
                  transform: `translateX(${translate}px)`,
                  transition: animate ? "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                }}
              >
                {photos.map((src, i) => {
                  // Active + next card are in colour; cards further back are B&W.
                  const isActive = i === pos;
                  const isNext = i === pos + 1;
                  return (
                    <div
                      key={i}
                      style={{
                        flexShrink: 0,
                        width: cardW,
                        aspectRatio: "16 / 10",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 28px 56px -20px rgba(0,0,0,0.6)",
                      }}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 90vw, 42vw"
                        style={{
                          objectFit: "cover",
                          filter: i <= pos + 1 ? "none" : "grayscale(1) blur(3px)",
                          transition: animate ? "filter 0.5s ease" : "none",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Green arrows half-merged into the row's left & right edges */}
            <GreenArrow
              direction="left"
              x={0}
              size="clamp(46px, 4.8vw, 60px)"
              iconSize={24}
              onClick={prev}
            />
            <GreenArrow
              direction="right"
              x="100%"
              size="clamp(46px, 4.8vw, 60px)"
              iconSize={24}
              onClick={next}
            />
          </div>

          <Dots count={n} active={((pos % n) + n) % n} onSelect={goTo} />
        </Container>
      </div>
    </>
  );
}

// ─── Shared controls ────────────────────────────────────────────────────────
// Solid green circular arrow — absolutely positioned so it half-overlaps a
// card edge (`x` is the horizontal centre point).
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

function Dots({
  count,
  active,
  onSelect,
  dark,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
  dark?: boolean;
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
            background:
              i === active ? "var(--sp-green)" : dark ? "rgba(255,255,255,0.25)" : "#334155",
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

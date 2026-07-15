"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
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
    photo: "/images/engagements/msme-consulting-2.jpeg",
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
    photo: "/images/engagements/textile-women-empowerment-odisha.jpeg",
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
    photo: "/images/engagements/meeting-deputy-cm-odisha.jpeg",
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
    photo: "/images/engagements/csr-farmers-odisha-1.jpeg",
  },
];

const upcomingPlatforms = [
  {
    title: "MSME Textile Investor Meet – Women-Led Cluster Launch, New Delhi",
    desc: "Enabling Textile Growth & Women-Led Employment Opportunities",
  },
];

const highlightPhotos = [
  "/images/engagements/meeting-mos-msme.jpeg",
  "/images/engagements/meeting-cm-delhi.jpeg",
  "/images/engagements/meeting-union-minister-msme.jpeg",
  "/images/engagements/meeting-defence-minister.jpeg",
  "/images/engagements/msme-consulting-1.jpeg",
];

// ─── Page ───────────────────────────────────────────────────────────────────
export default function PlatformsPage() {
  return (
    <>
      <Hero />
      <WhyOurPlatformsMatter />
      <FeaturedPlatforms />
      <UpcomingPlatforms />
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
      <Image
        src="/images/engagements/msme-consulting-2.jpeg"
        alt=""
        aria-hidden="true"
        fill
        quality={100}
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center", opacity: 0.25 }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.65) 0%, rgba(8,8,8,0.82) 60%, #080808 100%)",
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
function WhyOurPlatformsMatter() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const n = designedTo.length;

  // Measure the viewport so the active card centres with neighbours peeking in.
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

  // Three concatenated copies with `pos` in the middle copy → always content on
  // both sides. Silently snap back a copy-length (transition off) when it drifts
  // into a clone, for a seamless infinite loop.
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
    if (reduceMotion || paused) return;
    const t = setInterval(() => {
      setAnimate(true);
      setPos((p) => p + 1);
    }, 3200);
    return () => clearInterval(t);
  }, [reduceMotion, paused]);

  useEffect(() => {
    if (pos >= n && pos < 2 * n) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPos((p) => (p >= 2 * n ? p - n : p + n));
    }, 560);
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
  const cardW = Math.min(vw * 0.4, 440);
  const step = cardW + GAP;
  const translate = vw / 2 - pos * step - cardW / 2;
  const items = [...designedTo, ...designedTo, ...designedTo];

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

        {/* Carousel: prev arrow · three cards · next arrow */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1.6vw, 22px)" }}
        >
          <ArrowButton direction="left" onClick={prev} />

          <div ref={viewportRef} style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: GAP,
                transform: `translateX(${translate}px)`,
                transition: animate ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                willChange: "transform",
              }}
            >
              {items.map((it, i) => (
                <div key={i} style={{ flexShrink: 0, width: cardW }}>
                  <PlatformCard item={it} center={i === pos} instant={!animate} />
                </div>
              ))}
            </div>
          </div>

          <ArrowButton direction="right" onClick={next} />
        </div>

        <Dots count={n} active={((pos % n) + n) % n} onSelect={goTo} />
      </Container>
    </section>
  );
}

// Single "designed to" card — the centre card is dark with a green icon +
// text; the side cards are white with a dark icon + text (matches design).
function PlatformCard({
  item,
  center,
  instant,
}: {
  item: (typeof designedTo)[number];
  center: boolean;
  instant?: boolean;
}) {
  const [hover, setHover] = useState(false);
  // Green accent (icon + title) applies to the centre card and to any card on
  // hover. Uses the darker brand green (var(--sp-green)) so it stays legible on the
  // white side cards too.
  const accent = center || hover;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 16,
        padding: "clamp(18px, 2.3vw, 28px) 18px",
        borderRadius: 0,
        background: center ? "var(--sp-surface-dark)" : "#fff",
        border: center ? "2px solid var(--sp-green)" : "1px solid #E5E7EB",
        transform: center ? "scale(1.05)" : "scale(1)",
        boxShadow: center
          ? "0 24px 48px -22px rgba(0,0,0,0.45)"
          : "0 6px 18px -10px rgba(0,0,0,0.10)",
        transition: instant
          ? "none"
          : "background 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {/* The SVG is used as a CSS mask so its silhouette takes the card's
          icon colour (green on the centre card, dark on the side cards). */}
      <span
        aria-hidden="true"
        style={{
          width: 72,
          height: 72,
          flexShrink: 0,
          backgroundColor: accent ? "var(--sp-green)" : "#1a1a1a",
          WebkitMaskImage: `url(${item.icon})`,
          maskImage: `url(${item.icon})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          transition: instant ? "none" : "background-color 0.4s ease",
        }}
      />
      <h3
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(20px, 2.48vw, 29px)",
          fontWeight: 500,
          lineHeight: 1.2,
          // Bright green on the dark centre card; the darker green on a hovered
          // white side card so it stays legible on white.
          color: center ? "var(--sp-green-bright)" : hover ? "var(--sp-green)" : "#000",
          margin: 0,
          transition: instant ? "none" : "color 0.4s ease",
        }}
      >
        {item.title}
      </h3>
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
                    {/* Image */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 6" }}>
                      <Image
                        src={p.photo}
                        alt={p.title}
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 90vw, 80vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

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

// ─── 4. Upcoming Platforms ──────────────────────────────────────────────────
function UpcomingPlatforms() {
  const [hovered, setHovered] = useState<number | null>(null);

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
        <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
          <SectionHeading>
            UPCOMING{" "}
            <span style={{ fontWeight: 900, WebkitTextStroke: "1px currentColor" }}>PLATFORMS</span>
          </SectionHeading>
          <WavyLine />
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
            position: "relative",
            maxWidth: 1240,
            margin: "0 auto",
          }}
        >
          {upcomingPlatforms.map((p, i) => {
            const hover = hovered === i;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  // Black by default, green on hover (title + text turn black).
                  background: hover ? "var(--sp-green)" : "var(--sp-navy-900)",
                  color: "#fff",
                  borderRadius: 38,
                  padding: "clamp(30px, 4.5vw, 52px) clamp(48px, 7.5vw, 104px)",
                  textAlign: "center",
                  border: hover ? "1px solid var(--sp-green)" : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: hover
                    ? "0 14px 36px rgba(5,161,113,0.28)"
                    : "0 4px 16px rgba(0,0,0,0.08)",
                  // The top card stays sharp; the ones below are softly blurred
                  // (cleared on hover so an interacted card reads clearly).
                  filter: i > 0 && !hover ? "blur(2.5px)" : "none",
                  cursor: "default",
                  transition:
                    "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: "clamp(27px, 3.16vw, 43px)",
                    fontWeight: 500,
                    margin: "0 0 14px",
                    lineHeight: 1.15,
                    color: hover ? "#000" : "#fff",
                    transition: "color 0.3s ease",
                  }}
                >
                  {p.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: "clamp(22px, 2.48vw, 33px)",
                    margin: 0,
                    lineHeight: 1.35,
                    color: hover ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}

// ─── 5. Partner CTA ─────────────────────────────────────────────────────────
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
  const cardW = Math.min(vw * 0.56, 900);
  const translate = -pos * (cardW + GAP);
  const photos = [...highlightPhotos, ...highlightPhotos, ...highlightPhotos];

  // The photo row is rendered OUTSIDE the dark section and pulled up so the
  // section's slanted bottom cuts through the middle of the (full) photos.
  const OVERLAP = 235;

  return (
    <>
      <section
        style={{
          background: "var(--sp-dark-grad-b)",
          // Extra bottom space hosts the upper half of the straddling photos.
          padding: "clamp(56px, 8vw, 80px) 0 clamp(238px, 22vw, 305px)",
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
        <Container style={{ maxWidth: 1340 }}>
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
                  const isActive = i === pos;
                  return (
                    <div
                      key={i}
                      style={{
                        flexShrink: 0,
                        width: cardW,
                        aspectRatio: "16 / 10.5",
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
                        sizes="(max-width: 768px) 90vw, 66vw"
                        style={{
                          objectFit: "cover",
                          // Active photo in colour; the peeking next one in B&W
                          // and slightly blurred.
                          filter: isActive ? "none" : "grayscale(1) blur(3px)",
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

function ArrowButton({
  direction,
  onClick,
  dark,
}: {
  direction: "left" | "right";
  onClick: () => void;
  dark?: boolean;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      // Hidden on mobile — carousels stay usable via auto-rotate + dots.
      className="hidden sm:flex"
      style={{
        flexShrink: 0,
        alignSelf: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid #000",
        background: dark ? "rgba(255,255,255,0.06)" : "#fff",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease",
      }}
    >
      <Icon size={26} color={dark ? "#fff" : "#000"} strokeWidth={2.5} />
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

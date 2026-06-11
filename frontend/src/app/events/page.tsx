"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Network,
  MessagesSquare,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

// ─── Shared design system (matches About + Solutions) ───────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
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

// ─── Data ───────────────────────────────────────────────────────────────────
const designedTo = [
  { icon: Network, title: "Enable strategic networking", desc: "Curated business introductions across MSMEs, enterprises, and policymakers." },
  { icon: MessagesSquare, title: "Encourage industry dialogue", desc: "Structured conversations that turn into long-term partnerships." },
  { icon: Eye, title: "Facilitate business visibility", desc: "Help businesses position themselves in the right rooms with the right audiences." },
  { icon: TrendingUp, title: "Support MSME & startup growth", desc: "Platforms tailored to founders building from the ground up." },
  { icon: Users, title: "Create meaningful engagement", desc: "Genuine exchange between businesses, institutions, and ecosystem stakeholders." },
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
  {
    title: "MSME Textile Investor Meet – Women-Led Cluster Launch, New Delhi",
    desc: "Enabling Textile Growth & Women-Led Employment Opportunities",
  },
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
      {/* Drop the global body grid on this route so it doesn't show through
          the slanted wedges around the dark sections. Restored on navigation
          away (this style unmounts with the page). */}
      <style>{`body { background-image: none !important; }`}</style>
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
                fontSize: "clamp(25px, 3.6vw, 44px)",
                fontWeight: 600,
                borderBottom: "3px solid #fff",
                paddingBottom: 10,
              }}
            >
              PLATFORMS
            </SectionHeading>
          </motion.div>

          <motion.div variants={fadeUp} style={{ margin: "28px 0 22px" }}>
            <PageHeading style={{ fontSize: "clamp(30px, 5.2vw, 64px)" }}>
              <span style={{ display: "block", fontWeight: 600 }}>
                BUSINESS PLATFORMS DESIGNED
              </span>
              <span
                style={{
                  background: "var(--sp-green-500)",
                  color: "#000",
                  display: "inline-block",
                  padding: "13px 8px",
                  marginTop: -6,
                  // Trapezium: vertical, parallel side edges; taller on the
                  // right (same as the About / Solutions headings).
                  clipPath:
                    "polygon(0 13px, 100% 0, 100% 100%, 0 calc(100% - 13px))",
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
              fontSize: "clamp(22px, 2.4vw, 31px)",
              lineHeight: 1.6,
              color: "#fff",
              maxWidth: 1040,
              margin: "0 auto",
            }}
          >
            Our platforms bring together founders, MSMEs, enterprises, policymakers, investors,
            and ecosystem stakeholders to encourage meaningful conversations, strategic
            partnerships, and long-term business opportunities.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── 2. Why Our Platforms Matter ────────────────────────────────────────────
function WhyOurPlatformsMatter() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(1);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const n = designedTo.length;
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

  // Auto-advance every 5s; paused on hover, off under reduced-motion.
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
              WHY OUR{" "}
              <span style={{ color: "var(--sp-green-500)", fontWeight: 900 }}>PLATFORMS MATTER</span>
            </SectionHeading>
          </motion.div>
          <WavyLine />
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(18px, 2vw, 24px)",
              color: "#000",
              maxWidth: 860,
              margin: "22px auto 0",
              lineHeight: 1.6,
            }}
          >
            At Summentor Pro, we believe impactful business ecosystems are built through the right
            conversations, collaborations, and opportunities.
          </motion.p>
        </motion.div>

        {/* Subheading — sentence case (override the heading's uppercase) */}
        <SectionHeading
          style={{
            fontSize: "clamp(24px, 2.9vw, 38px)",
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
                  alignItems: "stretch",
                }}
              >
                {trio.map((idx, pos) => (
                  <PlatformCard key={idx} item={designedTo[idx]!} center={pos === 1} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <ArrowButton direction="right" onClick={next} />
        </div>

        <Dots count={n} active={active} onSelect={goTo} />
      </Container>
    </section>
  );
}

// Single "designed to" card — the centre card is dark with a green icon +
// text; the side cards are white with a dark icon + text (matches design).
function PlatformCard({
  item,
  center,
}: {
  item: (typeof designedTo)[number];
  center: boolean;
}) {
  const Icon = item.icon;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 16,
        padding: "clamp(26px, 3.2vw, 40px) 18px",
        borderRadius: 0,
        background: center ? "#252525" : "#fff",
        border: center ? "2px solid var(--sp-green-600)" : "1px solid #E5E7EB",
        transform: center ? "scale(1.05)" : "scale(1)",
        boxShadow: center
          ? "0 24px 48px -22px rgba(0,0,0,0.45)"
          : "0 6px 18px -10px rgba(0,0,0,0.10)",
        transition: "background 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      <Icon
        size={40}
        color={center ? "var(--sp-green-400)" : "#1a1a1a"}
        strokeWidth={2}
        style={{ transition: "color 0.4s ease" }}
      />
      <h3
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(18px, 2vw, 24px)",
          fontWeight: 600,
          lineHeight: 1.3,
          color: center ? "var(--sp-green-400)" : "#000",
          margin: 0,
          transition: "color 0.4s ease",
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
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = featuredPlatforms.length - 1;

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

  const GAP = 24;
  const cardW = Math.min(vw * 0.78, 1080);
  const translate = -index * (cardW + GAP);

  // Auto-advance paused on hover and disabled for reduced-motion visitors.
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
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container>
        <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
          <SectionHeading>
            FEATURED <span style={{ color: "var(--sp-green-500)", fontWeight: 900 }}>PLATFORMS</span>
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
                transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {featuredPlatforms.map((p, i) => {
                const isActive = i === index;
                return (
                  <div
                    key={p.title}
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
                      transition: "filter 0.45s ease, opacity 0.45s ease",
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 8" }}>
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
                    <div style={{ padding: "clamp(26px, 3.6vw, 44px)" }}>
                      <h3
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(27px, 3.1vw, 41px)",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.01em",
                          color: "#fff",
                          margin: "0 0 14px",
                          lineHeight: 1.2,
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(20px, 2.1vw, 27px)",
                          lineHeight: 1.5,
                          color: "#fff",
                          margin: "0 0 24px",
                        }}
                      >
                        {p.desc}
                      </p>
                      <div style={{ height: 2, background: "rgba(255,255,255,0.85)", margin: "0 0 22px" }} />
                      <p
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: "clamp(20px, 2.1vw, 27px)",
                          fontWeight: 700,
                          color: "#fff",
                          margin: "0 0 16px",
                        }}
                      >
                        The platform brings together:
                      </p>
                      <ul
                        style={{
                          margin: "0 0 26px",
                          paddingLeft: 26,
                          listStyleType: "disc",
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        {p.bringsTogether.map((item) => (
                          <li
                            key={item}
                            style={{
                              fontFamily: "var(--sp-font-sans)",
                              fontSize: "clamp(20px, 2.2vw, 27px)",
                              color: "#fff",
                              lineHeight: 1.45,
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
                          padding: "11px 60px",
                          borderRadius: 999,
                          border: "2px solid var(--sp-green-500)",
                          color: "#fff",
                          textDecoration: "none",
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: 29,
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "var(--sp-green-500)";
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
          <GreenArrow direction="left" x={0} onClick={() => setIndex((i) => (i <= 0 ? last : i - 1))} />
          <GreenArrow direction="right" x={cardW} onClick={() => setIndex((i) => (i >= last ? 0 : i + 1))} />
        </div>

        <Dots count={featuredPlatforms.length} active={index} onSelect={setIndex} />
      </Container>
    </section>
  );
}

// ─── 4. Upcoming Platforms ──────────────────────────────────────────────────
function UpcomingPlatforms() {
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
        <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
          <SectionHeading>
            UPCOMING <span style={{ color: "var(--sp-green-600)" }}>PLATFORMS</span>
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
            gap: 16,
            position: "relative",
            maxWidth: 880,
            margin: "0 auto",
          }}
        >
          {upcomingPlatforms.map((p, i) => {
            const highlighted = i === 0;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  background: highlighted
                    ? "var(--sp-green-500)"
                    : "var(--sp-navy-900)",
                  color: highlighted ? "#000" : "#fff",
                  borderRadius: 10,
                  padding: "clamp(20px, 4vw, 26px) clamp(20px, 5vw, 32px)",
                  textAlign: "center",
                  border: highlighted
                    ? "1px solid var(--sp-green-600)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: highlighted
                    ? "0 12px 32px rgba(5,161,113,0.18)"
                    : "0 4px 16px rgba(0,0,0,0.08)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 18,
                    fontWeight: 700,
                    margin: "0 0 6px",
                    lineHeight: 1.35,
                  }}
                >
                  {p.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 15,
                    margin: 0,
                    lineHeight: 1.5,
                    color: highlighted
                      ? "rgba(10,10,10,0.78)"
                      : "rgba(255,255,255,0.72)",
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
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          style={{ textAlign: "center", position: "relative" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading>
              PARTNER WITH OUR <span style={{ color: "var(--sp-green-600)" }}>PLATFORMS</span>
            </SectionHeading>
          </motion.div>
          <WavyLine />

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 16,
              color: "#4B5563",
              maxWidth: 820,
              margin: "20px auto 32px",
              lineHeight: 1.7,
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
            <PartnerPill href="/contact">Attend a Platform</PartnerPill>
            <PartnerPill href="/contact">Explore Collaborations</PartnerPill>
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
        padding: "14px 26px",
        borderRadius: 999,
        border: "1.5px solid var(--sp-green-600)",
        background: filled ? "var(--sp-green-600)" : "transparent",
        color: filled ? "#fff" : "#000",
        textDecoration: "none",
        fontFamily: "var(--sp-font-sans)",
        fontSize: 15,
        fontWeight: 600,
        transition: CARD_TRANSITION,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--sp-green-600)";
        el.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = filled ? "var(--sp-green-600)" : "transparent";
        el.style.color = filled ? "#fff" : "#000";
      }}
    >
      {children}
    </Link>
  );
}

// ─── 6. Platform Highlights (B&W photo carousel) ────────────────────────────
function PlatformHighlights() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const perPage = 2;
  const maxIndex = Math.max(0, highlightPhotos.length - perPage);

  // Auto-advance disabled for reduced-motion visitors (arrows/dots remain).
  useEffect(() => {
    if (reduceMotion) return;
    const t = setTimeout(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 5500);
    return () => clearTimeout(t);
  }, [index, maxIndex, reduceMotion]);

  const visible = highlightPhotos.slice(index, index + perPage);

  return (
    <section
      style={{
        background: "var(--sp-dark-grad-b)",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
        // Top slant only — Footer below is also dark, no slant needed there.
        clipPath: "polygon(0 var(--sp-slant), 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <Container>
        <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
          <SectionHeading dark>
            PLATFORM <span style={{ color: "var(--sp-green-400)" }}>HIGHLIGHTS</span>
          </SectionHeading>
          <WavyLine />
        </div>

        <div className="flex items-stretch gap-4" style={{ position: "relative" }}>
          <ArrowButton
            direction="left"
            dark
            onClick={() => setIndex((i) => (i <= 0 ? maxIndex : i - 1))}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {visible.map((src, i) => (
              <motion.div
                key={src + index}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
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
                  quality={100}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  style={{ objectFit: "cover", filter: "grayscale(1)" }}
                />
              </motion.div>
            ))}
          </div>
          <ArrowButton
            direction="right"
            dark
            onClick={() => setIndex((i) => (i >= maxIndex ? 0 : i + 1))}
          />
        </div>

        <Dots count={maxIndex + 1} active={index} onSelect={setIndex} dark />
      </Container>
    </section>
  );
}

// ─── Shared controls ────────────────────────────────────────────────────────
// Solid green circular arrow — absolutely positioned so it half-overlaps a
// card edge (`x` is the horizontal centre point).
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
        width: "clamp(52px, 5.4vw, 64px)",
        height: "clamp(52px, 5.4vw, 64px)",
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
      <Icon size={26} color="#fff" strokeWidth={2.4} />
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
              i === active
                ? "var(--sp-green-500)"
                : dark
                  ? "rgba(255,255,255,0.25)"
                  : "#334155",
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

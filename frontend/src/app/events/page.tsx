"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Network,
  MessagesSquare,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import Typewriter from "@/components/ui/Typewriter";

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
        background: "var(--sp-dark-bg)",
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
            "linear-gradient(to bottom, rgba(6,14,8,0.65) 0%, rgba(6,14,8,0.82) 60%, #060e08 100%)",
        }}
      />

      <Container>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          style={{ position: "relative", textAlign: "center", maxWidth: 1000, margin: "0 auto" }}
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
              PLATFORMS
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(30px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 1.15,
              margin: "28px 0 22px",
            }}
          >
            BUSINESS PLATFORMS DESIGNED
            <br />
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
              <Typewriter
                text="AROUND COLLABORATION, GROWTH &"
                startDelay={550}
              />
            </span>
            <br />
            <span style={{ marginTop: 8, display: "inline-block" }}>
              INDUSTRY ENGAGEMENT
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.75,
              color: "#CBD5E1",
              maxWidth: 820,
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
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const perPage = 3;
  const maxIndex = Math.max(0, designedTo.length - perPage);
  const visible = designedTo.slice(index, index + perPage);

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
          "linear-gradient(rgba(10,26,13,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,26,13,0.045) 1px, transparent 1px)",
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
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 3.4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--sp-navy-900)",
              margin: 0,
            }}
          >
            WHY OUR <span style={{ color: "var(--sp-green-600)" }}>PLATFORMS MATTER</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 16,
              color: "#6B7280",
              maxWidth: 720,
              margin: "20px auto 0",
              lineHeight: 1.65,
            }}
          >
            At Summentor Pro, we believe impactful business ecosystems are built through the right
            conversations, collaborations, and opportunities.
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
          Our platforms are designed to:
        </p>

        <div className="flex items-stretch gap-4" style={{ position: "relative" }}>
          <ArrowButton
            direction="left"
            onClick={() => setIndex((i) => (i <= 0 ? maxIndex : i - 1))}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {visible.map((card, i) => {
              const dark = hovered === i;
              const Icon = card.icon;
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
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    cursor: "default",
                    boxShadow: dark
                      ? "0 18px 40px rgba(0,0,0,0.20)"
                      : "0 2px 12px rgba(0,0,0,0.06)",
                    transition: CARD_TRANSITION,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: dark ? "var(--sp-green-600)" : "var(--sp-green-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      transition: `background 0.45s ${HOVER_CSS_EASE}`,
                    }}
                  >
                    <Icon
                      size={20}
                      color={dark ? "#fff" : "var(--sp-green-700)"}
                      strokeWidth={2}
                    />
                  </div>
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
                      color: dark ? "#9CA3AF" : "#6B7280",
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
            onClick={() => setIndex((i) => (i >= maxIndex ? 0 : i + 1))}
          />
        </div>

        <Dots count={maxIndex + 1} active={index} onSelect={setIndex} />
      </Container>
    </section>
  );
}

// ─── 3. Featured Platforms ──────────────────────────────────────────────────
function FeaturedPlatforms() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = featuredPlatforms[index]!;
  const last = featuredPlatforms.length - 1;

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
          "linear-gradient(rgba(10,26,13,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,26,13,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container>
        <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
          <h2
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 3.4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--sp-navy-900)",
              margin: 0,
            }}
          >
            FEATURED <span style={{ color: "var(--sp-green-600)" }}>PLATFORMS</span>
          </h2>
        </div>

        <div className="flex items-stretch gap-4">
          <ArrowButton
            direction="left"
            onClick={() => setIndex((i) => (i <= 0 ? last : i - 1))}
          />
          <div style={{ flex: 1, position: "relative", minHeight: 380 }}>
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
                <div
                  className="min-h-55 md:min-h-80"
                  style={{ position: "relative" }}
                >
                  <Image
                    src={active.photo}
                    alt={active.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    padding: "clamp(22px, 4.5vw, 36px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 0 14px",
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
                      color: "#CBD5E1",
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
                      margin: "0 0 12px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    The platform brings together:
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                    {active.bringsTogether.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontFamily: "var(--sp-font-sans)",
                          fontSize: 15,
                          color: "#9CA3AF",
                          paddingLeft: 16,
                          position: "relative",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 9,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--sp-green-500)",
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <ArrowButton
            direction="right"
            onClick={() => setIndex((i) => (i >= last ? 0 : i + 1))}
          />
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
        backgroundImage:
          "linear-gradient(rgba(10,26,13,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,26,13,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="left" />
      <Container>
        <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
          <h2
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 3.4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--sp-navy-900)",
              margin: 0,
            }}
          >
            UPCOMING <span style={{ color: "var(--sp-green-600)" }}>PLATFORMS</span>
          </h2>
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
                  color: highlighted ? "var(--sp-navy-900)" : "#fff",
                  borderRadius: 10,
                  padding: "clamp(20px, 4vw, 26px) clamp(20px, 5vw, 32px)",
                  textAlign: "center",
                  border: highlighted
                    ? "1px solid var(--sp-green-600)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: highlighted
                    ? "0 12px 32px rgba(34,197,94,0.18)"
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
                      ? "rgba(10,26,13,0.78)"
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
        backgroundImage:
          "linear-gradient(rgba(10,26,13,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,26,13,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
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
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 3.4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--sp-navy-900)",
              margin: 0,
            }}
          >
            PARTNER WITH OUR <span style={{ color: "var(--sp-green-600)" }}>PLATFORMS</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: 16,
              color: "#6B7280",
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
        color: filled ? "#fff" : "var(--sp-navy-900)",
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
        el.style.color = filled ? "#fff" : "var(--sp-navy-900)";
      }}
    >
      {children}
    </Link>
  );
}

// ─── 6. Platform Highlights (B&W photo carousel) ────────────────────────────
function PlatformHighlights() {
  const [index, setIndex] = useState(0);
  const perPage = 2;
  const maxIndex = Math.max(0, highlightPhotos.length - perPage);

  useEffect(() => {
    const t = setTimeout(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 5500);
    return () => clearTimeout(t);
  }, [index, maxIndex]);

  const visible = highlightPhotos.slice(index, index + perPage);

  return (
    <section
      style={{
        background: "var(--sp-dark-bg)",
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
        // Top slant only — Footer below is also dark, no slant needed there.
        clipPath: "polygon(0 var(--sp-slant), 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <Container>
        <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
          <h2
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 3.4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#fff",
              margin: 0,
            }}
          >
            PLATFORM <span style={{ color: "var(--sp-green-400)" }}>HIGHLIGHTS</span>
          </h2>
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
        border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid #D1D5DB",
        background: dark ? "rgba(255,255,255,0.04)" : "#fff",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease",
      }}
    >
      <Icon size={18} color={dark ? "#fff" : "#374151"} />
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
            width: i === active ? 22 : 8,
            height: 8,
            borderRadius: 4,
            background:
              i === active
                ? "var(--sp-green-500)"
                : dark
                  ? "rgba(255,255,255,0.18)"
                  : "#D1D5DB",
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

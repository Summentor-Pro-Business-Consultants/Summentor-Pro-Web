"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import PageHeading from "@/components/ui/PageHeading";
import Typewriter from "@/components/ui/Typewriter";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

interface Solution {
  id: string;
  pill: string;
  title: string;
  paragraphs: string[];
  listLabel: string;
  list: string[];
}

const solutions: Solution[] = [
  {
    id: "consulting",
    pill: "Strategic Consulting",
    title: "Strategic Consulting",
    paragraphs: [
      "We support businesses with strategic guidance focused on growth, partnerships, expansion opportunities, and stakeholder engagement.",
    ],
    listLabel: "Services Include",
    list: [
      "Market expansion strategy",
      "Business partnerships",
      "Stakeholder engagement",
      "Ecosystem mapping",
      "Growth advisory",
      "Industry collaborations",
    ],
  },
  {
    id: "government",
    pill: "Govt. & Industry Facilitation",
    title: "Govt. & Industry Facilitation",
    paragraphs: [
      "We work towards enabling stronger collaboration between businesses, industry stakeholders, and institutional ecosystems.",
      "Our focus includes facilitating meaningful engagement opportunities, industrial growth discussions, and ecosystem development initiatives.",
    ],
    listLabel: "Areas of Focus",
    list: [
      "Government-industry engagement",
      "Industrial facilitation support",
      "MSME ecosystem initiatives",
      "Strategic stakeholder coordination",
      "Institutional collaborations",
    ],
  },
  {
    id: "ecosystems",
    pill: "Business Ecosystems",
    title: "Industry Platforms & Business Ecosystems",
    paragraphs: [
      "We curate high-impact business platforms that bring together founders, enterprises, policymakers, investors, and ecosystem enablers.",
      "These platforms are designed to encourage collaboration, business visibility, networking, and knowledge exchange.",
    ],
    listLabel: "Platforms Include",
    list: [
      "Industry summits",
      "Business conferences",
      "Strategic roundtables",
      "Networking forums",
      "Leadership dialogues",
    ],
  },
  {
    id: "networking",
    pill: "Business Networking",
    title: "ConnectNow — Business Networking Platform",
    paragraphs: [
      "ConnectNow is our dedicated business networking initiative designed to help businesses generate qualified connections and meaningful opportunities through curated engagement formats.",
    ],
    listLabel: "Platform Highlights",
    list: [
      "Curated business introductions",
      "Networking meetups",
      "One-on-one business interactions",
      "Lead engagement support",
      "Relationship-building opportunities",
    ],
  },
  {
    id: "brand",
    pill: "Brand & Market Growth",
    title: "Brand & Market Growth",
    paragraphs: [
      "We help businesses strengthen visibility, market positioning, and outreach through strategic engagement and ecosystem-driven initiatives.",
    ],
    listLabel: "Areas Include",
    list: [
      "Brand positioning",
      "Market visibility",
      "Strategic outreach",
      "Industry engagement",
      "Business communication support",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Hero />
      <SolutionTabs />
      <GrowthCTA />
    </>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────
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
        src="/images/engagements/meeting-union-minister-msme.jpeg"
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
              SOLUTIONS
            </span>
          </motion.div>

          <motion.div variants={fadeUp} style={{ margin: "28px 0 22px" }}>
            <PageHeading>
              STRATEGIC SOLUTIONS DESIGNED FOR
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
                <Typewriter text="GROWTH & BUSINESS ENGAGEMENT" startDelay={550} />
              </span>
            </PageHeading>
          </motion.div>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.75,
              color: "#EBEEF2",
              maxWidth: 780,
              margin: "0 auto",
            }}
          >
            We help businesses, MSMEs, startups, and institutions strengthen their market
            presence, build strategic relationships, and explore growth opportunities through
            consulting, engagement platforms, and ecosystem-driven initiatives.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── Solutions tabs ─────────────────────────────────────────────────────────
function SolutionTabs() {
  const [activeId, setActiveId] = useState(solutions[1]!.id);
  const active = solutions.find((s) => s.id === activeId) ?? solutions[0]!;

  return (
    <section
      style={{
        background: "#F9FAFB",
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
        <div
          className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10"
          style={{ alignItems: "stretch", position: "relative" }}
        >
          {/* Left: pill buttons */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="flex flex-col gap-4"
            style={{ justifyContent: "center" }}
          >
            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--sp-green-700)",
                margin: "0 0 4px 4px",
              }}
            >
              Our Solutions
            </p>
            {solutions.map((s) => {
              const isActive = s.id === activeId;
              return (
                <motion.button
                  key={s.id}
                  variants={fadeUp}
                  // Hover activates (matches ProcessSection on home). Click +
                  // focus kept for touch + keyboard access.
                  onMouseEnter={() => setActiveId(s.id)}
                  onFocus={() => setActiveId(s.id)}
                  onClick={() => setActiveId(s.id)}
                  style={{
                    textAlign: "left",
                    padding: "16px 24px",
                    borderRadius: 999,
                    border: "1.5px solid var(--sp-green-600)",
                    background: isActive ? "var(--sp-green-600)" : "transparent",
                    color: isActive ? "#fff" : "var(--sp-navy-900)",
                    cursor: "pointer",
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 15,
                    fontWeight: 600,
                    boxShadow: isActive
                      ? "0 8px 22px rgba(22,163,74,0.25)"
                      : "0 1px 2px rgba(0,0,0,0.03)",
                    transition:
                      "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  {s.pill}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Right: dark content card */}
          <div style={{ position: "relative", minHeight: 420 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{
                  background: "var(--sp-navy-900)",
                  borderRadius: 14,
                  padding: "clamp(22px, 4.5vw, 32px) clamp(22px, 5vw, 36px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 12px 36px rgba(10,10,10,0.18)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 18px",
                    lineHeight: 1.3,
                  }}
                >
                  {active.title}
                </h2>

                {active.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: "#EBEEF2",
                      margin: i === active.paragraphs.length - 1 ? "0 0 24px" : "0 0 14px",
                    }}
                  >
                    {p}
                  </p>
                ))}

                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.04em",
                    margin: "0 0 12px",
                  }}
                >
                  {active.listLabel}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
                  {active.list.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 16,
                        color: "#EBEEF2",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        lineHeight: 1.5,
                      }}
                    >
                      <img
                        src="/icons/check.svg"
                        alt=""
                        aria-hidden="true"
                        style={{ width: 20, height: 20, flexShrink: 0, marginTop: 2 }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Green CTA band ─────────────────────────────────────────────────────────
function GrowthCTA() {
  return (
    <section
      style={{
        background: "#fff",
        backgroundImage:
          "linear-gradient(rgba(10,10,10,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.045) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        padding: "clamp(40px, 6vw, 60px) 0 clamp(64px, 10vw, 100px)",
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            background: "var(--sp-green-600)",
            borderRadius: 22,
            padding: "clamp(36px, 6vw, 56px) clamp(28px, 6vw, 56px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            overflow: "hidden",
            position: "relative",
            flexWrap: "wrap",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              background:
                "radial-gradient(ellipse at bottom right, rgba(255,255,255,0.10) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, flex: "1 1 380px" }}>
            <h2
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: "clamp(26px, 3.8vw, 46px)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.01em",
                color: "#fff",
                margin: "0 0 18px",
                lineHeight: 1.1,
              }}
            >
              LOOKING TO EXPLORE
              <br />
              STRATEGIC GROWTH
              <br />
              OPPORTUNITIES?
            </h2>
            <p
              style={{
                fontFamily: "var(--sp-font-sans)",
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.88)",
                margin: "0 0 22px",
                maxWidth: 520,
              }}
            >
              Connect with us to explore how Summentor Pro can support your business through
              consulting, strategic engagement, industry platforms, and growth-focused initiatives.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                background: "var(--sp-navy-900)",
                color: "#fff",
                fontFamily: "var(--sp-font-sans)",
                fontSize: 14,
                fontWeight: 600,
                padding: "12px 24px",
                borderRadius: 8,
                textDecoration: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              Schedule a Consultation →
            </Link>
          </div>

          {/* Upward arrow illustration */}
          <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
            <svg
              width="180"
              height="160"
              viewBox="0 0 180 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M20 140 L130 30" stroke="white" strokeWidth="14" strokeLinecap="round" />
              <path
                d="M70 30 L140 30 L140 100"
                stroke="white"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

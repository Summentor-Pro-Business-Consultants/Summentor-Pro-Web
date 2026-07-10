"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";

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
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - var(--sp-slant)))",
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
                fontSize: "clamp(23px, 3.31vw, 40px)",
                fontWeight: 600,
                borderBottom: "3px solid #fff",
                paddingBottom: 10,
              }}
            >
              SOLUTIONS
            </SectionHeading>
          </motion.div>

          <motion.div variants={fadeUp} style={{ margin: "28px 0 22px" }}>
            <PageHeading style={{ fontSize: "clamp(28px, 4.78vw, 59px)" }}>
              <span style={{ display: "block", fontWeight: 600 }}>
                STRATEGIC SOLUTIONS DESIGNED FOR
              </span>
              <span
                style={{
                  background: "#05a171",
                  color: "#000",
                  display: "inline-block",
                  padding: "13px 8px",
                  marginTop: -6,
                  // Trapezium: vertical, parallel side edges; taller on the
                  // right (same as the About page heading).
                  clipPath: "polygon(0 13px, 100% 0, 100% 100%, 0 calc(100% - 13px))",
                }}
              >
                GROWTH &amp; BUSINESS ENGAGEMENT
              </span>
            </PageHeading>
          </motion.div>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(20px, 2.21vw, 29px)",
              lineHeight: 1.35,
              color: "#fff",
              maxWidth: 1040,
              margin: "0 auto",
            }}
          >
            We help businesses, MSMEs, startups, and institutions strengthen their market presence,
            build strategic relationships, and explore growth opportunities through consulting,
            engagement platforms, and ecosystem-driven initiatives.
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
        padding: "clamp(56px, 8vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EdgeGreenGradient side="right" />
      <Container>
        <div
          className="grid grid-cols-1 md:grid-cols-[440px_1fr] gap-10"
          style={{ alignItems: "stretch", position: "relative" }}
        >
          {/* Left: pill buttons */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="flex flex-col gap-4"
            style={{ justifyContent: "center", marginLeft: "clamp(-48px, -3vw, -12px)" }}
          >
            {solutions.map((s, i) => {
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
                    padding: "18px 26px",
                    borderRadius: 999,
                    border: "1.5px solid #05a171",
                    background: isActive ? "#05a171" : "transparent",
                    color: isActive ? "#fff" : "#000",
                    cursor: "pointer",
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: "clamp(17px, 1.75vw, 23px)",
                    fontWeight: 600,
                    boxShadow: isActive
                      ? "0 8px 22px rgba(22,163,74,0.25)"
                      : "0 1px 2px rgba(0,0,0,0.03)",
                    transition: "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  <span style={{ color: isActive ? "#fff" : "#05a171" }}>{i + 1}.</span> {s.pill}
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
                  padding: "clamp(30px, 5vw, 46px) clamp(30px, 5.5vw, 50px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 12px 36px rgba(10,10,10,0.18)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: "clamp(24px, 2.67vw, 33px)",
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 20px",
                    lineHeight: 1.18,
                  }}
                >
                  {active.title}
                </h2>

                {active.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(17px, 1.75vw, 21px)",
                      lineHeight: 1.3,
                      color: "#fff",
                      margin: i === active.paragraphs.length - 1 ? "0 0 28px" : "0 0 14px",
                    }}
                  >
                    {p}
                  </p>
                ))}

                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: "clamp(17px, 1.75vw, 21px)",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.01em",
                    margin: "0 0 14px",
                  }}
                >
                  {active.listLabel}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                  {active.list.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: "clamp(16px, 1.66vw, 20px)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        lineHeight: 1.2,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#05a171",
                          flexShrink: 0,
                          marginTop: "0.55em",
                        }}
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

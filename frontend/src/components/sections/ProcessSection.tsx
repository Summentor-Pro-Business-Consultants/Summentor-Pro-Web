"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const tabs = [
  {
    id: "textile",
    label: "Textile\nEmpowerment",
    title: "Textile & Women Empowerment Initiative – Odisha",
    desc: "Supported the establishment of a textile unit in Balasore, Odisha focused on creating employment opportunities for women through skilling, stitching, and livelihood development initiatives.",
    bullets: [
      "Women empowerment",
      "Rural employment",
      "Skill development",
      "MSME support",
    ],
    photo: "/images/engagements/textile-women-empowerment-odisha.jpeg",
    photoAlt: "Textile & Women Empowerment Initiative – Odisha",
  },
  {
    id: "msme",
    label: "MSME\nConsulting",
    title: "MSME Consulting & Government-Industry Engagement",
    desc: "We support MSMEs and businesses in building meaningful B2G connections by facilitating government-industry engagement, identifying relevant project opportunities and enabling strategic conversations with institutional stakeholders.",
    bullets: [
      "MSME growth consulting",
      "B2G connection facilitation",
      "Government relations",
      "Institutional stakeholder engagement",
      "Project opportunity mapping",
      "Business expansion strategy",
    ],
    photo: "/images/engagements/msme-consulting-1.jpeg",
    photoAlt: "MSME Consulting & Government-Industry Engagement",
  },
  {
    id: "ecotourism",
    label: "Eco-Tourism\nFacilitation",
    title: "Architectural, Eco-Tourism & Infrastructure Project Facilitation – Northeast India",
    desc: "Facilitated business expansion and project engagement opportunities for a Chennai-based architect in Northeast India, supporting discussions across architectural services, eco-tourism development and infrastructure-related initiatives, including helipad construction projects.",
    bullets: [
      "Business expansion",
      "Architectural project facilitation",
      "Eco-tourism development",
      "Infrastructure engagement",
      "Strategic networking",
      "Regional development opportunities",
    ],
    photo: "/images/engagements/meeting-defence-minister.jpeg",
    photoAlt: "Architectural, Eco-Tourism & Infrastructure Project Facilitation – Northeast India",
  },
  {
    id: "waste",
    label: "Waste-to\nEnergy",
    title: "Biomethanation & Waste-to-Energy Initiative – Assam",
    desc: "Facilitated a biomethanation project in Guwahati, Assam for a Bengaluru-based client focused on sustainable waste management and renewable energy generation.",
    bullets: [
      "Sustainability",
      "Renewable energy",
      "Industrial facilitation",
      "Waste management",
    ],
    photo: "/images/engagements/csr-farmers-odisha-3.jpeg",
    photoAlt: "Biomethanation & Waste-to-Energy Initiative – Assam",
  },
  {
    id: "farmers",
    label: "Farmers\nCSR",
    title: "CSR Initiative for Farmers – Odisha",
    desc: "Supported a CSR-led agricultural initiative in Balasore, Odisha focused on improving rural livelihoods and strengthening agricultural productivity through collaboration with a social entrepreneur. The initiative aimed to introduce new and specialized crop varieties to local farmers to enhance productivity, profitability, and long-term agricultural sustainability.",
    bullets: [
      "CSR engagement",
      "Agricultural development",
      "Farmer training & skilling",
      "Rural ecosystem development",
      "Community impact & sustainability",
      "Seed production awareness & support",
    ],
    photo: "/images/engagements/csr-farmers-odisha-1.jpeg",
    photoAlt: "CSR Initiative for Farmers – Odisha",
  },
];

export default function ProcessSection() {
  const [activeTab, setActiveTab] = useState("textile");
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section
      style={{
        position: "relative",
        // Sit behind the dark section above and slide up by the slant so its
        // solid white fills that section's slanted cut-out (instead of the
        // gridded body background showing through).
        zIndex: 0,
        marginTop: "calc(-1 * var(--sp-slant))",
        background: "#fff",
        paddingTop: "clamp(56px, 8vw, 88px)",
        paddingBottom: "clamp(56px, 8vw, 88px)",
        overflow: "hidden",
      }}
    >
      {/* Soft green wash down the left side — no grid, fully feathered so it
          blends smoothly under the slanted top edge. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "58%",
          height: "100%",
          background:
            "radial-gradient(ellipse 80% 75% at top left, rgba(5,161,113,0.16) 0%, rgba(5,161,113,0.06) 48%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Heading — centered, two lines, wavy underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <SectionHeading>
            IMPACT INITIATIVES &amp;
            <br />
            STRATEGIC ENGAGEMENTS
          </SectionHeading>
          <WavyLine />
        </motion.div>
      </Container>

      {/* Pill bar gets a wider container so longer tab labels stay on two
          lines instead of wrapping to three. */}
      <Container wide style={{ position: "relative", zIndex: 1, maxWidth: 1320 }}>
        {/* Single dark pill bar containing all tabs with dividers */}
        <div
          style={{
            background: "#252525",
            borderRadius: 16,
            padding: "6px",
            display: "flex",
            alignItems: "stretch",
            marginBottom: 52,
            overflow: "hidden",
          }}
        >
          {tabs.map((tab, i) => (
            <div key={tab.id} style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
              {/* Divider between tabs */}
              {i > 0 && (
                <div
                  style={{
                    width: 2,
                    background: "#fff",
                    alignSelf: "stretch",
                    margin: "6px 12px",
                    flexShrink: 0,
                  }}
                />
              )}

              <button
                onMouseEnter={() => setActiveTab(tab.id)}
                onFocus={() => setActiveTab(tab.id)}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: activeTab === tab.id ? "var(--sp-green-600)" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.92)",
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(20px, 2.2vw, 29px)",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  cursor: "pointer",
                  whiteSpace: "pre-line",
                  textAlign: "center",
                  transition: "background 0.22s ease, color 0.22s ease",
                }}
              >
                {tab.label}
              </button>
            </div>
          ))}
        </div>
      </Container>

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* Left: text */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(23px, 2.7vw, 34px)",
                  fontWeight: 800,
                  color: "#000",
                  margin: "0 0 18px 0",
                  lineHeight: 1.22,
                }}
              >
                {current.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(16px, 1.75vw, 21px)",
                  color: "#4b5563",
                  lineHeight: 1.45,
                  margin: "0 0 30px 0",
                  maxWidth: 560,
                }}
              >
                {current.desc}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {current.bullets.map((bullet) => (
                  <li key={bullet} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <img
                      src="/icons/check.svg"
                      alt=""
                      aria-hidden="true"
                      style={{ width: 25, height: 25, flexShrink: 0, marginTop: 2 }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: "clamp(17px, 1.8vw, 22px)",
                        fontWeight: 500,
                        color: "#000",
                        lineHeight: 1.5,
                      }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: photo — square, enlarged */}
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                aspectRatio: "1 / 1",
                width: "100%",
                maxWidth: 480,
                marginLeft: "auto",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <Image
                src={current.photo}
                alt={current.photoAlt}
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";

const tabs = [
  {
    id: "textile",
    label: "Textile\nEmpowerment",
    title: "Textile & Women Empowerment Initiative – Odisha",
    bullets: [
      "Women empowerment & skill development",
      "Self employment & livelihood creation",
      "MSM support & capacity building",
      "Grassroots entrepreneurship facilitation",
    ],
    photo: "/images/engagements/textile-women-empowerment-odisha.jpeg",
    photoAlt: "Textile & Women Empowerment Initiative – Odisha",
  },
  {
    id: "msme",
    label: "MSME\nConsulting",
    title: "MSME Consulting & Government-Industry Engagement",
    bullets: [
      "Strategic advisory for MSMEs",
      "Policy facilitation & government connect",
      "Industry collaboration & networking",
      "Market expansion support",
    ],
    photo: "/images/engagements/msme-consulting-1.jpeg",
    photoAlt: "MSME Consulting & Government-Industry Engagement",
  },
  {
    id: "ecotourism",
    label: "Eco-Tourism\nFacilitation",
    title: "Eco-Tourism Development Initiative",
    bullets: [
      "Community-based tourism development",
      "Sustainable tourism practices",
      "Local partnership facilitation",
      "Rural livelihood through tourism",
    ],
    photo: "/images/engagements/csr-farmers-odisha-2.jpeg",
    photoAlt: "Eco-Tourism Development Initiative",
  },
  {
    id: "waste",
    label: "Waste-to\nEnergy",
    title: "Waste-to-Energy & Clean Tech Platforms",
    bullets: [
      "Green energy ecosystem development",
      "Circular economy facilitation",
      "Industry-academia collaboration",
      "Clean tech policy engagement",
    ],
    photo: "/images/engagements/csr-farmers-odisha-3.jpeg",
    photoAlt: "Waste-to-Energy & Clean Tech Platforms",
  },
  {
    id: "farmers",
    label: "Farmers",
    title: "CSR Initiative for Farmers – Odisha",
    bullets: [
      "Agricultural support & advisory",
      "Rural development programs",
      "Capacity building for farmers",
      "Government scheme facilitation",
    ],
    photo: "/images/engagements/csr-farmers-odisha-1.jpeg",
    photoAlt: "CSR Initiative for Farmers – Odisha",
  },
  {
    id: "csr",
    label: "CSR",
    title: "Corporate Social Responsibility Engagements",
    bullets: [
      "Community impact programs",
      "Stakeholder engagement initiatives",
      "Sustainable growth frameworks",
      "Corporate-community partnerships",
    ],
    photo: "/images/engagements/csr-farmers-odisha-2.jpeg",
    photoAlt: "Corporate Social Responsibility Engagements",
  },
];

function WavyLine() {
  return (
    <svg
      viewBox="0 0 240 14"
      width="180"
      height="14"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "16px auto 0" }}
    >
      <path
        d="M0,7 Q30,0 60,7 T120,7 T180,7 T240,7"
        stroke="var(--sp-green-500)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ProcessSection() {
  const [activeTab, setActiveTab] = useState("textile");
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section
      style={{
        position: "relative",
        background: "#fff",
        paddingTop: 88,
        paddingBottom: 88,
        overflow: "hidden",
      }}
    >
      {/* Green gradient — left side, matching PDF */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background:
            "radial-gradient(ellipse at top left, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.07) 45%, transparent 72%)",
          pointerEvents: "none",
        }}
      />

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Heading — centered, two lines, wavy underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <h2
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(24px, 4vw, 48px)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              color: "#111827",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            IMPACT INITIATIVES &amp;
            <br />
            STRATEGIC ENGAGEMENTS
          </h2>
          <WavyLine />
        </motion.div>

        {/* Single dark pill bar containing all tabs with dividers */}
        <div
          style={{
            background: "#1a1a1a",
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
                    width: 1,
                    background: "rgba(255,255,255,0.12)",
                    alignSelf: "stretch",
                    margin: "8px 0",
                    flexShrink: 0,
                  }}
                />
              )}

              <button
                onMouseEnter={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "14px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: activeTab === tab.id ? "var(--sp-green-600)" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.65)",
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(11px, 1.1vw, 13px)",
                  fontWeight: 600,
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

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* Left: text */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--sp-font-sans)",
                  fontSize: "clamp(20px, 2.5vw, 30px)",
                  fontWeight: 800,
                  color: "#111827",
                  margin: "0 0 28px 0",
                  lineHeight: 1.25,
                }}
              >
                {current.title}
              </h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {current.bullets.map((bullet) => (
                  <li key={bullet} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: "var(--sp-green-500)",
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--sp-font-sans)",
                        fontSize: 15,
                        color: "#374151",
                        lineHeight: 1.65,
                      }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: photo */}
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                height: 320,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={current.photo}
                alt={current.photoAlt}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const pub = (name: string) => "/" + encodeURIComponent(name);

const platforms = [
  {
    title: "MSME & STARTUP INNOVATION SUMMIT",
    desc: "A platform bringing together founders, industry leaders, policymakers, and ecosystem enablers to accelerate innovation, entrepreneurship, growth, and collaboration.",
    photo: pub("MSME Consulting & Government-Industry Engagement 2.jpeg"),
    photoAlt: "MSME & Startup Innovation Summit",
  },
  {
    title: "WOMEN EMPOWERMENT & LEADERSHIP INITIATIVES",
    desc: "Focused dialogues and initiatives designed to encourage leadership, inclusion, and business growth for women entrepreneurs and business professionals.",
    photo: pub("Textile & Women Empowerment Initiative – Odisha.jpeg"),
    photoAlt: "Women Empowerment & Leadership Initiatives",
  },
  {
    title: "STRATEGIC INDUSTRY DIALOGUES",
    desc: "Curated forums enabling businesses and stakeholders to exchange insights, explore opportunities, and build meaningful collaborations.",
    photo: pub("Meeting with Union Minister of MSME.jpeg"),
    photoAlt: "Strategic Industry Dialogues",
  },
];

export default function EventsSection() {
  return (
    <section style={{ background: "#F9FAFB", paddingTop: 80, paddingBottom: 80 }}>
      <Container>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48 }}
        >
          <h2
            style={{
              fontFamily: "var(--sp-font-sans)",
              fontSize: "clamp(22px, 3vw, 34px)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--sp-navy-900)",
              margin: 0,
            }}
          >
            FEATURED INDUSTRY PLATFORMS
          </h2>
        </motion.div>

        {/* Platform cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {platforms.map((platform, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 30 } }}
              style={{
                display: "flex",
                flexDirection: "row",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                background: "#fff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                minHeight: 220,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)";
                el.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Text */}
              <div
                style={{
                  flex: "0 0 60%",
                  padding: "32px 36px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderLeft: "4px solid var(--sp-green-500)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: "clamp(13px, 1.6vw, 16px)",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--sp-navy-900)",
                    margin: "0 0 14px 0",
                  }}
                >
                  {platform.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--sp-font-sans)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#6B7280",
                    margin: 0,
                  }}
                >
                  {platform.desc}
                </p>
              </div>

              {/* Photo */}
              <div style={{ flex: "0 0 40%", position: "relative", overflow: "hidden" }}>
                <img
                  src={platform.photo}
                  alt={platform.photoAlt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

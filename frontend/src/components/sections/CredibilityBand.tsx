"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

// Engagement photos shown in the grid below the heading.
const photos = [
  {
    src: "/images/engagements/gov-industry-participation.jpeg",
    name: "Government & Industry Participation",
  },
  { src: "/images/engagements/msme-consulting-2.jpeg", name: "Government–Industry Engagement" },
  { src: "/images/engagements/strategic-collaborations.jpeg", name: "Strategic Collaborations" },
  { src: "/images/engagements/meeting-mos-msme.jpeg", name: "Minister of State for MSME" },
  { src: "/images/engagements/meeting-defence-minister.jpeg", name: "Defence Minister" },
  { src: "/images/engagements/msme-consulting-1.jpeg", name: "MSME Consulting Engagement" },
];

export default function CredibilityBand() {
  return (
    <section
      style={{
        background: "#fff",
        paddingTop: "clamp(56px, 8vw, 80px)",
        paddingBottom: "clamp(56px, 8vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft green curved gradients glowing in from both edges */}
      <EdgeGreenGradient side="left" position="top" />
      <EdgeGreenGradient side="right" position="bottom" />

      {/* Heading — sits above the photo grid */}
      <Container style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
          style={{ marginBottom: "clamp(30px, 4vw, 52px)" }}
        >
          <SectionHeading>
            TRUSTED BY ECOSYSTEM STAKEHOLDERS,
            <br />
            INDUSTRY LEADERS &amp; BUSINESSES
          </SectionHeading>
          <WavyLine />
        </motion.div>
      </Container>

      {/* Static 3 x 2 grid of engagement photos. Collapses to two columns on
          tablets and one on phones so the images never get too small to read. */}
      <style>{`
        .sp-credibility-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2vw, 28px);
        }
        @media (max-width: 900px) {
          .sp-credibility-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .sp-credibility-grid { grid-template-columns: 1fr; }
        }
        .sp-credibility-card {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 14px 34px -18px rgba(0,0,0,0.40), 0 3px 10px rgba(0,0,0,0.07);
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease;
        }
        .sp-credibility-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sp-credibility-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 26px 54px -20px rgba(0,0,0,0.45), 0 6px 16px rgba(0,0,0,0.12);
        }
        @media (prefers-reduced-motion: reduce) {
          .sp-credibility-card { transition: none; }
          .sp-credibility-card:hover { transform: none; }
        }
      `}</style>
      <Container wide style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          className="sp-credibility-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {photos.map((p) => (
            <motion.figure
              key={p.src}
              className="sp-credibility-card"
              style={{ margin: 0 }}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {/* Names live on in alt text even though the design shows no
                  visible captions — the grid still describes itself. */}
              <img src={p.src} alt={p.name} loading="lazy" />
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

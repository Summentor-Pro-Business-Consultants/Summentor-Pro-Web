"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

// Engagement photos for the continuously-scrolling strip below the heading.
const marqueePhotos = [
  { src: "/images/engagements/meeting-union-minister-msme.jpeg", name: "Union Minister of MSME" },
  { src: "/images/engagements/meeting-mos-msme.jpeg", name: "Minister of State for MSME" },
  { src: "/images/engagements/meeting-cm-delhi.jpeg", name: "Chief Minister of Delhi" },
  { src: "/images/engagements/meeting-deputy-cm-odisha.jpeg", name: "Deputy CM of Odisha" },
  { src: "/images/engagements/meeting-defence-minister.jpeg", name: "Defence Minister" },
  { src: "/images/engagements/msme-consulting-1.jpeg", name: "MSME Consulting Engagement" },
  { src: "/images/engagements/msme-consulting-2.jpeg", name: "Government–Industry Engagement" },
  {
    src: "/images/engagements/textile-women-empowerment-odisha.jpeg",
    name: "Women Empowerment, Odisha",
  },
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

      {/* Heading — sits above the running photo strip */}
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

      {/* Continuously-scrolling premium strip of engagement photos. The track
          holds two copies of the set and slides by -50% so the loop is
          seamless. Pauses on hover and under reduced-motion. */}
      <style>{`
        @keyframes sp-credibility-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .sp-credibility-marquee {
          display: flex;
          width: max-content;
          gap: clamp(18px, 2.1vw, 30px);
          animation: sp-credibility-marquee 34s linear infinite;
          will-change: transform;
        }
        .sp-credibility-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .sp-credibility-marquee { animation: none; }
        }
        .sp-credibility-card {
          position: relative;
          flex-shrink: 0;
          width: clamp(340px, 42vw, 560px);
          aspect-ratio: 16 / 11;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 22px 50px -22px rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.10);
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease;
        }
        .sp-credibility-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sp-credibility-card:hover {
          transform: scale(1.07);
          z-index: 2;
          box-shadow: 0 34px 70px -20px rgba(0,0,0,0.62), 0 10px 24px rgba(0,0,0,0.16);
        }
        .sp-credibility-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,8,8,0.86) 0%, rgba(8,8,8,0.32) 34%, rgba(8,8,8,0) 62%);
          pointer-events: none;
        }
        .sp-credibility-cap {
          position: absolute;
          left: clamp(18px, 2vw, 26px);
          right: clamp(18px, 2vw, 26px);
          bottom: clamp(16px, 1.8vw, 22px);
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
          color: #fff;
          font-family: var(--sp-font-sans);
          font-size: clamp(15px, 1.33vw, 19px);
          font-weight: 600;
          line-height: 1.22;
        }
        .sp-credibility-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(8px, 0.73vw, 10px);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--sp-green-bright);
        }
        .sp-credibility-eyebrow::before {
          content: "";
          width: 22px;
          height: 2px;
          background: var(--sp-green);
        }
      `}</style>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          overflow: "hidden",
          // Vertical breathing room so a hovered (enlarged) card and its shadow
          // aren't clipped by the horizontal overflow mask.
          padding: "clamp(26px, 3.4vw, 50px) 0",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
        }}
      >
        <div className="sp-credibility-marquee">
          {marqueePhotos.map((p) => (
            <MarqueeCard key={p.src} src={p.src} name={p.name} />
          ))}
          {marqueePhotos.map((p) => (
            <MarqueeCard key={`${p.src}-dup`} src={p.src} name={p.name} duplicate />
          ))}
        </div>
      </div>
    </section>
  );
}

// One premium photo card in the running strip. The duplicated second copy is
// hidden from assistive tech so the meeting names aren't announced twice.
function MarqueeCard({ src, name, duplicate }: { src: string; name: string; duplicate?: boolean }) {
  return (
    <figure className="sp-credibility-card" aria-hidden={duplicate} style={{ margin: 0 }}>
      <img src={src} alt={duplicate ? "" : name} loading="lazy" />
      <div className="sp-credibility-scrim" />
      <figcaption className="sp-credibility-cap">
        <span className="sp-credibility-eyebrow">Engagement</span>
        {name}
      </figcaption>
    </figure>
  );
}

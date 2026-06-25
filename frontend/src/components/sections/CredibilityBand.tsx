"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const letters = [
  {
    label: "Support Letter — Ministry of MSME",
    img: "/images/letters/ministry-msme.jpg",
  },
  {
    label: "Supporting Letter — Government of Delhi",
    img: "/images/letters/govt-delhi.jpg",
  },
  {
    label: "Supporting Letter — Ministry of Housing & Urban Affairs",
    img: "/images/letters/ministry-housing-urban-affairs.jpg",
  },
  {
    label: "Supporting Letter — Ministry of Housing & Urban Affairs (2)",
    img: "/images/letters/ministry-housing-urban-affairs-2.jpg",
  },
];

// Engagement photos for the continuously-scrolling strip above the heading.
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
  const [current, setCurrent] = useState(0);
  const perPage = 3;
  const maxIndex = letters.length - perPage; // 4 - 3 = 1, so positions 0 and 1
  const visibleLetters = letters.slice(current, current + perPage);

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
          animation: sp-credibility-marquee 60s linear infinite;
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
          font-size: clamp(17px, 1.55vw, 22px);
          font-weight: 600;
          line-height: 1.22;
        }
        .sp-credibility-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(10px, 0.85vw, 12px);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--sp-green-400);
        }
        .sp-credibility-eyebrow::before {
          content: "";
          width: 22px;
          height: 2px;
          background: var(--sp-green-500);
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
          marginBottom: "clamp(20px, 3vw, 40px)",
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

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
          style={{ marginBottom: 48 }}
        >
          <SectionHeading>
            TRUSTED BY ECOSYSTEM STAKEHOLDERS,
            <br />
            INDUSTRY LEADERS &amp; BUSINESSES
          </SectionHeading>
          <WavyLine />
        </motion.div>

        {/* Government support letters — image only, sharp (pointed) black
            border that turns green on hover. No label / View button. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: 28 }}>
          {visibleLetters.map((letter, i) => (
            <motion.a
              key={letter.img}
              href={letter.img}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={letter.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "block",
                position: "relative",
                width: "100%",
                aspectRatio: "210 / 297",
                overflow: "hidden",
                // Sharp corners + black border → green on hover.
                border: "2px solid #000",
                background: "#fff",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--sp-green-500)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#000";
              }}
            >
              <Image
                src={letter.img}
                alt={letter.label}
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </motion.a>
          ))}
        </div>

        {/* Page indicators — horizontal black dashes; the active page is
            green (replaces the prev/next arrows). */}
        <div className="flex justify-center items-center gap-3" style={{ marginBottom: 64 }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Show letters — page ${i + 1}`}
              style={{
                width: 40,
                height: 4,
                background: i === current ? "var(--sp-green-500)" : "#000",
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                padding: 0,
                transition: "background 0.2s ease",
              }}
            />
          ))}
        </div>
      </Container>
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

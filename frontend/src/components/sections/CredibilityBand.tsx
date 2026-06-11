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

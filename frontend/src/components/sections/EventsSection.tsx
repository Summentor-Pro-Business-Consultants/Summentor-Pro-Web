"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;

const platforms = [
  {
    title: "MSME & STARTUP INNOVATION SUMMIT",
    desc: "A platform bringing together founders, industry leaders, policymakers, and ecosystem enablers to drive conversations around innovation, growth, and collaboration.",
    photo: "/images/engagements/msme-consulting-2.jpeg",
    photoAlt: "MSME & Startup Innovation Summit",
  },
  {
    title: "WOMEN EMPOWERMENT & LEADERSHIP INITIATIVES",
    desc: "Focused dialogues and initiatives designed to encourage leadership, inclusion, and business growth for women entrepreneurs and business professionals.",
    photo: "/images/engagements/textile-women-empowerment-odisha.jpeg",
    photoAlt: "Women Empowerment & Leadership Initiatives",
  },
  {
    title: "STRATEGIC INDUSTRY DIALOGUES",
    desc: "Curated forums enabling businesses and stakeholders to exchange insights, explore opportunities, and build meaningful collaborations.",
    photo: "/images/engagements/meeting-union-minister-msme.jpeg",
    photoAlt: "Strategic Industry Dialogues",
  },
];

export default function EventsSection() {
  return (
    <section
      style={{
        position: "relative",
        // Above the Impact section below (which is pulled up behind this
        // section's slanted bottom so the cut reveals white, not the body
        // grid), but below ServicesGrid above (whose last card straddles in).
        zIndex: 1,
        overflow: "hidden",
        background: "var(--sp-navy-1000)",
        // Grid lines on top, alternating dark gradient (grad-b) underneath.
        backgroundImage:
          "linear-gradient(transparent, rgba(255,255,255,0.04) 1.5px, transparent 3px), linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 1.5px, transparent 3px), var(--sp-dark-grad-b)",
        backgroundSize: "52px 52px, 52px 52px, cover",
        // Extra top padding clears the ~150px straddle of the last "What We Do"
        // card (ConnectNow), whose lower half overlaps this section's top.
        paddingTop: "clamp(185px, 17vw, 215px)",
        paddingBottom: "clamp(72px, 10vw, 110px)",
        // Dark band between two light sections. Bottom edge runs right-up →
        // left-down (bottom-RIGHT raised by the slant, bottom-LEFT at full
        // height) so the white "Impact" section below meets it that way.
        clipPath:
          "polygon(0 var(--sp-slant), 100% 0, 100% calc(100% - var(--sp-slant)), 0 100%)",
      }}
    >
      {/* Soft green curved gradients glowing in from both edges */}
      <EdgeGreenGradient side="left" position="top" intensity={0.22} />
      <EdgeGreenGradient side="right" position="bottom" intensity={0.22} />

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(48px, 7vw, 80px)" }}
        >
          <SectionHeading dark>FEATURED INDUSTRY PLATFORMS</SectionHeading>
          <WavyLine />
        </motion.div>

        {/* Alternating platform rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(56px, 9vw, 96px)" }}>
          {platforms.map((platform, i) => {
            const imageLeft = i % 2 === 1;
            const image = (
              <PlatformImage
                src={platform.photo}
                alt={platform.photoAlt}
                accent={imageLeft ? "left" : "right"}
              />
            );
            const text = (
              <div style={{ display: "flex", gap: "clamp(16px, 2vw, 22px)" }}>
                {/* Green vertical accent bar */}
                <div
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    background: "var(--sp-green-500)",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(26px, 3.5vw, 42px)",
                      fontWeight: 800,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      color: "#fff",
                      lineHeight: 1.18,
                      margin: "0 0 16px 0",
                    }}
                  >
                    {platform.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(20px, 2.3vw, 28px)",
                      lineHeight: 1.45,
                      fontWeight: 400,
                      color: "#ffffff",
                      margin: 0,
                    }}
                  >
                    {platform.desc}
                  </p>
                </div>
              </div>
            );

            return (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, ease: EASE }}
                // Text cell gets more room than the image cell; the wider
                // fraction follows whichever side the text is on.
                className={`grid grid-cols-1 items-center ${
                  imageLeft
                    ? "md:grid-cols-[0.8fr_1.2fr]"
                    : "md:grid-cols-[1.2fr_0.8fr]"
                }`}
                style={{ gap: "clamp(28px, 5vw, 64px)" }}
              >
                {imageLeft ? (
                  <>
                    {image}
                    {text}
                  </>
                ) : (
                  <>
                    {text}
                    {image}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

// ─── Tilted photo with a green geometric accent peeking behind it ───────────
function PlatformImage({
  src,
  alt,
  accent,
}: {
  src: string;
  alt: string;
  accent: "left" | "right";
}) {
  // Image + green accent share the same tilt; the accent is offset toward
  // the outer top corner so it pokes out behind the photo. Sharp corners on
  // both (no border-radius) to match the design.
  const tilt = accent === "right" ? -2.5 : 2.5;
  const accentShift = accent === "right" ? "26px" : "-26px";

  return (
    <div style={{ position: "relative", padding: "26px" }}>
      {/* Green accent block behind — sharp corners */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 26,
          background: "var(--sp-green-500)",
          transform: `rotate(${tilt}deg) translate(${accentShift}, -24px)`,
          zIndex: 0,
        }}
      />
      {/* Photo — sharp corners */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          aspectRatio: "4 / 3",
          overflow: "hidden",
          transform: `rotate(${tilt}deg)`,
          boxShadow: "0 28px 56px -18px rgba(0,0,0,0.7)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          quality={100}
          sizes="(max-width: 768px) 100vw, 45vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );
}

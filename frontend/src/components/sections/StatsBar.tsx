"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;

// Engagement highlights shown in the grid. `num` (when present) is the
// emphasised metric that prefixes the caption label.
const engagements: { img: string; num?: string; label: string }[] = [
  {
    img: "/images/engagements/msme-consulting-2.jpeg",
    num: "3,000+",
    label: "Business Stakeholders Engaged",
  },
  {
    img: "/images/engagements/meeting-union-minister-msme.jpeg",
    label: "Government & Industry Participation Across Strategic Platforms & Initiatives",
  },
  {
    img: "/images/engagements/msme-consulting-1.jpeg",
    label: "Ecosystem Participation Across MSMEs, Enterprises & Institutions",
  },
  {
    img: "/images/engagements/meeting-deputy-cm-odisha.jpeg",
    num: "100+",
    label: "Strategic Collaborations Facilitated",
  },
  {
    img: "/images/engagements/meeting-cm-delhi.jpeg",
    label: "Multi-Sector Industry Platforms Executed",
  },
];

// Separator lines that draw the grid, matching the design. The vertical rules
// run flush into the horizontal one so the lines read as a single connected grid.
const DIVIDER = "rgba(255,255,255,0.32)";
const DIVIDER_W = 2;
// Space between a caption and the horizontal rule (and between the rule and the
// next row's images) — applied as card padding so the vertical rules extend
// across it and touch the horizontal rule.
const ROW_GAP = "clamp(9px, 1.4vw, 16px)";

export default function StatsBar() {
  const topRow = engagements.slice(0, 3);
  const bottomRow = engagements.slice(3);

  // Snap every card to a whole, even pixel width so all divider lines land on
  // integer positions and render at the same weight — otherwise the top row's
  // three cards divide to a fractional width, pushing its dividers onto
  // sub-pixel boundaries where they anti-alias and look fainter than the rest.
  const gridRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(340);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => {
      const raw = (el.clientWidth - 2 * DIVIDER_W) / 3;
      setCardW(Math.max(2, Math.floor(raw / 2) * 2));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Exact width of the three-card grid, so the horizontal rule and both rows
  // share identical edges (and an identical sub-pixel phase).
  const gridW = cardW * 3 + DIVIDER_W * 2;

  return (
    <section
      style={{
        position: "relative",
        // Slide up over AboutSection (this section paints on top) so its top
        // slant cut reveals AboutSection's grid behind, not a blank wedge.
        zIndex: 1,
        marginTop: "calc(-1 * var(--sp-slant))",
        overflow: "hidden",
        background: "var(--sp-navy-1000)",
        backgroundImage:
          "linear-gradient(transparent, rgba(255,255,255,0.04) 1.5px, transparent 3px), linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 1.5px, transparent 3px), var(--sp-dark-grad-b)",
        backgroundSize: "52px 52px, 52px 52px, cover",
        // Slant added back into top padding so the heading keeps its position
        // despite the negative top margin pulling the section up.
        paddingTop: "calc(clamp(64px, 9vw, 96px) + var(--sp-slant))",
        paddingBottom: "clamp(72px, 10vw, 110px)",
        // Top slant runs left-up → right-down (top-LEFT at the top edge,
        // top-RIGHT dropped by the slant). Bottom edge unchanged.
        clipPath: "polygon(0 0, 100% var(--sp-slant), 100% 100%, 0 calc(100% - var(--sp-slant)))",
      }}
    >
      {/* Soft green curved gradients glowing in from both edges */}
      <EdgeGreenGradient side="left" position="bottom" intensity={0.2} />
      <EdgeGreenGradient side="right" position="top" intensity={0.2} />

      <Container wide style={{ position: "relative", zIndex: 1 }}>
        {/* Heading + decorative stroke */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
          style={{ marginBottom: "clamp(40px, 6vw, 68px)" }}
        >
          <SectionHeading dark>
            DRIVING MEANINGFUL
            <br />
            BUSINESS ENGAGEMENTS
          </SectionHeading>
          <WavyLine />
        </motion.div>

        {/* Static grid: three cards on top, two centred below, drawn apart by
            thin divider lines exactly like the design. */}
        <motion.div
          ref={gridRef}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1056, margin: "0 auto" }}
        >
          {/* Inner wrapper is exactly the grid's width so the rule spans the
              rows precisely and every line shares one sub-pixel phase. */}
          <div style={{ width: gridW, maxWidth: "100%", margin: "0 auto" }}>
            <EngagementRow cards={topRow} edge="top" cardW={cardW} />

            {/* Horizontal rule — flush against both rows so the vertical rules
                meet it at clean T-junctions. */}
            <div style={{ height: DIVIDER_W, background: DIVIDER }} />

            <EngagementRow cards={bottomRow} edge="bottom" cardW={cardW} />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// One row of engagement cards, separated by vertical divider lines. Cards keep
// an identical basis and cap so the two centred cards in the bottom row line up
// exactly under the three in the top row. `edge` controls which side carries the
// gap to the horizontal rule; the vertical rules stretch across it and connect.
function EngagementRow({
  cards,
  edge,
  cardW,
}: {
  cards: typeof engagements;
  edge: "top" | "bottom";
  cardW: number;
}) {
  const gapPad = edge === "top" ? { paddingBottom: ROW_GAP } : { paddingTop: ROW_GAP };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}>
      {cards.map((item, i) => (
        <Fragment key={item.img}>
          {i > 0 && <div style={{ width: DIVIDER_W, background: DIVIDER, alignSelf: "stretch" }} />}
          <div
            style={{
              width: cardW,
              flexShrink: 0,
              padding: "0 clamp(12px, 1.6vw, 22px)",
              ...gapPad,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <EngagementCard item={item} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

// One engagement photo + caption — sharp, full colour, gently rounded, with a
// centred white caption beneath. A reserved caption height keeps every image
// bottom on the same baseline so the divider lines read as an even grid.
function EngagementCard({ item }: { item: (typeof engagements)[number] }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 2",
          overflow: "hidden",
          borderRadius: 0,
          boxShadow: "0 16px 34px -18px rgba(0,0,0,0.6)",
        }}
      >
        <Image
          src={item.img}
          alt=""
          fill
          quality={100}
          sizes="(max-width: 768px) 90vw, 30vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <p
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(15px, 1.5vw, 19px)",
          fontWeight: 600,
          lineHeight: 1.3,
          color: "#fff",
          margin: "clamp(12px, 1.4vw, 16px) 0 0",
          // Reserve ~3 lines so every image bottom lands on the same baseline.
          minHeight: "3.4em",
        }}
      >
        {item.num ? `${item.num} ${item.label}` : item.label}
      </p>
    </div>
  );
}

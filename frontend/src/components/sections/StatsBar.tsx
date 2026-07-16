"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
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

// ─── Entrance animation ─────────────────────────────────────────────────────
// When the section scrolls into view, all five cards animate at once, each
// sliding in from a slightly different direction toward its final spot. The
// keyframe multipliers below carry each card past centre and back in a decaying
// oscillation — a lively converge + micro-wobble that smoothly settles to rest.
type Dir = { x: number; y: number; rot: number };
const CARD_DIRECTIONS: Dir[] = [
  { x: -66, y: -48, rot: -7 }, // 0 · top-left   → in from upper-left
  { x: 0, y: -72, rot: 5 }, //    1 · top-centre → straight down from top
  { x: 66, y: -48, rot: 7 }, //   2 · top-right  → in from upper-right
  { x: -60, y: 54, rot: 6 }, //   3 · bottom-left → in from lower-left
  { x: 60, y: 54, rot: -6 }, //   4 · bottom-right → in from lower-right
];
// Decaying oscillation applied to the offset (position) and rotation (wobble).
const CONVERGE = [1, -0.26, 0.13, -0.06, 0.02, 0];
const WOBBLE = [1, -0.45, 0.28, -0.16, 0.08, 0];
const KEY_TIMES = [0, 0.28, 0.48, 0.66, 0.83, 1];
const round2 = (v: number) => Math.round(v * 100) / 100;

// Parent only fades the grid (and its divider lines) in; the cards below carry
// the movement. No stagger — every card starts at the same instant.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

const cardVariants: Variants = {
  hidden: (d: Dir) => ({ opacity: 0, x: d.x, y: d.y, rotate: d.rot }),
  visible: (d: Dir) => ({
    opacity: [0, 1, 1, 1, 1, 1],
    x: CONVERGE.map((m) => round2(d.x * m)),
    y: CONVERGE.map((m) => round2(d.y * m)),
    rotate: WOBBLE.map((m) => round2(d.rot * m)),
    transition: { duration: 1.25, ease: "easeInOut", times: KEY_TIMES },
  }),
};

export default function StatsBar() {
  const reduceMotion = useReducedMotion();
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

        {/* Grid: three cards on top, two centred below, drawn apart by thin
            divider lines. On scroll-in every card converges from a different
            direction with a settling wobble (see cardVariants). */}
        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
          style={{ maxWidth: 1056, margin: "0 auto" }}
        >
          {/* Inner wrapper is exactly the grid's width so the rule spans the
              rows precisely and every line shares one sub-pixel phase. */}
          <div style={{ width: gridW, maxWidth: "100%", margin: "0 auto" }}>
            <EngagementRow
              cards={topRow}
              edge="top"
              cardW={cardW}
              startIndex={0}
              reduceMotion={!!reduceMotion}
            />

            {/* Horizontal rule — flush against both rows so the vertical rules
                meet it at clean T-junctions. */}
            <div style={{ height: DIVIDER_W, background: DIVIDER }} />

            <EngagementRow
              cards={bottomRow}
              edge="bottom"
              cardW={cardW}
              startIndex={3}
              reduceMotion={!!reduceMotion}
            />
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
  startIndex,
  reduceMotion,
}: {
  cards: typeof engagements;
  edge: "top" | "bottom";
  cardW: number;
  startIndex: number;
  reduceMotion: boolean;
}) {
  const gapPad = edge === "top" ? { paddingBottom: ROW_GAP } : { paddingTop: ROW_GAP };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}>
      {cards.map((item, i) => (
        <Fragment key={item.img}>
          {i > 0 && <div style={{ width: DIVIDER_W, background: DIVIDER, alignSelf: "stretch" }} />}
          <motion.div
            variants={reduceMotion ? undefined : cardVariants}
            custom={CARD_DIRECTIONS[startIndex + i]}
            style={{
              width: cardW,
              flexShrink: 0,
              padding: "0 clamp(12px, 1.6vw, 22px)",
              ...gapPad,
              display: "flex",
              flexDirection: "column",
              willChange: "transform",
            }}
          >
            <EngagementCard item={item} />
          </motion.div>
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

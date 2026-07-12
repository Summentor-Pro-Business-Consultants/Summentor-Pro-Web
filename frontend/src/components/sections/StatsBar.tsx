"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import EdgeGreenGradient from "@/components/ui/EdgeGreenGradient";
import SectionHeading from "@/components/ui/SectionHeading";
import WavyLine from "@/components/ui/WavyLine";

const EASE = [0.22, 1, 0.36, 1] as const;

// Engagement highlights shown in the carousel. `num` (when present) is the
// emphasised metric that renders in bold white before the label.
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

export default function StatsBar() {
  const reduceMotion = useReducedMotion();
  const n = engagements.length;
  const [paused, setPaused] = useState(false);

  // Measure the viewport so the active card can be centred with its neighbours
  // peeking in from each side.
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1100);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setVw(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // We render THREE concatenated copies of the list and keep `pos` in the middle
  // copy, so there is always content peeking on both sides. When `pos` drifts
  // into a clone copy we snap it back by one copy-length with the transition
  // momentarily off — an invisible reset that yields a seamless infinite loop.
  const [pos, setPos] = useState(n);
  const [animate, setAnimate] = useState(true);

  const prev = () => {
    setAnimate(true);
    setPos((p) => p - 1);
  };
  const next = () => {
    setAnimate(true);
    setPos((p) => p + 1);
  };

  // Auto-advance every 3.6s; paused on hover, disabled under reduced-motion.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const t = setInterval(() => {
      setAnimate(true);
      setPos((p) => p + 1);
    }, 3600);
    return () => clearInterval(t);
  }, [reduceMotion, paused]);

  // Once a slide into a clone copy has finished, snap back by one copy-length.
  useEffect(() => {
    if (pos >= n && pos < 2 * n) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPos((p) => (p >= 2 * n ? p - n : p + n));
    }, 600);
    return () => clearTimeout(t);
  }, [pos, n]);

  // Re-enable the transition on the frame after a silent snap has painted.
  useEffect(() => {
    if (animate) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [animate]);

  const GAP = 28;
  const cardW = Math.min(vw * 0.3, 380);
  const step = cardW + GAP;
  const translate = vw / 2 - pos * step - cardW / 2;
  // Three copies so both sides always have content to loop into.
  const items = [...engagements, ...engagements, ...engagements];

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
          style={{ marginBottom: "clamp(48px, 7vw, 84px)" }}
        >
          <SectionHeading dark>
            DRIVING MEANINGFUL
            <br />
            BUSINESS ENGAGEMENTS
          </SectionHeading>
          <WavyLine />
        </motion.div>

        {/* Filmstrip carousel: prev arrow · sliding track · next arrow */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 28px)" }}
        >
          <NavArrow direction="left" onClick={prev} />

          <div ref={viewportRef} style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: GAP,
                transform: `translateX(${translate}px)`,
                transition: animate ? "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                willChange: "transform",
              }}
            >
              {items.map((item, i) => (
                <EngagementCard
                  key={i}
                  item={item}
                  center={i === pos}
                  width={cardW}
                  instant={!animate}
                />
              ))}
            </div>
          </div>

          <NavArrow direction="right" onClick={next} />
        </div>
      </Container>
    </section>
  );
}

// One engagement photo + caption. The active (centre) card is larger, in colour
// and sharp; the others are greyscale, blurred and slightly smaller. Scaling
// from the bottom keeps every image's bottom edge on the same baseline.
function EngagementCard({
  item,
  center,
  width,
  instant,
}: {
  item: (typeof engagements)[number];
  center: boolean;
  width: number;
  instant: boolean;
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        width,
        textAlign: "center",
        transformOrigin: "bottom center",
        transform: center ? "scale(1.08)" : "scale(0.9)",
        opacity: center ? 1 : 0.6,
        filter: center ? "none" : "grayscale(1) blur(3px)",
        // Transitions are switched off during the invisible loop-reset snap.
        transition: instant
          ? "none"
          : "transform 0.55s ease, opacity 0.55s ease, filter 0.55s ease",
        position: "relative",
        zIndex: center ? 2 : 1,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
          boxShadow: center
            ? "0 28px 56px -20px rgba(0,0,0,0.6)"
            : "0 14px 32px -18px rgba(0,0,0,0.5)",
        }}
      >
        <Image
          src={item.img}
          alt=""
          fill
          quality={100}
          sizes="(max-width: 768px) 90vw, 33vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <p
        style={{
          fontFamily: "var(--sp-font-sans)",
          fontSize: "clamp(16px, 1.6vw, 22px)",
          lineHeight: 1.25,
          margin: "clamp(12px, 1.4vw, 18px) 0 0",
          // Reserve ~3 lines so every image bottom lands on the same baseline.
          minHeight: "3.75em",
        }}
      >
        {item.num && <span style={{ color: "#fff", fontWeight: 800 }}>{item.num} </span>}
        <span style={{ color: "#fff", fontWeight: 500 }}>{item.label}</span>
      </p>
    </div>
  );
}

// Thin circular chevron arrow (white outline on the dark section).
function NavArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="hidden sm:flex"
      style={{
        flexShrink: 0,
        width: "clamp(40px, 3.4vw, 48px)",
        height: "clamp(40px, 3.4vw, 48px)",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.35)",
        background: "transparent",
        color: "#fff",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#fff";
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <Icon size={22} strokeWidth={2} />
    </button>
  );
}

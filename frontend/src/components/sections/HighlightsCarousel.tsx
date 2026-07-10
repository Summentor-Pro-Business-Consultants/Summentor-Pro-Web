"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const slides = [
  {
    tag: "Summit",
    title: "MSME & Startup Innovation Summit",
    img: "/images/engagements/msme-consulting-2.jpeg",
  },
  {
    tag: "Empowerment",
    title: "Women Empowerment & Leadership",
    img: "/images/engagements/textile-women-empowerment-odisha.jpeg",
  },
  {
    tag: "Engagement",
    title: "Strategic Industry Dialogues",
    img: "/images/engagements/meeting-union-minister-msme.jpeg",
  },
  {
    tag: "Platform",
    title: "ConnectNow Business Networking",
    img: "/images/engagements/msme-consulting-1.jpeg",
  },
  {
    tag: "Initiative",
    title: "CSR Initiative for Farmers – Odisha",
    img: "/images/engagements/csr-farmers-odisha-1.jpeg",
  },
];

const GAP = 24;

export default function HighlightsCarousel() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Default to a sensible desktop width so SSR / first paint lay out cleanly
  // before the client measures the real viewport width.
  const [vw, setVw] = useState(1200);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Measure the carousel viewport so the active card can be centred with the
  // neighbours peeking in from each edge.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setVw(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-advance — paused on hover and disabled under reduced-motion.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reduceMotion, paused]);

  const cardW = Math.min(vw * 0.56, 680);
  const centerOffset = (vw - cardW) / 2;
  const translate = centerOffset - active * (cardW + GAP);

  return (
    <section
      style={{
        position: "relative",
        background: "#fff",
        paddingTop: "clamp(56px, 8vw, 88px)",
        paddingBottom: "clamp(56px, 8vw, 88px)",
        overflow: "hidden",
      }}
    >
      {/* Soft green washes glowing in from both side edges (matches design). */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 28% 60% at 0% 55%, rgba(5,161,113,0.18) 0%, transparent 70%)," +
            "radial-gradient(ellipse 28% 60% at 100% 55%, rgba(5,161,113,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Carousel viewport — full width so the side cards bleed to the edges */}
      <div
        ref={viewportRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: GAP,
            transform: `translateX(${translate}px)`,
            transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {slides.map((slide, i) => {
            const isActive = i === active;
            return (
              <button
                key={slide.title}
                onClick={() => setActive(i)}
                aria-label={`${slide.title} (${slide.tag})`}
                aria-current={isActive}
                style={{
                  flexShrink: 0,
                  width: cardW,
                  aspectRatio: "1.06 / 1",
                  position: "relative",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: "#000",
                  opacity: isActive ? 1 : 0.55,
                  transform: isActive ? "scale(1)" : "scale(0.92)",
                  transition:
                    "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                  boxShadow: isActive
                    ? "0 30px 60px -24px rgba(0,0,0,0.55)"
                    : "0 10px 30px -18px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 90vw, 56vw"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />

                {/* Dark overlay — deeper on inactive cards */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isActive
                      ? "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.55) 100%)"
                      : "rgba(0,0,0,0.55)",
                    transition: "background 0.5s ease",
                  }}
                />

                {/* Centred content — only on the active card */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    textAlign: "center",
                    padding: "0 24px",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.45s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#fff",
                      letterSpacing: "0.02em",
                      padding: "5px 14px",
                      border: "1px solid rgba(255,255,255,0.55)",
                      borderRadius: 4,
                    }}
                  >
                    {slide.tag}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--sp-font-sans)",
                      fontSize: "clamp(18px, 1.93vw, 25px)",
                      fontWeight: 700,
                      color: "#fff",
                      margin: 0,
                      lineHeight: 1.18,
                      maxWidth: 360,
                    }}
                  >
                    {slide.title}
                  </h3>
                  {/* Up-right arrow */}
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    aria-hidden="true"
                    style={{ marginTop: 4 }}
                  >
                    <path
                      d="M16 32 L32 16 M20 16 H32 V28"
                      stroke="#fff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pagination indicators */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          marginTop: "clamp(28px, 4vw, 44px)",
        }}
      >
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <button
              key={slide.title}
              onClick={() => setActive(i)}
              aria-label={`Go to ${slide.title}`}
              aria-current={isActive}
              style={{
                width: isActive ? 34 : 9,
                height: isActive ? 6 : 9,
                borderRadius: isActive ? 3 : "50%",
                background: isActive ? "#05a171" : "#cbd5e1",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.3s ease, height 0.3s ease, background 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

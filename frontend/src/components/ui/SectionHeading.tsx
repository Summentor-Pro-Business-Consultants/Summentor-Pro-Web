import type { ReactNode, CSSProperties } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  /** Render white text instead of dark — for sections on a dark background. */
  dark?: boolean;
  /** Optional style overrides (use sparingly). */
  style?: CSSProperties;
  /** Optional className passthrough (lets framer-motion / Tailwind hooks work). */
  className?: string;
}

/**
 * Canonical section heading — every "ABOUT SUMMENTOR PRO", "DRIVING MEANINGFUL
 * BUSINESS ENGAGEMENTS", "WHAT WE DO" -style heading on the site renders
 * through this component so the size, weight, letter-spacing, and alignment
 * are guaranteed to match across pages. Render rich children (e.g. an
 * inline coloured <span>) directly.
 */
export default function SectionHeading({
  children,
  dark = false,
  style,
  className,
}: SectionHeadingProps) {
  return (
    <h2
      className={className}
      style={{
        fontFamily: "var(--sp-font-sans)",
        fontSize: "clamp(26px, 4vw, 52px)",
        fontWeight: 800,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        color: dark ? "#fff" : "var(--sp-navy-900)",
        lineHeight: 1.15,
        textAlign: "center",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

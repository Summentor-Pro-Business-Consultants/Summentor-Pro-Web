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
        // One shared size for EVERY subheading (consistency). Renders in the
        // Goia display font (forced by the global h2 rule), which ships only
        // SemiBold (600) and Bold (700) — so 700 is the smallest available
        // weight step up from SemiBold.
        fontSize: "clamp(30px, 4.3vw, 54px)",
        fontWeight: 700,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        color: dark ? "#fff" : "#000",
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
